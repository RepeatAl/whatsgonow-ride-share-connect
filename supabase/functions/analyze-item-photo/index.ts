
// Diese Edge Function folgt den Konventionen aus /docs/conventions/roles_and_ids.md
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = "https://orgcruwmxqiwnjnkxpjb.supabase.co";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Einfache Typdefinitionen
interface AnalyzeRequest {
  item_id: string;
  photo_url: string;
  user_id: string;
}

interface AnalysisResult {
  labels: Record<string, number>;
  brandGuess: string | null;
  categoryGuess: string | null;
  confidenceScores: Record<string, number>;
}

// Mock-Analyse für den Anfang - kann später durch echte Vision API ersetzt werden
function mockAnalyzeImage(url: string): AnalysisResult {
  console.log(`Analyzing image: ${url}`);
  
  // Simuliere zufällige Ergebnisse
  const possibleLabels = ["Möbel", "Holz", "Modern", "Antik", "Küche", "Wohnzimmer", "Metall", "Plastik", "Groß", "Klein"];
  const possibleBrands = ["IKEA", "Home24", "Wayfair", "Höffner", "Poco", "XXXLutz", null];
  const possibleCategories = ["Möbel", "Elektronik", "Kleidung", "Spielzeug", "Küchenzubehör", "Dekoration"];
  
  // Wähle zufällig 3-5 Labels aus
  const selectedLabels: Record<string, number> = {};
  const numLabels = Math.floor(Math.random() * 3) + 3; // 3 bis 5 Labels
  
  for (let i = 0; i < numLabels; i++) {
    const label = possibleLabels[Math.floor(Math.random() * possibleLabels.length)];
    const confidence = parseFloat((Math.random() * 0.5 + 0.5).toFixed(2)); // 0.5 bis 1.0
    if (!selectedLabels[label]) {
      selectedLabels[label] = confidence;
    }
  }
  
  // Wähle zufällig eine Marke und Kategorie
  const brandGuess = possibleBrands[Math.floor(Math.random() * possibleBrands.length)];
  const categoryGuess = possibleCategories[Math.floor(Math.random() * possibleCategories.length)];
  
  // Erstelle Konfidenzwerte
  const confidenceScores = {
    overall: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)), // 0.7 bis 1.0
    brand: brandGuess ? parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)) : 0, // 0.6 bis 1.0
    category: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)), // 0.8 bis 1.0
  };
  
  return {
    labels: selectedLabels,
    brandGuess,
    categoryGuess,
    confidenceScores,
  };
}

serve(async (req) => {
  // CORS-Unterstützung
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Prüfe die Authentifizierung
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Nicht authentifiziert" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // JWT-Token extrahieren und Benutzer-ID ermitteln
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Ungültiges Token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Request-Body lesen
    const { item_id, photo_url } = await req.json() as AnalyzeRequest;
    
    if (!item_id || !photo_url) {
      return new Response(
        JSON.stringify({ error: "Fehlende Parameter: item_id oder photo_url" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Überprüfe, ob das Item zum angegebenen Benutzer gehört
    const { data: itemData, error: itemError } = await supabase
      .from("order_items")
      .select("item_id")
      .eq("item_id", item_id)
      .single();
      
    if (itemError || !itemData) {
      return new Response(
        JSON.stringify({ error: "Item nicht gefunden" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing analysis for item: ${item_id} by user: ${user.id}`);

    // Bild analysieren (Mock)
    const analysisResult = mockAnalyzeImage(photo_url);
    
    // Ergebnisse in der Datenbank speichern
    
    // 1. Analyse-Eintrag erstellen
    const { data: analysisData, error: analysisError } = await supabase
      .from("item_analysis")
      .insert({
        item_id,
        user_id: user.id,
        photo_url,
        labels: analysisResult.labels,
        brand_guess: analysisResult.brandGuess,
        confidence_scores: analysisResult.confidenceScores
      })
      .select()
      .single();
      
    if (analysisError) {
      console.error("Fehler beim Speichern der Analyse:", analysisError);
      return new Response(
        JSON.stringify({ error: "Fehler beim Speichern der Analyse" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // 2. Item aktualisieren
    await supabase
      .from("order_items")
      .update({
        category_suggestion: analysisResult.categoryGuess,
        labels_raw: analysisResult.labels,
        analysis_status: "success"
      })
      .eq("item_id", item_id);
    
    return new Response(
      JSON.stringify({
        success: true,
        analysis_id: analysisData.analysis_id,
        results: analysisResult
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Fehler bei der Verarbeitung:", error);
    
    // Wenn ein Item angegeben wurde, versuchen wir den Status auf "error" zu setzen
    try {
      const { item_id } = await req.json() as { item_id?: string };
      if (item_id) {
        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
        await supabase
          .from("order_items")
          .update({ analysis_status: "error" })
          .eq("item_id", item_id);
      }
    } catch (e) {
      // Ignorieren, falls das Update fehlschlägt
      console.error("Fehler beim Aktualisieren des Fehlerstatus:", e);
    }
    
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});


-- Diese Tabelle wird aktuell nur vorbereitet und nicht aktiv genutzt.
-- Sie dient später der Speicherung von Nutzer-Feedback zu Bildanalyse-Vorschlägen.

CREATE TABLE IF NOT EXISTS public.item_analysis_feedback (
  feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES public.order_items(item_id),
  user_id UUID NOT NULL, -- Verwendet auth.uid() für die Verknüpfung
  accepted BOOLEAN NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Aktiviere Row Level Security für die Tabelle
ALTER TABLE public.item_analysis_feedback ENABLE ROW LEVEL SECURITY;

-- Nutzer können ihr eigenes Feedback einsehen
CREATE POLICY "Users can view their own feedback"
ON public.item_analysis_feedback
FOR SELECT
USING (auth.uid() = user_id);

-- Nutzer können ihr eigenes Feedback einfügen
CREATE POLICY "Users can insert their own feedback"
ON public.item_analysis_feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Administratoren können alles Feedback einsehen (für Analysen)
CREATE POLICY "Admins can view all feedback"
ON public.item_analysis_feedback
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- Kommentare zur weiteren Entwicklung:
-- Diese Tabelle soll später verwendet werden, um das Feedback der Nutzer zu den
-- automatischen Vorschlägen aus der Bildanalyse zu speichern. Dies kann zur
-- Verbesserung der KI-gestützten Analysen genutzt werden.

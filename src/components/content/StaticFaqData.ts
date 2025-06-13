
// TEMPORÄR: Statische FAQ-Daten wegen Global Context Bug
// Diese Datei wird nach Isolation durch Supabase-Integration ersetzt

export interface StaticFAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  order_index: number;
}

export const staticFaqData: StaticFAQItem[] = [
  {
    id: "1",
    category: "Allgemein",
    question: "Was ist whatsgonow?",
    answer: "whatsgonow ist eine innovative Crowdlogistik-Plattform, die private und geschäftliche Auftraggeber mit verifizierten Fahrern verbindet. Wir ermöglichen es Ihnen, Transportaufträge schnell, sicher und kosteneffizient abzuwickeln.",
    order_index: 1
  },
  {
    id: "2", 
    category: "Allgemein",
    question: "Wie funktioniert whatsgonow?",
    answer: "Sie erstellen einen Transportauftrag mit Details zu Abholung und Zustellung. Unsere verifizierten Fahrer sehen Ihren Auftrag und können Angebote abgeben. Sie wählen das beste Angebot aus und der Transport wird durchgeführt.",
    order_index: 2
  },
  {
    id: "3",
    category: "Registrierung & Sicherheit", 
    question: "Muss ich mich registrieren?",
    answer: "Für die Nutzung aller Funktionen ist eine kostenlose Registrierung erforderlich. Sie können jedoch bereits als Gast Aufträge und Fahrten einsehen, um sich einen Überblick zu verschaffen.",
    order_index: 1
  },
  {
    id: "4",
    category: "Registrierung & Sicherheit",
    question: "Wie sicher ist whatsgonow?",
    answer: "Alle Fahrer werden von uns verifiziert und haben ein Bewertungssystem. Ihre Daten werden DSGVO-konform verarbeitet und alle Transaktionen sind abgesichert.",
    order_index: 2
  },
  {
    id: "5",
    category: "Aufträge & Matching",
    question: "Wie finde ich Transportaufträge?",
    answer: "Nach der Registrierung können Sie als Fahrer alle verfügbaren Aufträge in Ihrer Region einsehen, filtern und Angebote abgeben. Sie werden auch über passende neue Aufträge benachrichtigt.",
    order_index: 1
  },
  {
    id: "6",
    category: "Aufträge & Matching", 
    question: "Kann ich Preise verhandeln?",
    answer: "Ja, viele Aufträge sind als 'verhandelbar' markiert. Sie können mit dem Auftraggeber über den Chat kommunizieren und einen fairen Preis aushandeln.",
    order_index: 2
  },
  {
    id: "7",
    category: "Bezahlung & Sicherheit",
    question: "Wie funktioniert die Bezahlung?",
    answer: "Die Bezahlung erfolgt sicher über unsere Plattform. Nach erfolgreicher Zustellung wird der Betrag automatisch an den Fahrer überwiesen. Wir unterstützen verschiedene Zahlungsmethoden.",
    order_index: 1
  },
  {
    id: "8",
    category: "Bezahlung & Sicherheit",
    question: "Welche Gebühren fallen an?",
    answer: "Für Auftraggeber ist die Nutzung kostenfrei. Fahrer zahlen eine kleine Provision nur bei erfolgreicher Auftragsdurchführung. Alle Gebühren sind transparent dargestellt.",
    order_index: 2
  },
  {
    id: "9",
    category: "Support & Community",
    question: "Was bei Problemen?",
    answer: "Unser Support-Team hilft Ihnen gerne weiter. Sie können uns per E-Mail, Chat oder über unser Kontaktformular erreichen. Zusätzlich gibt es Community-Manager für regionale Unterstützung.",
    order_index: 1
  },
  {
    id: "10",
    category: "Support & Community",
    question: "Gibt es eine mobile App?",
    answer: "Ja, whatsgonow ist als responsive Web-App optimiert und funktioniert perfekt auf allen mobilen Geräten. Native Apps für iOS und Android sind in Planung.",
    order_index: 2
  }
];

// Sprachspezifische Daten (ohne globale i18n-Abhängigkeiten)
export const getStaticFaqByLanguage = (lang: string = 'de'): StaticFAQItem[] => {
  if (lang === 'en') {
    return [
      {
        id: "1",
        category: "General",
        question: "What is whatsgonow?",
        answer: "whatsgonow is an innovative crowdlogistics platform that connects private and business clients with verified drivers. We enable you to handle transport orders quickly, safely and cost-effectively.",
        order_index: 1
      },
      {
        id: "2",
        category: "General", 
        question: "How does whatsgonow work?",
        answer: "You create a transport order with pickup and delivery details. Our verified drivers see your order and can submit offers. You choose the best offer and the transport is carried out.",
        order_index: 2
      },
      {
        id: "3",
        category: "Registration & Security",
        question: "Do I need to register?", 
        answer: "Free registration is required to use all features. However, you can already view orders and rides as a guest to get an overview.",
        order_index: 1
      },
      {
        id: "4",
        category: "Registration & Security",
        question: "How secure is whatsgonow?",
        answer: "All drivers are verified by us and have a rating system. Your data is processed in accordance with GDPR and all transactions are secured.",
        order_index: 2
      },
      {
        id: "5",
        category: "Orders & Matching",
        question: "How do I find transport orders?",
        answer: "After registration, as a driver you can view all available orders in your region, filter them and submit offers. You will also be notified of suitable new orders.",
        order_index: 1
      }
      // Weitere englische Übersetzungen...
    ];
  }
  
  return staticFaqData; // Fallback auf Deutsch
};

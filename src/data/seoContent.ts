
interface SEOPageContent {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
}

interface SEOContent {
  [language: string]: {
    [page: string]: SEOPageContent;
  };
}

export const seoContent: SEOContent = {
  de: {
    landing: {
      title: "Whatsgonow - Crowdlogistik Plattform | Effiziente Transporte",
      description: "Verbinde Auftraggeber und Fahrer für spontane und planbare Transporte. Reduziere Leerfahrten, schaffe Einkommensquellen und gestalte Lieferungen effizienter.",
      keywords: "Crowdlogistik, Transport, Lieferung, Fahrer, Auftraggeber, Leerfahrten, Deutschland",
      ogTitle: "Whatsgonow - Die Zukunft der Crowdlogistik",
      ogDescription: "Revolutioniere deine Transporte mit unserer innovativen Plattform"
    },
    login: {
      title: "Anmelden | Whatsgonow",
      description: "Melde dich bei Whatsgonow an und starte mit effizienten Transporten. Zugang zu deinem Dashboard für Aufträge und Fahrten.",
      keywords: "Anmelden, Login, Account, Whatsgonow, Transport, Dashboard"
    },
    register: {
      title: "Registrieren | Whatsgonow",
      description: "Erstelle dein kostenloses Whatsgonow-Konto. Werde Teil der Crowdlogistik-Community als Auftraggeber oder Fahrer.",
      keywords: "Registrieren, Account erstellen, Whatsgonow, Fahrer werden, Auftraggeber"
    },
    'pre-register': {
      title: "Vorregistrierung | Whatsgonow",
      description: "Sichere dir frühzeitig deinen Platz bei Whatsgonow. Erhalte Updates über den Launch unserer Crowdlogistik-Plattform.",
      keywords: "Vorregistrierung, Early Access, Beta, Whatsgonow, Launch"
    },
    support: {
      title: "Support & Hilfe | Whatsgonow",
      description: "Erhalte Hilfe und Support für deine Whatsgonow-Nutzung. FAQ, Kontakt und Lösungen für alle Fragen.",
      keywords: "Support, Hilfe, FAQ, Kontakt, Kundendienst, Whatsgonow"
    },
    faq: {
      title: "Häufige Fragen (FAQ) | Whatsgonow",
      description: "Finde Antworten auf häufige Fragen zu Whatsgonow. Alles über Transporte, Preise, Sicherheit und Nutzung.",
      keywords: "FAQ, Fragen, Antworten, Hilfe, Whatsgonow, Transport"
    }
  },
  en: {
    landing: {
      title: "Whatsgonow - Crowd Logistics Platform | Efficient Transport",
      description: "Connect shippers and drivers for spontaneous and planned transports. Reduce empty runs, create income sources and make deliveries more efficient.",
      keywords: "Crowd logistics, Transport, Delivery, Driver, Shipper, Empty runs, Germany, Europe",
      ogTitle: "Whatsgonow - The Future of Crowd Logistics",
      ogDescription: "Revolutionize your transports with our innovative platform"
    },
    login: {
      title: "Login | Whatsgonow",
      description: "Sign in to Whatsgonow and start with efficient transports. Access your dashboard for orders and trips.",
      keywords: "Login, Sign in, Account, Whatsgonow, Transport, Dashboard"
    },
    register: {
      title: "Register | Whatsgonow",
      description: "Create your free Whatsgonow account. Become part of the crowd logistics community as shipper or driver.",
      keywords: "Register, Create account, Whatsgonow, Become driver, Shipper"
    },
    'pre-register': {
      title: "Pre-registration | Whatsgonow",
      description: "Secure your spot early at Whatsgonow. Get updates about the launch of our crowd logistics platform.",
      keywords: "Pre-registration, Early access, Beta, Whatsgonow, Launch"
    },
    support: {
      title: "Support & Help | Whatsgonow",
      description: "Get help and support for your Whatsgonow usage. FAQ, contact and solutions for all questions.",
      keywords: "Support, Help, FAQ, Contact, Customer service, Whatsgonow"
    },
    faq: {
      title: "Frequently Asked Questions (FAQ) | Whatsgonow",
      description: "Find answers to frequently asked questions about Whatsgonow. Everything about transports, prices, security and usage.",
      keywords: "FAQ, Questions, Answers, Help, Whatsgonow, Transport"
    }
  },
  ar: {
    landing: {
      title: "Whatsgonow - منصة اللوجستيات الجماعية | نقل فعال",
      description: "اربط بين المرسلين والسائقين للنقل العفوي والمخطط. قلل من الرحلات الفارغة وأنشئ مصادر دخل واجعل التسليم أكثر كفاءة.",
      keywords: "اللوجستيات الجماعية, النقل, التسليم, السائق, المرسل, الرحلات الفارغة, ألمانيا",
      ogTitle: "Whatsgonow - مستقبل اللوجستيات الجماعية",
      ogDescription: "ثور في نقلك مع منصتنا المبتكرة"
    },
    login: {
      title: "تسجيل الدخول | Whatsgonow",
      description: "سجل الدخول إلى Whatsgonow وابدأ بالنقل الفعال. الوصول إلى لوحة التحكم للطلبات والرحلات.",
      keywords: "تسجيل الدخول, الحساب, Whatsgonow, النقل, لوحة التحكم"
    },
    register: {
      title: "التسجيل | Whatsgonow",
      description: "أنشئ حساب Whatsgonow المجاني. كن جزءاً من مجتمع اللوجستيات الجماعية كمرسل أو سائق.",
      keywords: "التسجيل, إنشاء حساب, Whatsgonow, أصبح سائق, المرسل"
    },
    'pre-register': {
      title: "التسجيل المسبق | Whatsgonow",
      description: "احجز مكانك مبكراً في Whatsgonow. احصل على التحديثات حول إطلاق منصة اللوجستيات الجماعية.",
      keywords: "التسجيل المسبق, الوصول المبكر, بيتا, Whatsgonow, الإطلاق"
    },
    support: {
      title: "الدعم والمساعدة | Whatsgonow",
      description: "احصل على المساعدة والدعم لاستخدام Whatsgonow. الأسئلة الشائعة والاتصال والحلول لجميع الأسئلة.",
      keywords: "الدعم, المساعدة, الأسئلة الشائعة, الاتصال, خدمة العملاء, Whatsgonow"
    },
    faq: {
      title: "الأسئلة الشائعة | Whatsgonow",
      description: "اعثر على إجابات للأسئلة الشائعة حول Whatsgonow. كل شيء عن النقل والأسعار والأمان والاستخدام.",
      keywords: "الأسئلة الشائعة, الأسئلة, الإجابات, المساعدة, Whatsgonow, النقل"
    }
  }
};

export const getSEOContent = (language: string, page: string): SEOPageContent | null => {
  return seoContent[language]?.[page] || seoContent['de']?.[page] || null;
};

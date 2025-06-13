
-- Phase 1: Database Schema Setup for Legal Content Management System

-- 1. Core Tables for Standard Content

-- Legal pages table (privacy, terms, impressum, etc.)
CREATE TABLE public.legal_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  default_title TEXT NOT NULL,
  default_content TEXT NOT NULL,
  page_type TEXT NOT NULL DEFAULT 'legal',
  active BOOLEAN DEFAULT true,
  requires_cto_approval BOOLEAN DEFAULT false,
  last_approved_by UUID REFERENCES auth.users(id),
  last_approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- FAQ table with categorization
CREATE TABLE public.faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  default_question TEXT NOT NULL,
  default_answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Footer links management
CREATE TABLE public.footer_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label_default TEXT NOT NULL,
  slug TEXT NOT NULL,
  section TEXT NOT NULL, -- 'customers', 'drivers', 'company'
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Translation Tables

-- Legal page translations
CREATE TABLE public.legal_page_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_page_id UUID NOT NULL REFERENCES public.legal_pages(id) ON DELETE CASCADE,
  lang_code TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'auto', 'verified', 'approved'
  last_synced TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(legal_page_id, lang_code)
);

-- FAQ translations
CREATE TABLE public.faq_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faq_id UUID NOT NULL REFERENCES public.faq(id) ON DELETE CASCADE,
  lang_code TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  last_synced TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(faq_id, lang_code)
);

-- Footer link translations
CREATE TABLE public.footer_link_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  footer_link_id UUID NOT NULL REFERENCES public.footer_links(id) ON DELETE CASCADE,
  lang_code TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(footer_link_id, lang_code)
);

-- 3. System Settings (contact info, social links, etc.)
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  lang_code TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(key, lang_code)
);

-- 4. Content Audit System
CREATE TABLE public.content_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'approved'
  previous_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES auth.users(id),
  ip_address TEXT,
  user_agent TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_legal_pages_updated_at BEFORE UPDATE ON public.legal_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faq_updated_at BEFORE UPDATE ON public.faq FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_links_updated_at BEFORE UPDATE ON public.footer_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legal_page_translations_updated_at BEFORE UPDATE ON public.legal_page_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faq_translations_updated_at BEFORE UPDATE ON public.faq_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_link_translations_updated_at BEFORE UPDATE ON public.footer_link_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. RLS Policies - Public read access for content
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_page_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_link_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_audit_log ENABLE ROW LEVEL SECURITY;

-- Public read policies for active content
CREATE POLICY "Public can read active legal pages" ON public.legal_pages
  FOR SELECT USING (active = true);

CREATE POLICY "Public can read legal page translations" ON public.legal_page_translations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.legal_pages WHERE id = legal_page_id AND active = true)
  );

CREATE POLICY "Public can read active FAQ" ON public.faq
  FOR SELECT USING (active = true);

CREATE POLICY "Public can read FAQ translations" ON public.faq_translations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.faq WHERE id = faq_id AND active = true)
  );

CREATE POLICY "Public can read active footer links" ON public.footer_links
  FOR SELECT USING (active = true);

CREATE POLICY "Public can read footer link translations" ON public.footer_link_translations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.footer_links WHERE id = footer_link_id AND active = true)
  );

CREATE POLICY "Public can read active system settings" ON public.system_settings
  FOR SELECT USING (active = true);

-- Admin policies for content management
CREATE POLICY "Admins can manage legal pages" ON public.legal_pages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can manage legal page translations" ON public.legal_page_translations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can manage FAQ" ON public.faq
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can manage FAQ translations" ON public.faq_translations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can manage footer links" ON public.footer_links
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can manage footer link translations" ON public.footer_link_translations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can manage system settings" ON public.system_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can read audit log" ON public.content_audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- 7. Seed Data - Migrate existing content
INSERT INTO public.legal_pages (slug, default_title, default_content, page_type, requires_cto_approval) VALUES
('impressum', 'Impressum', 'Anbieterkennzeichnung gemäß § 5 TMG...', 'legal', true),
('privacy-policy', 'Datenschutzerklärung', 'Informationen zur Datenverarbeitung...', 'legal', true),
('legal', 'Legal & Terms', 'Nutzungsbedingungen und rechtliche Hinweise...', 'legal', true);

INSERT INTO public.faq (category, default_question, default_answer, order_index) VALUES
('Allgemein', 'Was ist whatsgonow?', 'whatsgonow ist eine Crowdlogistik-Plattform...', 1),
('Registrierung & Sicherheit', 'Muss ich mich registrieren?', 'Ja, für die Nutzung aller Funktionen...', 1),
('Aufträge & Matching', 'Wie finde ich Transportaufträge?', 'Nach der Registrierung kannst du...', 1),
('Bezahlung & Sicherheit', 'Wie funktioniert die Bezahlung?', 'Die Bezahlung erfolgt sicher...', 1),
('Support & Community', 'Was bei Problemen?', 'Unser Support-Team hilft...', 1);

INSERT INTO public.footer_links (label_default, slug, section, order_index) VALUES
('Find Transport', '/find-transport', 'customers', 1),
('How It Works', '/how-it-works', 'customers', 2),
('FAQ', '/faq', 'customers', 3),
('Safety & Insurance', '/safety', 'customers', 4),
('Offer Transport', '/offer-transport', 'drivers', 1),
('Requirements', '/driver-requirements', 'drivers', 2),
('Earnings', '/earnings', 'drivers', 3),
('Pre-Registration', '/pre-register', 'drivers', 4),
('ESG Dashboard', '/esg-dashboard', 'company', 1),
('About Us', '/about', 'company', 2),
('Privacy Policy', '/privacy-policy', 'company', 3),
('Legal & Terms', '/legal', 'company', 4),
('Imprint', '/impressum', 'company', 5);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_content_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.content_audit_log (
    table_name,
    record_id,
    action,
    previous_data,
    new_data,
    changed_by
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END,
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to all content tables
CREATE TRIGGER audit_legal_pages AFTER INSERT OR UPDATE OR DELETE ON public.legal_pages FOR EACH ROW EXECUTE FUNCTION audit_content_changes();
CREATE TRIGGER audit_legal_page_translations AFTER INSERT OR UPDATE OR DELETE ON public.legal_page_translations FOR EACH ROW EXECUTE FUNCTION audit_content_changes();
CREATE TRIGGER audit_faq AFTER INSERT OR UPDATE OR DELETE ON public.faq FOR EACH ROW EXECUTE FUNCTION audit_content_changes();
CREATE TRIGGER audit_faq_translations AFTER INSERT OR UPDATE OR DELETE ON public.faq_translations FOR EACH ROW EXECUTE FUNCTION audit_content_changes();
CREATE TRIGGER audit_footer_links AFTER INSERT OR UPDATE OR DELETE ON public.footer_links FOR EACH ROW EXECUTE FUNCTION audit_content_changes();
CREATE TRIGGER audit_system_settings AFTER INSERT OR UPDATE OR DELETE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION audit_content_changes();

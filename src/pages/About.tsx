import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Heart } from 'lucide-react';

const About = () => {
  const { t } = useTranslation(['about', 'common']);

  return (
    <Layout pageType="public">
      <div className="container mx-auto py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              {t('about:title', 'Über Whatsgonow')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">{t('about:our_mission', 'Unsere Mission')}</h2>
              <p className="text-gray-700">
                {t('about:mission_description', 'Wir verbinden Menschen und Güter auf intelligente und nachhaltige Weise. Unser Ziel ist es, eine effiziente und umweltfreundliche Plattform für Transport und Logistik zu schaffen.')}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">{t('about:our_values', 'Unsere Werte')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Users className="h-8 w-8 text-blue-500" />
                  <h3 className="text-lg font-medium">{t('about:value_1_title', 'Gemeinschaft')}</h3>
                  <p className="text-center text-gray-600">
                    {t('about:value_1_description', 'Wir fördern eine starke Gemeinschaft von Sendern, Fahrern und Partnern.')}
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Target className="h-8 w-8 text-green-500" />
                  <h3 className="text-lg font-medium">{t('about:value_2_title', 'Effizienz')}</h3>
                  <p className="text-center text-gray-600">
                    {t('about:value_2_description', 'Wir optimieren Prozesse und Ressourcen, um den bestmöglichen Service zu bieten.')}
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Heart className="h-8 w-8 text-red-500" />
                  <h3 className="text-lg font-medium">{t('about:value_3_title', 'Nachhaltigkeit')}</h3>
                  <p className="text-center text-gray-600">
                    {t('about:value_3_description', 'Wir setzen uns für umweltfreundliche Lösungen und soziale Verantwortung ein.')}
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">{t('about:contact_us', 'Kontakt')}</h2>
              <p className="text-gray-700">
                {t('about:contact_description', 'Haben Sie Fragen oder Anregungen? Kontaktieren Sie uns gerne über unser Kontaktformular oder per E-Mail.')}
              </p>
              <p className="text-blue-500">
                <a href="mailto:info@whatsgonow.com">info@whatsgonow.com</a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default About;


import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Leaf, TrendingDown, Award, Building2, Users, Car, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface ESGReport {
  id: string;
  entity_type: string;
  entity_id: string;
  period_start: string;
  period_end: string;
  esg_data: any;
  regulation_reference: string;
  status: string;
  created_at: string;
}

interface ESGMetric {
  id: string;
  metric_key: string;
  metric_value: number;
  unit: string;
  regulation_reference: string;
}

const ESGDashboard = () => {
  const [reports, setReports] = useState<ESGReport[]>([]);
  const [metrics, setMetrics] = useState<ESGMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchESGData();
  }, []);

  const fetchESGData = async () => {
    try {
      // Fetch published ESG reports (public access)
      const { data: reportsData, error: reportsError } = await supabase
        .from('sustainability_reports')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;
      setReports(reportsData || []);

      // Fetch metrics for published reports
      if (reportsData && reportsData.length > 0) {
        const { data: metricsData, error: metricsError } = await supabase
          .from('esg_metrics')
          .select('*')
          .in('report_id', reportsData.map(r => r.id));

        if (metricsError) throw metricsError;
        setMetrics(metricsData || []);
      }
    } catch (error) {
      console.error('Error fetching ESG data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockCO2Data = [
    { month: 'Jan', co2Saved: 120, rides: 45 },
    { month: 'Feb', co2Saved: 150, rides: 67 },
    { month: 'Mar', co2Saved: 200, rides: 89 },
    { month: 'Apr', co2Saved: 180, rides: 72 },
    { month: 'Mai', co2Saved: 220, rides: 95 },
    { month: 'Jun', co2Saved: 280, rides: 110 },
  ];

  const mockESGScores = [
    { category: 'Environmental', score: 85, color: '#22c55e' },
    { category: 'Social', score: 78, color: '#3b82f6' },
    { category: 'Governance', score: 92, color: '#8b5cf6' },
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b'];

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">ESG Dashboard</h1>
            <Badge variant="outline" className="text-green-700 border-green-300">
              Öffentlich zugänglich
            </Badge>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Transparenter Einblick in unsere Nachhaltigkeits- und Governance-Bemühungen. 
            Verfolgen Sie unsere Fortschritte bei Umweltschutz, sozialer Verantwortung und Unternehmensführung.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="environmental">Umwelt</TabsTrigger>
            <TabsTrigger value="social">Soziales</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CO₂ Einsparung</CardTitle>
                  <TrendingDown className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">1,427 kg</div>
                  <p className="text-xs text-muted-foreground">+12% vs. Vormonat</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aktive Fahrer</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">247</div>
                  <p className="text-xs text-muted-foreground">+8% vs. Vormonat</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Geteilte Fahrten</CardTitle>
                  <Car className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">478</div>
                  <p className="text-xs text-muted-foreground">+15% vs. Vormonat</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ESG Score</CardTitle>
                  <Award className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">85/100</div>
                  <p className="text-xs text-muted-foreground">Sehr gut</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CO2 Savings Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>CO₂-Einsparungen über Zeit</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockCO2Data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="co2Saved" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* ESG Scores */}
              <Card>
                <CardHeader>
                  <CardTitle>ESG Kategorien</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockESGScores}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="score"
                        label={({ category, score }) => `${category}: ${score}`}
                      >
                        {mockESGScores.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Published Reports */}
            {reports.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Veröffentlichte ESG-Berichte</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">
                            {report.regulation_reference || 'ESG Bericht'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(report.period_start).toLocaleDateString()} - {new Date(report.period_end).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          {report.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="environmental" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Umwelt-Kennzahlen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">1,427 kg</div>
                    <div className="text-sm text-gray-600">CO₂ Einsparung</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">89%</div>
                    <div className="text-sm text-gray-600">Ressourceneffizienz</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">95%</div>
                    <div className="text-sm text-gray-600">Grüne Energie</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Soziale Verantwortung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">247</div>
                    <div className="text-sm text-gray-600">Aktive Fahrer</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">4.8/5</div>
                    <div className="text-sm text-gray-600">Zufriedenheit</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">32%</div>
                    <div className="text-sm text-gray-600">Diversität</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="governance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  Unternehmensführung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">100%</div>
                    <div className="text-sm text-gray-600">Compliance Rate</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">A+</div>
                    <div className="text-sm text-gray-600">Transparenz Score</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">92%</div>
                    <div className="text-sm text-gray-600">Governance Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-8">
          <CardContent className="text-center py-8">
            <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Werden Sie Teil unserer nachhaltigen Zukunft</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Schließen Sie sich unserer Community an und helfen Sie uns dabei, 
              den Transport nachhaltiger und effizienter zu gestalten.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Als Fahrer registrieren
              </Button>
              <Button variant="outline" size="lg">
                Mehr erfahren
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ESGDashboard;

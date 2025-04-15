
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeedbackAnalyticsDashboard, TimeRange } from '@/hooks/use-feedback-analytics-dashboard';
import { SentimentAnalysisComingSoonCard } from '@/components/feedback/admin/SentimentAnalysisComingSoonCard';
import { ArrowLeft, BarChart3, Download, LineChart as LineChartIcon, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';

// Recharts Components
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { ChartTooltipContent } from '@/components/ui/chart/ChartTooltip';
import { ChartLegendContent } from '@/components/ui/chart/ChartLegend';

const FeedbackAnalyticsPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { 
    timeRange, 
    setTimeRange, 
    typeDistribution, 
    timeTrend, 
    isLoading, 
    exportData, 
    refreshData 
  } = useFeedbackAnalyticsDashboard();

  // Redirect if user is not authorized
  React.useEffect(() => {
    if (!isLoading && profile && !['admin', 'admin_limited'].includes(profile.role)) {
      navigate('/dashboard');
    }
  }, [profile, isLoading, navigate]);

  // Chart configuration
  const chartConfig = {
    "bar-blue": { color: '#6366f1' },
    "bar-orange": { color: '#f97316' },
    "bar-green": { color: '#10b981' },
    "bar-red": { color: '#ef4444' },
    "line-primary": { color: '#6366f1' },
  };

  // Format feedback type for display
  const formatFeedbackType = (type: string) => {
    const typeMap: Record<string, string> = {
      'suggestion': t('feedback.types.suggestion'),
      'bug': t('feedback.types.bug'),
      'compliment': t('feedback.types.compliment'),
      'question': t('feedback.types.question')
    };
    return typeMap[type] || type;
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('de-DE', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 py-6">
        <div className="flex flex-col gap-6">
          {/* Header with navigation and controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Button 
                variant="ghost" 
                className="pl-0 mb-2" 
                onClick={() => navigate('/admin-dashboard')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zum Admin-Dashboard
              </Button>
              <h1 className="text-2xl font-bold">Feedback-Analytics</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Select
                value={timeRange}
                onValueChange={(value) => setTimeRange(value as TimeRange)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Zeitraum wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Letzte 7 Tage</SelectItem>
                  <SelectItem value="30">Letzte 30 Tage</SelectItem>
                  <SelectItem value="90">Letzte 90 Tage</SelectItem>
                  <SelectItem value="365">Letztes Jahr</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={refreshData}
                  title="Daten aktualisieren"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={exportData}
                  className="w-full sm:w-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  CSV Export
                </Button>
              </div>
            </div>
          </div>
          
          {/* Analytics content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main charts section - 2/3 width on large screens */}
            <div className="lg:col-span-2 space-y-6">
              {/* Feedback Type Distribution Chart */}
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    Feedback nach Typ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : typeDistribution.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <p className="text-muted-foreground">Keine Daten für den ausgewählten Zeitraum</p>
                    </div>
                  ) : (
                    <div className="h-[300px] w-full">
                      <ChartContainer config={chartConfig}>
                        <BarChart data={typeDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="type" 
                            tickFormatter={formatFeedbackType} 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis allowDecimals={false} />
                          <Tooltip content={<ChartTooltipContent labelFormatter={formatFeedbackType} />} />
                          <Legend content={<ChartLegendContent />} />
                          <Bar 
                            dataKey="count" 
                            name="Anzahl" 
                            fill="var(--color-bar-blue)" 
                            radius={[4, 4, 0, 0]} 
                          />
                        </BarChart>
                      </ChartContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Feedback Trend Chart */}
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <LineChartIcon className="h-5 w-5 text-muted-foreground" />
                    Feedback-Trend über Zeit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : timeTrend.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <p className="text-muted-foreground">Keine Daten für den ausgewählten Zeitraum</p>
                    </div>
                  ) : (
                    <div className="h-[300px] w-full">
                      <ChartContainer config={chartConfig}>
                        <LineChart data={timeTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={formatDate}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis allowDecimals={false} />
                          <Tooltip 
                            labelFormatter={(label) => formatDate(label)}
                            content={<ChartTooltipContent />}
                          />
                          <Legend content={<ChartLegendContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="count" 
                            name="Anzahl Feedback" 
                            stroke="var(--color-line-primary)" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar section - 1/3 width on large screens */}
            <div className="space-y-6">
              {/* Summary Card */}
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Zusammenfassung</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Gesamtzahl Feedback</p>
                        <p className="text-2xl font-bold">
                          {typeDistribution.reduce((sum, item) => sum + item.count, 0)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Häufigster Feedback-Typ</p>
                        {typeDistribution.length > 0 ? (
                          <p className="text-lg font-semibold">
                            {formatFeedbackType(
                              typeDistribution.sort((a, b) => b.count - a.count)[0]?.type || ''
                            )}
                          </p>
                        ) : (
                          <p className="text-lg">-</p>
                        )}
                      </div>
                      
                      {timeTrend.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground">Tag mit meistem Feedback</p>
                          <p className="text-lg font-semibold">
                            {formatDate(
                              timeTrend.sort((a, b) => b.count - a.count)[0]?.date || ''
                            )}
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <div className="text-sm text-muted-foreground mb-2">Verteilung</div>
                        <div className="grid grid-cols-2 gap-2">
                          {typeDistribution.map(item => (
                            <div key={item.type} className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                              <p className="text-xs text-muted-foreground">{formatFeedbackType(item.type)}</p>
                              <p className="font-medium">{item.count}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Sentiment Analysis Card (Coming Soon) */}
              <SentimentAnalysisComingSoonCard />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FeedbackAnalyticsPage;

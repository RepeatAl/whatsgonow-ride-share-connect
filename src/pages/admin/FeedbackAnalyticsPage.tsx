
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, RefreshCw, Download, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { useFeedbackAnalyticsDashboard } from '@/hooks/use-feedback-analytics-dashboard';
import { SentimentAnalysisComingSoonCard } from '@/components/feedback/admin/SentimentAnalysisComingSoonCard';

type TimeRange = '7d' | '30d' | '90d' | '1y';

const FeedbackAnalyticsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    feedbackVolume,
    ratingTrends,
    featureRequests,
    isLoading,
    refreshData
  } = useFeedbackAnalyticsDashboard({
    timeRange,
    refreshInterval: 30000, // 30 seconds
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log('Exporting analytics data...');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>{t('loading')}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('back')}
            </Button>
            <h1 className="text-2xl font-bold">{t('feedback_analytics')}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Select
              value={timeRange}
              onValueChange={(value: TimeRange) => setTimeRange(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">{t('last_7_days')}</SelectItem>
                <SelectItem value="30d">{t('last_30_days')}</SelectItem>
                <SelectItem value="90d">{t('last_90_days')}</SelectItem>
                <SelectItem value="1y">{t('last_year')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t('refresh')}
            </Button>
            <Button
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('export')}
            </Button>
          </div>
        </div>

        {/* Feedback Volume Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t('feedback_volume_over_time')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedbackVolume ? (
              <div className="h-64 flex items-center justify-center">
                {/* Chart implementation would go here */}
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{t('chart_implementation_pending')}</p>
                  <p className="text-sm mt-2">
                    {t('total_feedback')}: {feedbackVolume.total}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="font-medium">{t('positive')}</p>
                      <p className="text-green-600">{feedbackVolume.positive}</p>
                    </div>
                    <div>
                      <p className="font-medium">{t('negative')}</p>
                      <p className="text-red-600">{feedbackVolume.negative}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                {t('no_data_available')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rating Trends Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5" />
              {t('rating_trends')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ratingTrends ? (
              <div className="h-64 flex items-center justify-center">
                {/* Chart implementation would go here */}
                <div className="text-center text-gray-500">
                  <LineChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{t('chart_implementation_pending')}</p>
                  <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <p className="font-medium">{t('average_rating')}</p>
                      <p className="text-blue-600">
                        {ratingTrends.averageRating?.toFixed(1) || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">{t('highest_rating')}</p>
                      <p className="text-green-600">
                        {ratingTrends.highestRating || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">{t('lowest_rating')}</p>
                      <p className="text-red-600">
                        {ratingTrends.lowestRating || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                {t('no_data_available')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature Requests Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('feature_requests_summary')}</CardTitle>
          </CardHeader>
          <CardContent>
            {featureRequests ? (
              <div className="space-y-4">
                {featureRequests.map((request: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{request.feature}</p>
                      <p className="text-sm text-gray-600">{request.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{request.requests} {t('requests')}</p>
                      <p className="text-sm text-gray-600">{request.priority}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t('no_feature_requests')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sentiment Analysis (Coming Soon) */}
        <SentimentAnalysisComingSoonCard />
      </div>
    </Layout>
  );
};

export default FeedbackAnalyticsPage;

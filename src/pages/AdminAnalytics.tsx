import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from "@/components/Layout";

interface PageView {
  page: string;
  count: number;
}

const AdminAnalytics = () => {
  const [pageViews, setPageViews] = useState<PageView[]>([]);

  useEffect(() => {
    const fetchPageViews = async () => {
      try {
        const { data, error } = await supabase
          .from('analytics')
          .select('page, count')
          .order('count', { ascending: false });

        if (error) {
          console.error('Error fetching page view data:', error);
          return;
        }

        setPageViews(data.map(item => ({
          page: item.page,
          count: item.count as number
        })));
      } catch (error) {
        console.error('Error fetching page view data:', error);
      }
    };

    fetchPageViews();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Admin Analytics</h1>
        {pageViews.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={pageViews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="page" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </Layout>
  );
};

export default AdminAnalytics;

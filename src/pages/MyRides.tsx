
import React from 'react';
import Layout from '@/components/Layout';
import MyRides from '@/components/rides/MyRides';

const MyRidesPage = () => {
  return (
    <Layout pageType="authenticated">
      <MyRides />
    </Layout>
  );
};

export default MyRidesPage;

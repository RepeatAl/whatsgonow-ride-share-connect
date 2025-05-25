
import React from 'react';
import Layout from '@/components/Layout';
import CreateRideForm from '@/components/rides/CreateRideForm';

const CreateRide = () => {
  return (
    <Layout pageType="orders">
      <CreateRideForm />
    </Layout>
  );
};

export default CreateRide;

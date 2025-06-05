
import React from 'react';
import Landing from '@/components/Landing';

/**
 * Home Page - Uses the Landing component with HERE Maps integration
 * This ensures there's no conflict between pages/Landing.tsx and components/Landing.tsx
 */
const Home = () => {
  console.log('[Home] Rendering with Landing component');
  return <Landing />;
};

export default Home;

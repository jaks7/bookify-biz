
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PricingPlans from '@/components/pricing/PricingPlans';

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <PricingPlans />
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;

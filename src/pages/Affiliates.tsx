
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AffiliateHero from '@/components/affiliate/AffiliateHero';
import AffiliateFeatures from '@/components/affiliate/AffiliateFeatures';

const Affiliates = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <AffiliateHero />
        <AffiliateFeatures />
      </div>
      <Footer />
    </div>
  );
};

export default Affiliates;

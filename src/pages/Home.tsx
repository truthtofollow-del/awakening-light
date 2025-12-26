import React, { useState } from 'react';
import TheSanctuary from '../components/TheSanctuary';
import TheNavBar from '../components/TheNavBar';

const Home: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('sanctuary');

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <main className="pb-24">
        {currentTab === 'sanctuary' && <TheSanctuary />}
        {currentTab === 'circles' && (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-stone-400 italic">The Circles are forming...</p>
          </div>
        )}
      </main>
      <TheNavBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
};

export default Home;

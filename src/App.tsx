import React, { useState } from 'react';
import TheSanctuary from './components/TheSanctuary';
import TheNavBar from './components/TheNavBar';

function App() {
  // Sets 'sanctuary' as the starting screen
  const [currentTab, setCurrentTab] = useState('sanctuary');

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      
      {/* Dynamic Content: Changes based on the Nav Bar */}
      <main className="pb-24"> 
        {currentTab === 'sanctuary' && <TheSanctuary />}
        {currentTab === 'circles' && (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-stone-400 italic">The Circles are forming...</p>
          </div>
        )}
      </main>

      {/* Navigation Bar */}
      <TheNavBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
    </div>
  );
}

export default App;

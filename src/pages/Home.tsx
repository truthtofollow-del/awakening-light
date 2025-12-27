import React, { useState } from 'react';
import TheSanctuary from '../components/TheSanctuary';
import TheNavBar from '../components/TheNavBar';
import { track } from '@vercel/analytics';
import { useSession } from '../contexts/SessionContext';

const Home: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('sanctuary');
  const { user, sessionDuration, endSession } = useSession();

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const handleEndSession = (): void => {
    // Track session end with duration
    track('Session Ended', {
      userId: user?.id,
      sessionDuration: sessionDuration,
      sessionDurationFormatted: formatDuration(sessionDuration),
      timestamp: new Date().toISOString(),
    });
    
    endSession();
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Session info bar */}
      <div className="bg-stone-900 text-stone-100 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-amber-400 font-medium">
            Welcome, {user?.name || 'Seeker'}
          </span>
          <span className="text-stone-400 text-sm">
            Session: {formatDuration(sessionDuration)}
          </span>
        </div>
        <button
          onClick={handleEndSession}
          className="text-sm px-4 py-1 bg-stone-800 hover:bg-stone-700 rounded transition-colors"
        >
          End Session
        </button>
      </div>
      
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

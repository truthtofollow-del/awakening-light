import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { track } from '@vercel/analytics';
import { useSession } from '../contexts/SessionContext';

// CoronationGate - Onboarding flow
const CoronationGate: React.FC = () => {
  const navigate = useNavigate();
  const { startSession } = useSession();
  const [step, setStep] = useState<number>(1);
  const [intention, setIntention] = useState<string>('');

  const handleComplete = (): void => {
    // Create a user session when completing the gate
    const user = {
      id: `user_${Date.now()}`,
      name: 'Seeker', // Could be collected in a more detailed onboarding
    };
    
    // Track the Gate Completion event
    track('Gate Completed', {
      userId: user.id,
      intention: intention.substring(0, 100), // First 100 chars for privacy
      timestamp: new Date().toISOString(),
    });
    
    // Start the user session
    startSession(user);
    
    // Navigate to home after completing the gate
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-stone-900/30 border border-stone-800/50 backdrop-blur-xl rounded-2xl p-12">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            The Coronation Gate
          </h1>
          
          {step === 1 && (
            <div className="space-y-6">
              <p className="text-stone-300 text-center">
                Welcome, seeker. Before you enter the sanctuary, we ask: What brings you here?
              </p>
              <textarea
                value={intention}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIntention(e.target.value)}
                placeholder="Share your intention..."
                className="w-full px-6 py-4 bg-stone-900/50 border border-stone-700 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50 backdrop-blur-sm min-h-32"
              />
              <button
                onClick={() => setStep(2)}
                disabled={!intention.trim()}
                className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-semibold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6 text-center">
              <p className="text-stone-300 text-lg">
                Your intention has been received.
              </p>
              <p className="text-stone-400">
                May your journey be guided by wisdom and light.
              </p>
              <button
                onClick={handleComplete}
                className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-semibold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/30"
              >
                Enter the Sanctuary
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CoronationGate;

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { track } from '@vercel/analytics';

// UnityPulse animation component using Framer Motion
const UnityPulse: React.FC = () => {
  return (
    <div className="relative w-32 h-32 mx-auto mb-12">
      {/* Outer pulse rings */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-amber-500/30"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-amber-400/40"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      {/* Core circle */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-2xl shadow-amber-500/50"
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 25px 50px -12px rgba(251, 191, 36, 0.5)",
            "0 25px 50px -12px rgba(251, 191, 36, 0.8)",
            "0 25px 50px -12px rgba(251, 191, 36, 0.5)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

// Press-and-hold email waitlist CTA (3 seconds, integrity-by-design)
const PressHoldCTA: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const HOLD_DURATION = 3000; // 3 seconds
  const PROGRESS_INTERVAL = 50; // Update every 50ms

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const startHold = (): void => {
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsHolding(true);
    setProgress(0);

    // Progress animation
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (PROGRESS_INTERVAL / HOLD_DURATION) * 100;
        return next > 100 ? 100 : next;
      });
    }, PROGRESS_INTERVAL);

    // Complete submission after hold duration
    holdTimerRef.current = setTimeout(() => {
      handleSubmit();
    }, HOLD_DURATION);
  };

  const cancelHold = (): void => {
    setIsHolding(false);
    setProgress(0);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const handleSubmit = (): void => {
    // Track the Coronation Complete event as primary conversion metric
    track('Coronation Complete', {
      email: email,
      timestamp: new Date().toISOString(),
      holdDuration: HOLD_DURATION,
    });
    
    // In a real implementation, this would send the email to a backend
    console.log('Waitlist email submitted:', email);
    setSubmitted(true);
    setIsHolding(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="inline-block px-8 py-4 rounded-lg bg-stone-900/50 border border-amber-500/30 backdrop-blur-sm">
          <p className="text-amber-400 text-lg font-medium">
            ✓ You're on the list
          </p>
          <p className="text-stone-400 text-sm mt-2">
            We'll be in touch soon
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-6 py-4 bg-stone-900/50 border border-stone-700 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50 backdrop-blur-sm transition-colors"
          disabled={isHolding}
        />
        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}
      </div>
      
      <div className="mt-6 relative">
        <button
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          disabled={submitted}
          className="w-full relative overflow-hidden px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-semibold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <motion.div
            className="absolute inset-0 bg-amber-300"
            initial={{ x: '-100%' }}
            animate={{ x: isHolding ? '0%' : '-100%' }}
            style={{ width: `${progress}%` }}
            transition={{ duration: 0 }}
          />
          <span className="relative z-10">
            {isHolding ? 'Hold to confirm...' : 'Join the Waitlist'}
          </span>
        </button>
        <p className="text-stone-500 text-xs mt-3 text-center">
          Press and hold for 3 seconds to join
        </p>
      </div>
    </div>
  );
};

// Main Landing Page
const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        {/* Glass panel with Sovereign aesthetic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-2xl bg-stone-900/30 border border-stone-800/50 backdrop-blur-xl p-12 shadow-2xl"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            {/* Unity Pulse Animation */}
            <UnityPulse />
            
            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent"
            >
              Awakening Light
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl text-stone-300 text-center mb-4"
            >
              A sovereign sanctuary for conscious investors
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-stone-400 text-center mb-12 max-w-2xl mx-auto"
            >
              Where integrity meets opportunity. A new paradigm for those who invest with purpose and presence.
            </motion.p>
            
            {/* Press-and-Hold CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <PressHoldCTA />
            </motion.div>
            
            {/* Coming Soon Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="mt-12 text-center"
            >
              <div className="inline-block px-4 py-2 rounded-full border border-amber-500/30 bg-stone-900/50 backdrop-blur-sm">
                <p className="text-amber-400 text-sm font-medium">
                  Coming Soon
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-8 text-center text-stone-500 text-sm"
        >
          <p>Built with integrity • Designed for sovereignty</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;

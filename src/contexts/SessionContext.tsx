import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User interface for session tracking
interface User {
  id: string;
  email?: string;
  name?: string;
}

// Session state interface
interface SessionState {
  isAuthenticated: boolean;
  user: User | null;
  sessionId: string;
  sessionStartTime: number;
  sessionDuration: number; // in seconds
}

// Session context interface
interface SessionContextType extends SessionState {
  startSession: (user: User) => void;
  endSession: () => void;
  updateSessionDuration: () => number;
}

// Create the context
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Session storage keys
const SESSION_STORAGE_KEY = 'awakening_light_session';

// Generate a unique session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Session Provider Props
interface SessionProviderProps {
  children: ReactNode;
}

// Session Provider Component
export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [sessionState, setSessionState] = useState<SessionState>(() => {
    // Try to restore session from localStorage
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate that session is still valid (less than 24 hours old)
        const hoursSinceStart = (Date.now() - parsed.sessionStartTime) / (1000 * 60 * 60);
        if (hoursSinceStart < 24) {
          return {
            ...parsed,
            sessionDuration: Math.floor((Date.now() - parsed.sessionStartTime) / 1000),
          };
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      }
    }
    
    // Return default state
    return {
      isAuthenticated: false,
      user: null,
      sessionId: generateSessionId(),
      sessionStartTime: Date.now(),
      sessionDuration: 0,
    };
  });

  // Update session duration every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionState.isAuthenticated || sessionState.sessionStartTime) {
        setSessionState((prev) => ({
          ...prev,
          sessionDuration: Math.floor((Date.now() - prev.sessionStartTime) / 1000),
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionState.isAuthenticated, sessionState.sessionStartTime]);

  // Persist session to localStorage whenever it changes
  useEffect(() => {
    if (sessionState.isAuthenticated) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionState));
    }
  }, [sessionState]);

  // Start a new session
  const startSession = (user: User): void => {
    const newSessionState: SessionState = {
      isAuthenticated: true,
      user,
      sessionId: generateSessionId(),
      sessionStartTime: Date.now(),
      sessionDuration: 0,
    };
    setSessionState(newSessionState);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSessionState));
  };

  // End the current session
  const endSession = (): void => {
    setSessionState({
      isAuthenticated: false,
      user: null,
      sessionId: generateSessionId(),
      sessionStartTime: Date.now(),
      sessionDuration: 0,
    });
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  // Manually update and return current session duration
  const updateSessionDuration = (): number => {
    const duration = Math.floor((Date.now() - sessionState.sessionStartTime) / 1000);
    setSessionState((prev) => ({
      ...prev,
      sessionDuration: duration,
    }));
    return duration;
  };

  const contextValue: SessionContextType = {
    ...sessionState,
    startSession,
    endSession,
    updateSessionDuration,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to use the session context
export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

// Export the context for advanced use cases
export default SessionContext;

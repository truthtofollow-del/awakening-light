import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from './contexts/SessionContext';
import Landing from './pages/Landing';
import CoronationGate from './pages/CoronationGate';
import Home from './pages/Home';
import Circles from './pages/Circles';
import TheSanctuary from './components/TheSanctuary';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <SessionProvider>
      <Router>
        <Routes>
          {/* Root path routes to Landing page */}
          <Route path="/" element={<Landing />} />
          
          {/* CoronationGate onboarding at /gate */}
          <Route path="/gate" element={<CoronationGate />} />
          
          {/* Main app routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sanctuary"
            element={
              <ProtectedRoute>
                <TheSanctuary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/circles"
            element={
              <ProtectedRoute>
                <Circles />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Analytics />
      </Router>
    </SessionProvider>
  );
}

export default App;

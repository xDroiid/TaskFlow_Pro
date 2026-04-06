import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Loader from './components/Loader';

// Lazy load components for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Help = lazy(() => import('./pages/Help'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("CRITICAL UI ERROR:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-8">
          <div className="glass p-8 rounded-2xl border border-red-500/50 max-w-lg text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">System Malfunction</h1>
            <p className="text-white/60 mb-6">A critical error occurred in the visualization matrix.</p>
            <pre className="bg-black/50 p-4 rounded text-xs text-red-400 overflow-auto mb-6 text-left">
              {this.state.error?.message}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500/20 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col relative w-full overflow-hidden transition-colors duration-300">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/help" element={<Help />} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

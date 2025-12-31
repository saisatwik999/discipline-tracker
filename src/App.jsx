import { useState, useEffect, Component } from 'react';
import { Navbar } from './components/layout/Navbar';
import { StorageService } from './services/StorageService';
import { StudyDashboard } from './components/dashboard/StudyDashboard';
import { NormalDashboard } from './components/dashboard/NormalDashboard';
import { CombinedDashboard } from './components/dashboard/CombinedDashboard';
import { DateProvider } from './context/DateContext';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Crash:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
          <h2>Something went wrong.</h2>
          <p style={{ color: 'var(--status-error)' }}>{this.state.error?.toString()}</p>
          <button
            onClick={this.handleReset}
            style={{
              marginTop: '1rem',
              padding: '0.8rem 1.5rem',
              background: 'var(--status-error)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ⚠️ Factory Reset Data
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}


import { NameEntry } from './components/auth/NameEntry';

// ... (ErrorBoundary remains same)

function App() {
  const [currentView, setCurrentView] = useState('study');
  const [user, setUser] = useState(null);

  const handleLogin = (name) => {
    StorageService.initialize(name);
    setUser(name);
  };

  if (!user) {
    return (
      <ErrorBoundary>
        <NameEntry onComplete={handleLogin} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <DateProvider>
        <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
          <header style={{ textAlign: 'center', margin: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Daily Discipline <span style={{ color: 'var(--accent-study)' }}>&</span> Learning
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>
                Consistency is the only currency that matters.
              </p>
              <div style={{
                padding: '0.2rem 0.8rem',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.1)',
                fontSize: '0.8rem',
                color: 'var(--accent-study)'
              }}>
                User: {user}
              </div>
            </div>
          </header>

          <Navbar currentView={currentView} onViewChange={setCurrentView} />

          <main>
            {currentView === 'study' && <StudyDashboard />}
            {currentView === 'normal' && <NormalDashboard />}
            {currentView === 'combined' && <CombinedDashboard />}
          </main>
        </div>
      </DateProvider>
    </ErrorBoundary>
  );
}

export default App;

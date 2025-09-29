import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import Header from './components/common/Header';
import ScoresList from './components/scores/ScoresList';
import StandingsList from './components/standings/StandingsList';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useTheme } from './hooks/useTheme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function AppContent() {
  const [currentView, setCurrentView] = useState<'scores' | 'standings'>('scores');
  useTheme(); // Initialize theme

  return (
    <div className="bg-background text-foreground min-h-screen w-full">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <main className="px-4 pb-4 bg-background">
        {currentView === 'scores' && <ScoresList />}
        {currentView === 'standings' && <StandingsList />}
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
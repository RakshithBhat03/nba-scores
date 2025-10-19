import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Header from "./components/common/Header";
import ScoresList from "./components/scores/ScoresList";
import StandingsList from "./components/standings/StandingsList";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { useTheme } from "./hooks/useTheme";
import { usePrefetchData } from "./hooks/usePrefetchData";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true, // Refetch when extension popup opens
      refetchOnMount: true, // Always refetch when component mounts
      refetchOnReconnect: true, // Refetch when network reconnects
    },
  },
});

function AppContent() {
  const [currentView, setCurrentView] = useState<"scores" | "standings">(
    "scores",
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  useTheme(); // Initialize theme
  usePrefetchData(); // Pre-fetch data and keep it fresh

  return (
    <div className="bg-background text-foreground w-[540px] h-[600px] flex flex-col overflow-hidden">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        selectedDate={selectedDate}
      />
      <main className="px-2 pt-2 pb-2 bg-background flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin">
          {currentView === "scores" && (
            <ScoresList
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          )}
          {currentView === "standings" && <StandingsList />}
        </div>
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

import { RefreshCw, Trophy, Calendar } from 'lucide-react';
import { useQueryClient, useIsFetching } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeToggle from '../settings/ThemeToggle';

interface HeaderProps {
  currentView: 'scores' | 'standings';
  onViewChange: (view: 'scores' | 'standings') => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['scores'] });
    queryClient.invalidateQueries({ queryKey: ['standings'] });
  };

  return (
    <header className="bg-gradient-to-r from-nba-primary-600 to-nba-primary-700 dark:from-nba-primary-700 dark:to-nba-primary-800 text-white px-4 py-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          🏀 NBA Scores
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isFetching > 0}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            title="Refresh all data"
          >
            <RefreshCw size={16} className={isFetching > 0 ? 'animate-spin' : ''} />
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <Tabs value={currentView} onValueChange={(value) => onViewChange(value as 'scores' | 'standings')}>
        <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
          <TabsTrigger
            value="scores"
            className="flex items-center gap-2 text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
          >
            <Calendar size={14} />
            Scores
          </TabsTrigger>
          <TabsTrigger
            value="standings"
            className="flex items-center gap-2 text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
          >
            <Trophy size={14} />
            Standings
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
}
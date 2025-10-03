import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { BoxScore, Team, BoxScoreStatistic } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GamePreviewProps {
  boxScore: BoxScore | null;
  isLoading: boolean;
  onClose: () => void;
}

const GamePreview: React.FC<GamePreviewProps> = ({ boxScore, isLoading, onClose }) => {
  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Card className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </Card>
      </div>
    );
  }

  if (!boxScore || !boxScore.boxscore) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Card className="w-full h-full p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Game Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-center text-gray-500">Unable to load game details</p>
        </Card>
      </div>
    );
  }

  const { teams, players } = boxScore.boxscore;
  const leaders = boxScore.leaders || [];

  // Map technical statistic names to user-friendly abbreviations
  const getStatDisplayName = (stat: BoxScoreStatistic): string => {
    const nameMap: Record<string, string> = {
      'fieldGoalsMade-fieldGoalsAttempted': 'FG',
      'fieldGoalPct': 'FG%',
      'threePointFieldGoalsMade-threePointFieldGoalsAttempted': '3PT',
      'threePointFieldGoalPct': '3P%',
      'freeThrowsMade-freeThrowsAttempted': 'FT',
      'freeThrowPct': 'FT%',
      'totalRebounds': 'REB',
      'offensiveRebounds': 'OR',
      'defensiveRebounds': 'DR',
      'assists': 'AST',
      'steals': 'STL',
      'blocks': 'BLK',
      'turnovers': 'TO',
      'personalFouls': 'PF',
      'points': 'PTS',
      'teamRebounds': 'TREB',
      'teamTurnovers': 'TTO',
      'fastBreakPoints': 'FBP',
      'pointsInPaint': 'PIP',
      'secondChancePoints': 'SCP',
      'biggestLead': 'BL',
      'efficiency': 'EFF',
      'minutes': 'MIN'
    };

    return stat.abbreviation || nameMap[stat.name] || stat.name;
  };

  const getTeamScore = (teamId: string) => {
    const playerStats = players.find(p => p.team.id === teamId);
    if (!playerStats || !playerStats.statistics[0]) return 0;
    
    const pointsIndex = playerStats.statistics[0].names.findIndex(name => name === 'PTS');
    if (pointsIndex === -1) return 0;
    
    return playerStats.statistics[0].athletes
      .filter(athlete => !athlete.didNotPlay)
      .reduce((total, athlete) => {
        const points = parseInt(athlete.stats[pointsIndex] || '0');
        return total + points;
      }, 0);
  };

  const renderTeamCard = (team: Team, isHome: boolean) => {
    const teamStats = teams.find(t => t.team.id === team.id);
    const playerStats = players.find(p => p.team.id === team.id);
    const score = getTeamScore(team.id);
    
    if (!teamStats || !playerStats) {
      return (
        <Card className="p-4">
          <p className="text-gray-500 text-center">Team data not available</p>
        </Card>
      );
    }

    // Show all available team statistics
    const mainStats = teamStats.statistics.slice(0, 12);
    const playerData = playerStats.statistics[0];

    return (
      <Card className="p-4 space-y-4">
        {/* Team Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={team.logo} 
              alt={team.displayName}
              className="w-10 h-10"
            />
            <div>
              <h3 className="font-semibold text-sm">{team.displayName}</h3>
              <p className="text-2xl font-bold">{score}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {isHome ? 'HOME' : 'AWAY'}
          </Badge>
        </div>
        
        {/* Team Statistics */}
        {mainStats.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-xs text-gray-600 uppercase tracking-wide">Team Statistics</h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {mainStats.map((stat, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{getStatDisplayName(stat)}:</span>
                  <span className="font-medium">{stat.displayValue || '-'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Player Statistics */}
        {playerData && playerData.athletes.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-xs text-gray-600 uppercase tracking-wide">Player Statistics</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2 font-medium">Player</th>
                    <th className="pb-2 text-center font-medium">MIN</th>
                    <th className="pb-2 text-center font-medium">FG</th>
                    <th className="pb-2 text-center font-medium">3PT</th>
                    <th className="pb-2 text-center font-medium">FT</th>
                    <th className="pb-2 text-center font-medium">REB</th>
                    <th className="pb-2 text-center font-medium">AST</th>
                    <th className="pb-2 text-center font-medium">STL</th>
                    <th className="pb-2 text-center font-medium">BLK</th>
                    <th className="pb-2 text-center font-medium">TO</th>
                    <th className="pb-2 text-center font-medium">PF</th>
                    <th className="pb-2 text-center font-medium">+/-</th>
                    <th className="pb-2 text-center font-medium">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {playerData.athletes
                    .filter(athlete => !athlete.didNotPlay)
                    .map((athlete) => {
                      const minutesIndex = playerData.names.findIndex(name => name === 'MIN');
                      const fgIndex = playerData.names.findIndex(name => name === 'FG');
                      const threePtIndex = playerData.names.findIndex(name => name === '3PT');
                      const ftIndex = playerData.names.findIndex(name => name === 'FT');
                      const rebIndex = playerData.names.findIndex(name => name === 'REB');
                      const astIndex = playerData.names.findIndex(name => name === 'AST');
                      const stlIndex = playerData.names.findIndex(name => name === 'STL');
                      const blkIndex = playerData.names.findIndex(name => name === 'BLK');
                      const toIndex = playerData.names.findIndex(name => name === 'TO');
                      const pfIndex = playerData.names.findIndex(name => name === 'PF');
                      const plusMinusIndex = playerData.names.findIndex(name => name === '+/-');
                      const ptsIndex = playerData.names.findIndex(name => name === 'PTS');

                      return (
                        <tr key={athlete.athlete.id} className="border-b border-gray-100">
                          <td className="py-2">
                            <div className="font-medium">{athlete.athlete.displayName}</div>
                            <div className="text-gray-500">#{athlete.athlete.jersey} {athlete.athlete.position.abbreviation}</div>
                          </td>
                          <td className="py-2 text-center">{athlete.stats[minutesIndex] || '-'}</td>
                          <td className="py-2 text-center">{athlete.stats[fgIndex] || '-'}</td>
                          <td className="py-2 text-center">{athlete.stats[threePtIndex] || '-'}</td>
                          <td className="py-2 text-center">{athlete.stats[ftIndex] || '-'}</td>
                          <td className="py-2 text-center">{athlete.stats[rebIndex] || '-'}</td>
                          <td className="py-2 text-center">{athlete.stats[astIndex] || '-'}</td>
                          <td className="py-2 text-center">{athlete.stats[stlIndex] || '-'}</td>
                          <td className="py-2 text-center">{athlete.stats[blkIndex] || '-'}</td>
                          <td className="py-2 text-center">{athlete.stats[toIndex] || '-'}</td>
                          <td className="py-2 text-center">{athlete.stats[pfIndex] || '-'}</td>
                          <td className="py-2 text-center">{athlete.stats[plusMinusIndex] || '-'}</td>
                          <td className="py-2 text-center font-medium">{athlete.stats[ptsIndex] || '-'}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    );
  };

  const renderLeaders = () => {
    if (!leaders.length) return null;

    return (
      <Card className="p-4 space-y-4">
        <h4 className="font-medium text-xs text-gray-600 uppercase tracking-wide">Game Leaders</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaders.map((teamLeader) => (
            <div key={teamLeader.team.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <img 
                  src={teamLeader.team.logo} 
                  alt={teamLeader.team.displayName}
                  className="w-5 h-5"
                />
                <span className="font-medium text-sm">{teamLeader.team.displayName}</span>
              </div>
              <div className="space-y-2">
                {teamLeader.leaders.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-muted-foreground min-w-[60px]">
                        {category.displayName}
                      </span>
                      {category.leaders.map((leader, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <img 
                            src={leader.athlete.headshot.href} 
                            alt={leader.athlete.displayName}
                            className="w-6 h-6 rounded-full"
                          />
                          <div>
                            <span className="text-xs font-medium">{leader.athlete.displayName}</span>
                            <span className="text-xs text-muted-foreground ml-1">#{leader.athlete.jersey}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-semibold">{category.leaders[0]?.displayValue}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const awayTeam = teams.find(t => t.homeAway === 'away')?.team;
  const homeTeam = teams.find(t => t.homeAway === 'home')?.team;

  return (
    <div className="w-full space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-bold">Box Score</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {awayTeam && renderTeamCard(awayTeam, false)}
        {homeTeam && renderTeamCard(homeTeam, true)}
        {renderLeaders()}
      </div>
    </div>
  );
};

export default GamePreview;
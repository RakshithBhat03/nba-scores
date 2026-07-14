import React from 'react';
import { ArrowLeft, X, FileX2 } from 'lucide-react';
import { BoxScore, Team, BoxScoreStatistic } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface GamePreviewProps {
  boxScore: BoxScore | null;
  isLoading: boolean;
  onClose: () => void;
}

function teamColor(color: string | undefined, alpha: number = 1): string {
  if (!color) return `hsl(var(--foreground) / ${alpha})`;
  const hex = color.replace('#', '');
  if (hex.length !== 6) return `hsl(var(--foreground) / ${alpha})`;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const GamePreview: React.FC<GamePreviewProps> = ({ boxScore, isLoading, onClose }) => {
  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <span className="text-sm text-muted-foreground">Loading box score...</span>
        </div>
      </div>
    );
  }

  if (!boxScore || !boxScore.boxscore) {
    return (
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-card">
          <h2 className="text-sm font-bold">Game Details</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <FileX2 className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Unable to load game details</p>
        </div>
      </div>
    );
  }

  const { teams, players } = boxScore.boxscore;
  const leaders = boxScore.leaders || [];

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
          <p className="text-muted-foreground text-center text-sm">Team data not available</p>
        </Card>
      );
    }

    const mainStats = teamStats.statistics.slice(0, 12);
    const playerData = playerStats.statistics[0];
    const accent = teamColor(team.color, 1);

    return (
      <Card variant="elevated" className="overflow-hidden">
        <div className="h-1" style={{ background: accent }} />
        <div className="space-y-3 p-3">
          {/* Team header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="grid h-10 w-10 place-items-center rounded-lg border border-border/60 bg-background/60"
                style={{ boxShadow: `inset 0 0 0 2px ${teamColor(team.color, 0.25)}` }}
              >
                <img
                  src={team.logo}
                  alt={team.displayName}
                  className="h-8 w-8 object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">{team.displayName}</h3>
                <Badge variant="record" className="mt-0.5">{isHome ? 'HOME' : 'AWAY'}</Badge>
              </div>
            </div>
            <span className="tabular-nums text-3xl font-extrabold leading-none">{score}</span>
          </div>

          {/* Team statistics */}
          {mainStats.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Team Statistics
              </h4>
              <div className="grid grid-cols-3 gap-1.5">
                {mainStats.map((stat, index) => (
                  <div key={index} className="rounded-md bg-muted/40 px-2 py-1.5">
                    <div className="text-[9px] font-medium uppercase text-muted-foreground">{getStatDisplayName(stat)}</div>
                    <div className="text-xs font-bold tabular-nums">{stat.displayValue || '-'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Player statistics */}
          {playerData && playerData.athletes.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Player Statistics
              </h4>
              <div className="overflow-x-auto scrollbar-thin -mx-1 px-1">
                <table className="w-full border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="sticky left-0 bg-elevated pb-1.5 pr-2 font-semibold">Player</th>
                      <th className="px-1 pb-1.5 text-center font-semibold">MIN</th>
                      <th className="px-1 pb-1.5 text-center font-semibold">FG</th>
                      <th className="px-1 pb-1.5 text-center font-semibold">3PT</th>
                      <th className="px-1 pb-1.5 text-center font-semibold">FT</th>
                      <th className="px-1 pb-1.5 text-center font-semibold">REB</th>
                      <th className="px-1 pb-1.5 text-center font-semibold">AST</th>
                      <th className="px-1 pb-1.5 text-center font-semibold">STL</th>
                      <th className="px-1 pb-1.5 text-center font-semibold">BLK</th>
                      <th className="px-1 pb-1.5 text-center font-semibold">TO</th>
                      <th className="px-1 pb-1.5 text-center font-semibold">PF</th>
                      <th className="px-1 pb-1.5 text-center font-semibold">+/-</th>
                      <th className="px-1 pb-1.5 text-center font-semibold">PTS</th>
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
                        const plusMinus = athlete.stats[plusMinusIndex] || '';

                        return (
                          <tr key={athlete.athlete.id} className="border-b border-border/40 hover:bg-accent/30">
                            <td className="sticky left-0 bg-elevated py-1.5 pr-2">
                              <div className="font-semibold text-foreground">{athlete.athlete.displayName}</div>
                              <div className="text-[10px] text-muted-foreground">#{athlete.athlete.jersey} {athlete.athlete.position.abbreviation}</div>
                            </td>
                            <td className="px-1 py-1.5 text-center tabular-nums">{athlete.stats[minutesIndex] || '-'}</td>
                            <td className="px-1 py-1.5 text-center tabular-nums">{athlete.stats[fgIndex] || '-'}</td>
                            <td className="px-1 py-1.5 text-center tabular-nums">{athlete.stats[threePtIndex] || '-'}</td>
                            <td className="px-1 py-1.5 text-center tabular-nums">{athlete.stats[ftIndex] || '-'}</td>
                            <td className="px-1 py-1.5 text-center tabular-nums">{athlete.stats[rebIndex] || '-'}</td>
                            <td className="px-1 py-1.5 text-center tabular-nums">{athlete.stats[astIndex] || '-'}</td>
                            <td className="px-1 py-1.5 text-center tabular-nums">{athlete.stats[stlIndex] || '-'}</td>
                            <td className="px-1 py-1.5 text-center tabular-nums">{athlete.stats[blkIndex] || '-'}</td>
                            <td className="px-1 py-1.5 text-center tabular-nums">{athlete.stats[toIndex] || '-'}</td>
                            <td className="px-1 py-1.5 text-center tabular-nums">{athlete.stats[pfIndex] || '-'}</td>
                            <td className="px-1 py-1.5 text-center tabular-nums">{plusMinus}</td>
                            <td className="px-1 py-1.5 text-center font-bold tabular-nums">{athlete.stats[ptsIndex] || '-'}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderLeaders = () => {
    if (!leaders.length) return null;

    return (
      <Card variant="elevated" className="space-y-3 p-3">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Game Leaders
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {leaders.map((teamLeader) => (
            <div key={teamLeader.team.id} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <img
                  src={teamLeader.team.logo}
                  alt={teamLeader.team.displayName}
                  className="h-4 w-4"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="text-xs font-semibold">{teamLeader.team.displayName}</span>
              </div>
              <div className="space-y-1.5">
                {teamLeader.leaders.map((category) => (
                  <div key={category.name} className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground min-w-[42px]">
                        {category.displayName}
                      </span>
                      {category.leaders.map((leader, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <img
                            src={leader.athlete.headshot?.href || ''}
                            alt={leader.athlete.displayName}
                            className="h-6 w-6 rounded-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <div>
                            <span className="text-[11px] font-medium">{leader.athlete.displayName}</span>
                            <span className="text-[10px] text-muted-foreground ml-0.5">#{leader.athlete.jersey}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-bold tabular-nums">{category.leaders[0]?.displayValue}</span>
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
  const headline = awayTeam && homeTeam ? `${awayTeam.abbreviation} @ ${homeTeam.abbreviation}` : 'Box Score';

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="w-full space-y-3"
    >
      <Card variant="elevated" className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-sm font-bold leading-tight">{headline}</h2>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Box Score</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </Card>

      <div className="space-y-3">
        {awayTeam && renderTeamCard(awayTeam, false)}
        {homeTeam && renderTeamCard(homeTeam, true)}
        {renderLeaders()}
      </div>
    </motion.div>
  );
};

export default GamePreview;

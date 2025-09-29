import { Conference } from '../../types/game';
import TeamStandingRow from './TeamStandingRow';
import { Card } from '@/components/ui/card';

interface ConferenceStandingsProps {
  conference: Conference;
}

export default function ConferenceStandings({ conference }: ConferenceStandingsProps) {
  if (!conference.standings || conference.standings.length === 0) {
    return (
      <Card className="overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-4xl mb-4">🏀</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No standings available
          </h3>
          <p className="text-muted-foreground">
            Standings are currently unavailable
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden w-full">
      {/* Table Header */}
      <div className="bg-muted/30 px-2 py-2 border-b border-border">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <div className="flex items-center space-x-3 flex-1">
            <span className="w-6 text-center">#</span>
            <span>Team</span>
          </div>
          <div className="flex space-x-6 text-center">
            <span className="w-8">W</span>
            <span className="w-8">L</span>
            <span className="w-12">PCT</span>
            <span className="w-8">GB</span>
          </div>
        </div>
      </div>

      {/* Team Standings */}
      <div className="divide-y divide-border">
        {conference.standings.map((teamStanding, index) => (
          <TeamStandingRow
            key={teamStanding.team.id}
            teamStanding={teamStanding}
            rank={index + 1}
          />
        ))}
      </div>
    </Card>
  );
}
import { Conference } from '../../types/game';
import TeamStandingRow from './TeamStandingRow';
import { Card } from '@/components/ui/card';
import nbaLogo48 from '/icons/icon48.png';

interface ConferenceStandingsProps {
  conference: Conference;
}

export default function ConferenceStandings({ conference }: ConferenceStandingsProps) {
  if (!conference.standings || conference.standings.length === 0) {
    return (
      <Card className="overflow-hidden">
        <div className="p-8 text-center">
          <img
            src={nbaLogo48}
            alt="NBA Logo"
            className="w-16 h-16 mb-4 mx-auto opacity-40"
          />
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
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      {/* Table header */}
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-2.5 py-2">
        <div className="flex items-center gap-2.5">
          <span className="grid h-6 w-6 place-items-center text-[10px] font-bold text-muted-foreground">#</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Team
          </span>
        </div>
        <div className="flex items-center text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span className="w-8">W</span>
          <span className="w-8">L</span>
          <span className="w-12">PCT</span>
          <span className="w-8">GB</span>
        </div>
      </div>

      {/* Team standings */}
      <div className="divide-y divide-border/50">
        {conference.standings.map((teamStanding, index) => (
          <TeamStandingRow
            key={teamStanding.team.id}
            teamStanding={teamStanding}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

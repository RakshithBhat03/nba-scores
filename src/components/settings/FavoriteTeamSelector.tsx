import { Star, ChevronDown } from "lucide-react";
import { useFavoriteTeam } from "@/hooks/useFavoriteTeam";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import nbaTeamsData from "@/data/nbaTeams.json";

interface NbaTeam {
  id: string;
  name: string;
  abbreviation: string;
  conference: string;
  division: string;
}

const teams: NbaTeam[] = nbaTeamsData.teams;

export default function FavoriteTeamSelector() {
  const { favoriteTeam, setFavoriteTeam } = useFavoriteTeam();

  const handleValueChange = (value: string) => {
    if (value === "none") {
      setFavoriteTeam(null);
    } else {
      setFavoriteTeam(value);
    }
  };

  const selectedTeam = teams.find((t) => t.id === favoriteTeam);

  return (
    <Select value={favoriteTeam || "none"} onValueChange={handleValueChange}>
      <SelectTrigger
        className="h-8 w-auto min-w-[72px] gap-1 border-0 bg-transparent px-2 text-white/90 hover:bg-white/15 focus:ring-0 focus:ring-offset-0 data-[state=open]:bg-white/15"
        title="Select favorite team"
      >
        <Star
          size={14}
          className={favoriteTeam ? "fill-yellow-400 text-yellow-400" : "text-white/80"}
        />
        <SelectValue>
          {selectedTeam ? selectedTeam.abbreviation : "FAV"}
        </SelectValue>
        <ChevronDown size={12} className="opacity-60" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        <SelectItem value="none">No favorite</SelectItem>
        {teams.map((team) => (
          <SelectItem key={team.id} value={team.id}>
            {team.abbreviation} · {team.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

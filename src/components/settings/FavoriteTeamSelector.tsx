import { Star } from "lucide-react";
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
        className="h-8 w-auto min-w-[70px] border-0 bg-transparent text-white hover:bg-white/10 focus:ring-0 focus:ring-offset-0 gap-1"
        title="Select favorite team"
      >
        <Star
          size={14}
          className={favoriteTeam ? "fill-yellow-400 text-yellow-400" : ""}
        />
        <SelectValue>
          {selectedTeam ? selectedTeam.abbreviation : "FAV"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        <SelectItem value="none">No favorite</SelectItem>
        {teams.map((team) => (
          <SelectItem key={team.id} value={team.id}>
            {team.abbreviation} - {team.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

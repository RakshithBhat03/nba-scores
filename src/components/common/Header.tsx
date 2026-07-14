import { RefreshCw, Trophy, Calendar } from "lucide-react";
import { useQueryClient, useIsFetching } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "../settings/ThemeToggle";
import FavoriteTeamSelector from "../settings/FavoriteTeamSelector";
import { format, startOfDay, addDays } from "date-fns";
import nbaLogo32 from "/icons/icon32.png";

interface HeaderProps {
  currentView: "scores" | "standings";
  onViewChange: (view: "scores" | "standings") => void;
  selectedDate: Date;
}

export default function Header({
  currentView,
  onViewChange,
  selectedDate,
}: HeaderProps) {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  const handleRefresh = () => {
    const dateString = format(selectedDate, "yyyyMMdd");
    queryClient.invalidateQueries({ queryKey: ["scores", dateString] });

    const normalizedDate = startOfDay(selectedDate);
    const windowStart = addDays(normalizedDate, -2);
    const windowKey = format(windowStart, "yyyyMMdd");
    queryClient.invalidateQueries({
      queryKey: ["scores", "window", windowKey],
    });

    queryClient.invalidateQueries({ queryKey: ["standings"] });
  };

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-[#1d4ed8] via-[#1e3a8a] to-[#0f172a] text-white shadow-header">
      {/* Ambient radial highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 120% at 85% -20%, rgba(255,255,255,0.22), transparent 60%)",
        }}
      />
      {/* Subtle top sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/30"
      />

      <div className="relative px-4 pt-3.5 pb-3">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
              <img src={nbaLogo32} alt="NBA Logo" className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-none">
              <h1 className="text-[15px] font-extrabold tracking-tight">
                NBA Scores
              </h1>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-blue-100/70">
                Live &amp; Standings
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <FavoriteTeamSelector />
            <button
              onClick={handleRefresh}
              disabled={isFetching > 0}
              title="Refresh all data"
              className="grid h-8 w-8 place-items-center rounded-lg text-white/90 transition-colors hover:bg-white/15 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={isFetching > 0 ? "animate-spin" : ""}
              />
            </button>
            <ThemeToggle />
          </div>
        </div>

        <Tabs
          value={currentView}
          onValueChange={(value) => onViewChange(value as "scores" | "standings")}
        >
          <TabsList className="mx-auto flex h-9 w-auto gap-1 bg-transparent p-0">
            <TabsTrigger
              value="scores"
              className="gap-1.5 rounded-full px-4 text-xs font-semibold data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-white/55 hover:data-[state=inactive]:text-white/80"
            >
              <Calendar size={13} />
              Scores
            </TabsTrigger>
            <TabsTrigger
              value="standings"
              className="gap-1.5 rounded-full px-4 text-xs font-semibold data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-white/55 hover:data-[state=inactive]:text-white/80"
            >
              <Trophy size={13} />
              Standings
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
}

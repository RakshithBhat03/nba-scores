// Re-export standings types from game.ts to maintain backward compatibility
export type {
  Standings,
  Conference,
  TeamStanding as Standing,
  StandingStat,
} from "./game";

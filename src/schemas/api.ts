import { z } from 'zod';

// Team schema
const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  abbreviation: z.string(),
  logo: z.string().url().optional(),
  color: z.string().optional(),
  alternateColor: z.string().optional(),
});

// Competitor schema
const CompetitorSchema = z.object({
  team: TeamSchema,
  score: z.string().optional(),
  records: z.array(z.object({
    summary: z.string()
  })).optional(),
});

// Competition schema
const CompetitionSchema = z.object({
  competitors: z.array(CompetitorSchema),
  venue: z.object({
    fullName: z.string().optional()
  }).optional(),
});

// Event/Game schema
const EventSchema = z.object({
  id: z.string(),
  date: z.string(),
  status: z.object({
    type: z.object({
      name: z.string()
    }),
    period: z.number().optional(),
    displayClock: z.string().optional(),
  }),
  competitions: z.array(CompetitionSchema),
});

// Scoreboard response schema
export const ScoreboardResponseSchema = z.object({
  events: z.array(EventSchema).optional().default([]),
});

// Standings team schema
const StandingsTeamSchema = z.object({
  id: z.string(),
  uid: z.string().optional(),
  displayName: z.string(),
  abbreviation: z.string().optional(),
  logos: z.array(z.object({
    href: z.string().url()
  })).optional(),
});

// Standings record schema
const StandingsRecordSchema = z.object({
  team: StandingsTeamSchema,
  stats: z.array(z.object({
    name: z.string(),
    value: z.union([z.number(), z.string()]),
    displayValue: z.string().optional(),
  })),
});

// Standings response schema
export const StandingsResponseSchema = z.object({
  children: z.array(z.object({
    name: z.string(),
    standings: z.object({
      entries: z.array(StandingsRecordSchema)
    })
  })).optional().default([]),
});

// Type exports
export type ScoreboardResponse = z.infer<typeof ScoreboardResponseSchema>;
export type StandingsResponse = z.infer<typeof StandingsResponseSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Team = z.infer<typeof TeamSchema>;
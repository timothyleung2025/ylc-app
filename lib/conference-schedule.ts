export type ScheduleCategory =
  "Session" | "Keynote" | "Team" | "Break" | "Other";

export type ConferenceScheduleEvent = {
  id: string;
  date: string;
  time: string;
  title: string;
  category: ScheduleCategory;
};

export type ConferenceDay = {
  date: string;
  short: string;
  label: string;
  events: ConferenceScheduleEvent[];
};

const source = [
  {
    date: "2026-08-05",
    short: "Wed, Aug 5",
    label: "Day 1",
    events: [
      ["10:00 AM", "Introduction"],
      ["10:15 AM", "Meet Your Team"],
      ["11:00 AM", "Keynote: Camille Chu"],
      ["11:15 AM", "Keynote: Dr. Samuel So"],
      ["12:00 PM", "Lunch"],
      ["1:00 PM", "Keynote: Sa Nguyen"],
      ["2:00 PM", "Team Activity"],
      ["2:30 PM", "Break"],
      ["3:00 PM", "Team Challenge Introduction"],
      ["3:15 PM", "Working Session"],
      ["4:00 PM", "Keynote: Miyu Ikeda and Timothy Leung"],
      ["5:00 PM", "Closing"],
    ],
  },
  {
    date: "2026-08-06",
    short: "Thurs, Aug 6",
    label: "Day 2",
    events: [
      ["10:00 AM", "Introduction"],
      ["10:15 AM", "Team Activity"],
      ["11:00 AM", "Working Session"],
      ["12:30 PM", "Lunch"],
      ["1:30 PM", "Keynote: Judy Huynh"],
      ["2:30 PM", "Break"],
      ["3:00 PM", "Keynote: Austin Pliler"],
      ["4:00 PM", "Team HBV Presentation"],
      ["4:30 PM", "Working Session"],
      ["5:00 PM", "Closing"],
    ],
  },
  {
    date: "2026-08-07",
    short: "Fri, Aug 7",
    label: "Day 3",
    events: [
      ["10:00 AM", "Introduction"],
      ["10:15 AM", "Keynote: Dr. Crystal Hlaing Reece"],
      ["11:15 AM", "Team Activity"],
      ["12:00 PM", "Lunch"],
      ["1:00 PM", "Keynote: Koy Suntichotinun"],
      ["2:00 PM", "Break"],
      ["2:30 PM", "Student Panel"],
      ["3:30 PM", "Working Session"],
      ["5:00 PM", "Closing"],
    ],
  },
  {
    date: "2026-08-08",
    short: "Sat, Aug 8",
    label: "Day 4",
    events: [
      ["10:00 AM", "Introduction"],
      ["10:30 AM", "Final Working Session"],
      ["11:30 AM", "Lunch"],
      ["12:30 PM", "Team Presentations"],
      ["1:20 PM", "Break"],
      ["1:30 PM", "Team Presentations"],
      ["2:20 PM", "Judges’ Deliberation"],
      ["2:30 PM", "Announcement of Winners and Closing Remarks"],
      ["3:00 PM", "The End"],
    ],
  },
] as const;

export function scheduleCategory(title: string): ScheduleCategory {
  if (title.includes("Keynote")) return "Keynote";
  if (title.includes("Lunch") || title.includes("Break")) return "Break";
  if (title.includes("Team") || title.includes("Working Session"))
    return "Team";
  return "Session";
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export const conferenceDays: ConferenceDay[] = source.map((day, dayIndex) => ({
  date: day.date,
  short: day.short,
  label: day.label,
  events: day.events.map(([time, title], eventIndex) => ({
    id: `day-${dayIndex + 1}-${slug(title)}-${eventIndex + 1}`,
    date: day.date,
    time,
    title,
    category: scheduleCategory(title),
  })),
}));
export const conferenceEvents = conferenceDays.flatMap((day) => day.events);

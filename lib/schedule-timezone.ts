export type ScheduleZone = "Pacific" | "Mountain" | "Central" | "Eastern";

export const scheduleZones: Record<ScheduleZone, string> = {
  Pacific: "America/Los_Angeles",
  Mountain: "America/Denver",
  Central: "America/Chicago",
  Eastern: "America/New_York",
};

const referenceDate = new Date("2026-08-05T12:00:00Z");

function offsetFor(timeZone: string) {
  try {
    const value = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longOffset",
    }).formatToParts(referenceDate).find(part => part.type === "timeZoneName")?.value;
    const match = value?.match(/GMT([+-])(\d{2}):(\d{2})/);
    if (!match) return null;
    const minutes = Number(match[2]) * 60 + Number(match[3]);
    return match[1] === "-" ? -minutes : minutes;
  } catch {
    return null;
  }
}

export function detectScheduleZone(): ScheduleZone {
  const deviceZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const deviceOffset = offsetFor(deviceZone);
  if (deviceOffset === null) return "Pacific";
  return (Object.entries(scheduleZones).find(([, zone]) => offsetFor(zone) === deviceOffset)?.[0] as ScheduleZone | undefined) ?? "Pacific";
}

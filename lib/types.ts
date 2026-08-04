export type ConferenceDay = 1 | 2 | 3 | 4;
export type EventCategory = "Session" | "Workshop" | "Team Challenge" | "Meal" | "Break" | "Presentation";
export type EventStatus = "completed" | "now" | "upcoming";
export interface ScheduleEvent { id:string; day:ConferenceDay; time:string; endTime?:string; title:string; type:EventCategory; location:string; status:EventStatus; description:string; materials?:string[]; instructions?:string; deadline?:string; }
export interface Team { id:string; name:string; color:string; pale:string; motto:string; points:number; members:string[]; rank:number; }
export interface Announcement { id:string; title:string; body:string; time:string; priority?:boolean; icon:"info"|"clock"|"sparkles"|"heart"; }
export type MemoryKind = "Reflection" | "Favorite moment" | "Shoutout" | "Takeaway" | "Team memory";
export interface MemoryPost { id:string; author:string; initials:string; team:string; type:MemoryKind; text:string; time:string; color:string; image?:string; likes:number; style:"polaroid"|"postcard"|"note"; }
export interface Activity { id:string; title:string; eyebrow:string; purpose:string; why:string; steps:string[]; timeLimit:string; deliverables:string[]; criteria:string[]; deadline:string; tips:string[]; materials:string[]; prompt:string; }

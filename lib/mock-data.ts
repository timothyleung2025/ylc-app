import { Activity, Announcement, ConferenceDay, MemoryPost, ScheduleEvent, Team } from "./types";

export const teams: Team[] = [
  {id:"ruby",name:"Team Ruby",color:"#b83b46",pale:"#f9e2e3",motto:"Lead with courage, glow with purpose.",points:420,members:["Noah","Sofia","Ethan","Leila","Ryan"],rank:1},
  {id:"jade",name:"Team Jade",color:"#28765a",pale:"#dbefe6",motto:"Grow together. Lead with heart.",points:390,members:["Maya","Aiden","Nina","Caleb","Iris"],rank:2},
  {id:"gold",name:"Team Gold",color:"#b77b15",pale:"#fff0c7",motto:"Bright ideas, lasting impact.",points:355,members:["Theo","Ava","Liam","Mei","Sam"],rank:3},
  {id:"sky",name:"Team Sky",color:"#347fa1",pale:"#dff2f7",motto:"Think higher. Reach further.",points:330,members:["Zoe","Ben","Mina","Alex","Kai"],rank:4},
  {id:"violet",name:"Team Violet",color:"#78518e",pale:"#eee3f4",motto:"Bold voices, shared vision.",points:305,members:["Emma","Jay","Lena","Owen","Ana"],rank:5},
];

export const conferenceDays: {day:ConferenceDay; date:string; shortDate:string; label:string}[] = [
  {day:1,date:"2026-08-05",shortDate:"AUG 5",label:"Wednesday, August 5"},
  {day:2,date:"2026-08-06",shortDate:"AUG 6",label:"Thursday, August 6"},
  {day:3,date:"2026-08-07",shortDate:"AUG 7",label:"Friday, August 7"},
  {day:4,date:"2026-08-08",shortDate:"AUG 8",label:"Saturday, August 8"},
];

const event = (id:string, day:ConferenceDay, time:string, endTime:string|undefined, title:string, type:ScheduleEvent["type"], description:string, status:ScheduleEvent["status"]="upcoming"):ScheduleEvent =>
  ({id,day,time,endTime,title,type,location:"Zoom",status,description});

export const schedule: ScheduleEvent[] = [
  event("day-1-introduction",1,"10:00 AM","10:15 AM","Introduction","Session","Welcome and overview of the day.","now"),
  event("day-1-meet-team",1,"10:15 AM","11:00 AM","Meet Your Team","Session","Meet your teammates and get oriented."),
  event("day-1-camille-chu",1,"11:00 AM","11:15 AM","Keynote: Camille Chu","Session","Keynote address."),
  event("day-1-samuel-so",1,"11:15 AM","12:00 PM","Keynote: Dr. Samuel So","Session","Keynote address."),
  event("day-1-lunch",1,"12:00 PM","1:00 PM","Lunch","Meal","Lunch break."),
  event("day-1-sa-nguyen",1,"1:00 PM","2:00 PM","Keynote: Sa Nguyen","Session","Keynote address."),
  event("day-1-team-activity",1,"2:00 PM","2:30 PM","Team Activity","Team Challenge","A guided activity with your team."),
  event("day-1-break",1,"2:30 PM","3:00 PM","Break","Break","A short break."),
  event("day-1-challenge-intro",1,"3:00 PM","3:15 PM","Team Challenge Introduction","Team Challenge","Introduction to the team challenge."),
  event("day-1-working-session",1,"3:15 PM","4:00 PM","Working Session","Workshop","Dedicated time to work with your team."),
  event("day-1-nicole-laeno",1,"4:00 PM","5:00 PM","Keynote: Nicole Laeno","Session","Keynote address."),
  event("day-1-closing",1,"5:00 PM",undefined,"Closing","Session","Closing remarks for the day."),

  event("day-2-introduction",2,"10:00 AM","10:15 AM","Introduction","Session","Welcome and overview of the day."),
  event("day-2-team-activity",2,"10:15 AM","11:00 AM","Team Activity","Team Challenge","A guided activity with your team."),
  event("day-2-working-session-1",2,"11:00 AM","12:30 PM","Working Session","Workshop","Dedicated time to work with your team."),
  event("day-2-lunch",2,"12:30 PM","1:30 PM","Lunch","Meal","Lunch break."),
  event("day-2-judy-hunyh",2,"1:30 PM","2:30 PM","Keynote: Judy Hunyh","Session","Keynote address."),
  event("day-2-break",2,"2:30 PM","3:00 PM","Break","Break","A short break."),
  event("day-2-austin-pilier",2,"3:00 PM","4:00 PM","Keynote: Austin Pilier","Session","Keynote address."),
  event("day-2-hbv-presentation",2,"4:00 PM","4:30 PM","Potential Team HBV Presentation","Presentation","Team presentation session."),
  event("day-2-working-session-2",2,"4:30 PM","5:00 PM","Working Session","Workshop","Dedicated time to work with your team."),
  event("day-2-closing",2,"5:00 PM",undefined,"Closing","Session","Closing remarks for the day."),

  event("day-3-introduction",3,"10:00 AM","10:15 AM","Introduction","Session","Welcome and overview of the day."),
  event("day-3-stephanie-lin",3,"10:15 AM","11:15 AM","Keynote: Stephanie Lin","Session","Keynote address."),
  event("day-3-team-activity",3,"11:15 AM","12:00 PM","Team Activity","Team Challenge","A guided activity with your team."),
  event("day-3-lunch",3,"12:00 PM","1:00 PM","Lunch","Meal","Lunch break."),
  event("day-3-koy-suntichotnun",3,"1:00 PM","2:00 PM","Keynote: Koy Suntichotnun","Session","Keynote address."),
  event("day-3-break",3,"2:00 PM","2:30 PM","Break","Break","A short break."),
  event("day-3-student-panel",3,"2:30 PM","3:30 PM","Student Panel","Session","A panel conversation with students."),
  event("day-3-working-session",3,"3:30 PM","5:00 PM","Working Session","Workshop","Dedicated time to work with your team."),
  event("day-3-closing",3,"5:00 PM",undefined,"Closing","Session","Closing remarks for the day."),

  event("day-4-introduction",4,"10:00 AM","10:30 AM","Introduction","Session","Welcome and overview of the final day."),
  event("day-4-final-working-session",4,"10:30 AM","11:30 AM","Final Working Session","Workshop","Final dedicated time to work with your team."),
  event("day-4-lunch",4,"11:30 AM","12:30 PM","Lunch","Meal","Lunch break."),
  event("day-4-presentations-1",4,"12:30 PM","1:20 PM","Team Presentations","Presentation","Teams present their work."),
  event("day-4-break",4,"1:20 PM","1:30 PM","Break","Break","A short break."),
  event("day-4-presentations-2",4,"1:30 PM","2:20 PM","Team Presentations","Presentation","Teams continue presenting their work."),
  event("day-4-judges",4,"2:20 PM","2:30 PM","Judges’ Deliberation","Session","Judges review the team presentations."),
  event("day-4-winners",4,"2:30 PM","3:00 PM","Announcement of Winners and Closing Remarks","Session","Winners are announced and the conference concludes."),
  event("day-4-end",4,"3:00 PM",undefined,"The End","Session","The conference has concluded."),
];

export const activities: Activity[] = [{id:"public-health-video",title:"Public Health Video Challenge",eyebrow:"Mission 01 · Team Challenge",purpose:"Create a short-form video that makes a liver-health message understandable and engaging for other teenagers.",why:"Clear, creative health communication can help young people make informed choices—and your voice can reach peers in a way institutions often cannot.",steps:["Choose one liver-health message.","Identify the audience.","Plan a 30–60 second video.","Film and edit the video.","Submit it before the deadline."],timeLimit:"2 hours 30 minutes",deliverables:["One 30–60 second vertical video","A short caption","Credits for everyone who contributed"],criteria:["Clarity","Creativity","Accuracy","Audience engagement","Team collaboration"],deadline:"Confirm with your facilitator",tips:["Lead with one clear idea","Use captions for accessibility","Film near a window for better light","End with a memorable action"],materials:["Phone or tablet","Storyboard sheet","Liver health fact sheet","Optional props"],prompt:"How might you explain one surprising liver-health fact to a friend in under a minute?"}];

export const announcements: Announcement[] = [
 {id:"a1",title:"Conference begins Wednesday, August 5",body:"Join the opening Introduction on Zoom at 10:00 AM.",time:"12 min ago",priority:true,icon:"info"},
 {id:"a2",title:"Four-day agenda is available",body:"Review the complete schedule and plan each conference day.",time:"36 min ago",icon:"clock"},
 {id:"a3",title:"Team presentations are Saturday",body:"Team presentations begin at 12:30 PM on the final day.",time:"1 hr ago",icon:"sparkles"},
 {id:"a4",title:"World Hepatitis Day volunteers",body:"Keep the momentum going after YLC. Sign up to support our July awareness event.",time:"Yesterday",icon:"heart"},
 {id:"a5",title:"Help hang community banners",body:"Join the ALC team next Saturday for a creative volunteer morning in San Jose.",time:"Yesterday",icon:"heart"},
];

export const memories: MemoryPost[] = [
 {id:"m1",author:"Leila",initials:"LK",team:"Team Ruby",type:"Favorite moment",text:"Our team turned a pile of sticky notes into an idea we actually want to build. The energy was unreal ✨",time:"18 min",color:"#f6c8c7",likes:14,style:"polaroid",image:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"},
 {id:"m2",author:"Aiden",initials:"AP",team:"Team Jade",type:"Takeaway",text:"Good leadership is making space for the quietest idea in the room.",time:"31 min",color:"#d9eedf",likes:22,style:"note"},
 {id:"m3",author:"Mei",initials:"ML",team:"Team Gold",type:"Shoutout",text:"Shoutout to Nina for helping every team with their video captions!",time:"46 min",color:"#ffe7a6",likes:19,style:"postcard"},
 {id:"m4",author:"Kai",initials:"KC",team:"Team Sky",type:"Reflection",text:"I came in nervous and already feel like I found people who care about the same things I do.",time:"1 hr",color:"#dceef5",likes:27,style:"note"},
];

export const volunteers = [
 {title:"World Hepatitis Day",date:"July 28",location:"San Francisco",description:"Help run an interactive liver-health awareness booth.",tag:"Community event"},
 {title:"Banner Hanging Day",date:"August 8",location:"San Jose",description:"Install student-designed prevention banners with ALC staff.",tag:"Creative action"},
 {title:"Youth Ambassador Program",date:"Applications in September",location:"Hybrid",description:"Continue developing your advocacy project with monthly mentorship.",tag:"Long-term"},
];

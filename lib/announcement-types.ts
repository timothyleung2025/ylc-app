export type AnnouncementCategory="General"|"Schedule Update"|"Urgent"|"Reminder"|"Opportunity";
export type AnnouncementPriority="normal"|"important"|"urgent";
export type AnnouncementAudience="everyone"|"team"|"organizers";
export type AnnouncementStatus="draft"|"published"|"archived";
export type Announcement={id:string;title:string;message:string;category:AnnouncementCategory;priority:AnnouncementPriority;audience_type:AnnouncementAudience;audience_team_id:string|null;related_schedule_event_id:string|null;action_label:string|null;action_url:string|null;is_pinned:boolean;send_push:boolean;status:AnnouncementStatus;published_at:string|null;expires_at:string|null;created_by:string;created_at:string;updated_at:string;is_test?:boolean};
export type AnnouncementView=Announcement&{isRead:boolean};

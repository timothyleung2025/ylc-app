export type AnnouncementCategory = "general" | "reminder" | "schedule_update" | "urgent";

export type Announcement = {
  id: string;
  title: string;
  message: string;
  category: AnnouncementCategory;
  is_pinned: boolean;
  created_at: string;
};

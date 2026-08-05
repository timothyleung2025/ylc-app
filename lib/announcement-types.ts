export type AnnouncementCategory = "general" | "urgent" | "link";

export type Announcement = {
  id: string;
  title: string;
  message: string;
  link_url: string | null;
  category: AnnouncementCategory;
  is_pinned: boolean;
  created_at: string;
};

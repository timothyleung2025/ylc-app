"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { Archive, Copy, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Announcement,
  AnnouncementAudience,
  AnnouncementCategory,
  AnnouncementPriority,
  AnnouncementStatus,
} from "@/lib/announcement-types";
import {
  announcementMode,
  archiveAnnouncement,
  deleteAnnouncement,
  fetchAdminAnnouncements,
  saveAnnouncement,
} from "@/lib/announcement-service";
import { conferenceEvents } from "@/lib/conference-schedule";
import { getSupabase } from "@/lib/supabase";
import { Button, PageHeader, Sheet } from "@/components/ui";
const presets = [
  "The next session begins in 5 minutes.",
  "The room for the next session has changed.",
  "Please return from break.",
  "Team submissions are due soon.",
  "Please gather for the group photo.",
  "An updated schedule is now available.",
];
const empty = {
  title: "",
  message: "",
  category: "General" as AnnouncementCategory,
  priority: "normal" as AnnouncementPriority,
  audience_type: "everyone" as AnnouncementAudience,
  audience_team_id: "",
  related_schedule_event_id: "",
  action_label: "",
  action_url: "",
  is_pinned: false,
  send_push: true,
  expires_at: "",
};
export default function AdminAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [tab, setTab] = useState<AnnouncementStatus>("published");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [audience, setAudience] = useState("All");
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [confirmUrgent, setConfirmUrgent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [delivery, setDelivery] = useState("No pushes sent");
  async function load() {
    setItems(await fetchAdminAnnouncements());
  }
  useEffect(() => {
    load();
  }, []);
  const shown = useMemo(
    () =>
      items.filter(
        (a) =>
          a.status === tab &&
          (category === "All" || a.category === category) &&
          (audience === "All" || a.audience_type === audience) &&
          `${a.title} ${a.message}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [items, tab, category, audience, search],
  );
  function edit(item?: Announcement) {
    setEditing(item?.id || null);
    setForm(
      item
        ? {
            title: item.title,
            message: item.message,
            category: item.category,
            priority: item.priority,
            audience_type: item.audience_type,
            audience_team_id: item.audience_team_id || "",
            related_schedule_event_id: item.related_schedule_event_id || "",
            action_label: item.action_label || "",
            action_url: item.action_url || "",
            is_pinned: item.is_pinned,
            send_push: item.send_push,
            expires_at: item.expires_at?.slice(0, 16) || "",
          }
        : empty,
    );
    setOpen(true);
  }
  async function submit(status: AnnouncementStatus) {
    if (saving) return;
    if (
      status === "published" &&
      form.priority === "urgent" &&
      form.send_push &&
      !confirmUrgent
    ) {
      setConfirmUrgent(true);
      return;
    }
    setSaving(true);
    try {
      const saved = await saveAnnouncement({
        ...form,
        id: editing || undefined,
        status,
        audience_team_id: form.audience_team_id || null,
        related_schedule_event_id: form.related_schedule_event_id || null,
        action_label: form.action_label || null,
        action_url: form.action_url || null,
        expires_at: form.expires_at
          ? new Date(form.expires_at).toISOString()
          : null,
      });
      if (status === "published" && form.send_push) {
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase.functions.invoke(
            "send-announcement-push",
            { body: { announcementId: saved.id, testOnly: false } },
          );
          setDelivery(
            error
              ? `Failed: ${error.message}`
              : `Sent ${data?.sent || 0}, failed ${data?.failed || 0}`,
          );
        } else setDelivery("Development fallback: push not sent");
      }
      setOpen(false);
      setConfirmUrgent(false);
      await load();
    } finally {
      setSaving(false);
    }
  }
  return (
    <main className="min-h-dvh bg-[var(--cream)] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow={`Admin · ${announcementMode()}`}
          title="Announcements"
          action={
            <Button onClick={() => edit()} className="flex items-center gap-2">
              <Plus size={17} />
              Create
            </Button>
          }
        />
        <div className="card mb-5 flex flex-wrap gap-3 p-3">
          <label className="flex min-w-52 flex-1 items-center gap-2 rounded-xl border bg-white px-3">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="min-h-11 flex-1 outline-none"
            />
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border bg-white px-3"
          >
            <option>All</option>
            {[
              "General",
              "Schedule Update",
              "Urgent",
              "Reminder",
              "Opportunity",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="rounded-xl border bg-white px-3"
          >
            <option>All</option>
            <option value="everyone">everyone</option>
            <option value="team">team</option>
            <option value="organizers">organizers</option>
          </select>
        </div>
        <div className="mb-4 flex gap-2">
          {(["published", "draft", "archived"] as AnnouncementStatus[]).map(
            (value) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`rounded-full px-4 py-2 text-xs font-black capitalize ${tab === value ? "bg-[var(--charcoal-blue)] text-white" : "bg-white"}`}
              >
                {value}
              </button>
            ),
          )}
        </div>
        <div className="space-y-3">
          {shown.map((item) => (
            <article key={item.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex gap-2 text-[9px] font-black uppercase text-[var(--muted)]">
                    <span>{item.category}</span>
                    <span>{item.audience_type}</span>
                    <span>{item.priority}</span>
                    {item.is_test && <span>TEST</span>}
                  </div>
                  <h2 className="mt-2 font-display text-2xl">{item.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                    {item.message}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => edit(item)}
                    className="rounded-lg border px-3 py-2 text-xs font-bold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      edit({ ...item, id: "", title: `Copy of ${item.title}` });
                      setEditing(null);
                    }}
                    aria-label="Duplicate"
                    className="rounded-lg border p-2"
                  >
                    <Copy size={15} />
                  </button>
                  <button
                    onClick={async () => {
                      await archiveAnnouncement(item.id);
                      load();
                    }}
                    aria-label="Archive"
                    className="rounded-lg border p-2"
                  >
                    <Archive size={15} />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm("Delete this announcement?")) {
                        await deleteAnnouncement(item.id);
                        load();
                      }
                    }}
                    aria-label="Delete"
                    className="rounded-lg border p-2 text-red-700"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="card mt-6 p-4 text-sm">
          <b>Delivery status:</b> {delivery}
          <p className="mt-1 text-xs text-[var(--muted)]">
            Development announcements and test pushes are clearly isolated.
            Production delivery summaries come from the Edge Function.
          </p>
        </div>
      </div>
      <Sheet
        open={open}
        onClose={() => {
          setOpen(false);
          setConfirmUrgent(false);
        }}
        title={editing ? "Edit announcement" : "Create announcement"}
      >
        {confirmUrgent ? (
          <div>
            <p className="text-xs font-black uppercase text-red-700">
              Confirm urgent push
            </p>
            <h3 className="mt-2 font-display text-3xl">
              Publish to {form.audience_type}?
            </h3>
            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="font-bold">Expected recipients</dt>
                <dd>Calculated securely by the Edge Function</dd>
              </div>
              <div>
                <dt className="font-bold">Notification</dt>
                <dd>
                  {form.title}
                  <br />
                  {form.message.slice(0, 140)}
                </dd>
              </div>
              <div>
                <dt className="font-bold">Pinned</dt>
                <dd>{form.is_pinned ? "Yes" : "No"}</dd>
              </div>
              <div>
                <dt className="font-bold">Related event</dt>
                <dd>{form.related_schedule_event_id || "None"}</dd>
              </div>
              <div>
                <dt className="font-bold">Action</dt>
                <dd>{form.action_url || "None"}</dd>
              </div>
            </dl>
            <Button
              disabled={saving}
              onClick={() => submit("published")}
              className="mt-6 w-full"
            >
              {saving ? "Publishing…" : "Confirm and publish"}
            </Button>
          </div>
        ) : preview ? (
          <div>
            <p className="text-xs font-black uppercase text-[var(--dark-cyan)]">
              Mobile preview
            </p>
            <div className="card mt-3 p-4">
              <span className="text-[9px] font-black uppercase">
                {form.category}
              </span>
              <h3 className="mt-2 font-display text-2xl">
                {form.title || "Announcement title"}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {form.message || "Announcement message"}
              </p>
            </div>
            <button
              onClick={() => setPreview(false)}
              className="mt-4 font-bold text-[var(--dark-cyan)]"
            >
              Back to editing
            </button>
          </div>
        ) : (
          <Composer
            form={form}
            setForm={setForm}
            onSubmit={submit}
            onPreview={() => setPreview(true)}
            saving={saving}
          />
        )}
      </Sheet>
    </main>
  );
}
function Composer({
  form,
  setForm,
  onSubmit,
  onPreview,
  saving,
}: {
  form: typeof empty;
  setForm: React.Dispatch<React.SetStateAction<typeof empty>>;
  onSubmit: (status: AnnouncementStatus) => void;
  onPreview: () => void;
  saving: boolean;
}) {
  const set = (key: keyof typeof empty, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-black uppercase text-[var(--muted)]">
          Quick presets
        </p>
        <div className="flex flex-wrap gap-2">
          {presets.map((text) => (
            <button
              key={text}
              onClick={() => set("message", text)}
              className="rounded-full bg-[#fff0c8] px-3 py-1.5 text-[10px] font-bold"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
      <Field
        label="Title"
        value={form.title}
        onChange={(v) => set("title", v)}
      />
      <label className="block text-sm font-bold">
        Message
        <textarea
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className="mt-2 min-h-28 w-full rounded-xl border p-3"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Category"
          value={form.category}
          values={[
            "General",
            "Schedule Update",
            "Urgent",
            "Reminder",
            "Opportunity",
          ]}
          onChange={(v) => set("category", v)}
        />
        <Select
          label="Priority"
          value={form.priority}
          values={["normal", "important", "urgent"]}
          onChange={(v) => set("priority", v)}
        />
        <Select
          label="Audience"
          value={form.audience_type}
          values={["everyone", "team", "organizers"]}
          onChange={(v) => set("audience_type", v)}
        />
        <Select
          label="Related event"
          value={form.related_schedule_event_id}
          values={["", ...conferenceEvents.map((e) => e.id)]}
          onChange={(v) => set("related_schedule_event_id", v)}
        />
      </div>
      {form.audience_type === "team" && (
        <Field
          label="Team UUID"
          value={form.audience_team_id}
          onChange={(v) => set("audience_team_id", v)}
        />
      )}
      <Field
        label="Action label (optional)"
        value={form.action_label}
        onChange={(v) => set("action_label", v)}
      />
      <Field
        label="Action URL (optional)"
        value={form.action_url}
        onChange={(v) => set("action_url", v)}
      />
      <label className="block text-sm font-bold">
        Expires at
        <input
          type="datetime-local"
          value={form.expires_at}
          onChange={(e) => set("expires_at", e.target.value)}
          className="mt-2 min-h-11 w-full rounded-xl border px-3"
        />
      </label>
      <label className="flex justify-between text-sm font-bold">
        Pin announcement
        <input
          type="checkbox"
          checked={form.is_pinned}
          onChange={(e) => set("is_pinned", e.target.checked)}
        />
      </label>
      <label className="flex justify-between text-sm font-bold">
        Send push notification
        <input
          type="checkbox"
          checked={form.send_push}
          onChange={(e) => set("send_push", e.target.checked)}
        />
      </label>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onSubmit("draft")}
          disabled={saving}
          className="rounded-xl border bg-white text-sm font-bold"
        >
          Save draft
        </button>
        <button
          onClick={onPreview}
          className="rounded-xl border bg-white text-sm font-bold"
        >
          Preview
        </button>
        <Button onClick={() => onSubmit("published")} disabled={saving}>
          {saving ? "Saving…" : "Publish"}
        </Button>
      </div>
    </div>
  );
}
function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 min-h-11 w-full rounded-xl border px-3"
      />
    </label>
  );
}
function Select({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 min-h-11 w-full rounded-xl border bg-white px-2"
      >
        {values.map((v) => (
          <option key={v} value={v}>
            {v || "None"}
          </option>
        ))}
      </select>
    </label>
  );
}

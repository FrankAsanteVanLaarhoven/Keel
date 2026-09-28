import { listAnnouncements, listCourses, listWork, filesFor } from "@/lib/classbook";
import { calendarIcs, type CalendarEvent } from "@/lib/calendar";
import { weeks, workOpen } from "@/lib/term";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const now = Date.now();
  const events: CalendarEvent[] = [];
  for (const work of listWork()) {
    if (!workOpen(work, now).open && work.status !== "published") continue;
    const week = weeks.find((item) => item.id === work.id);
    const when = work.closesAt ?? work.opensAt ?? defaultDeadline(week?.no ?? 1, now);
    if (!week) continue;
    const downloads = filesFor(work.id, "", true).filter((file) => file.scope === "class");
    events.push({
      uid: `keel-${work.id}-deadline@keel`,
      start: when,
      end: when + 60 * 60 * 1000,
      title: work.title,
      details: [work.brief, downloads.length ? `Downloads: ${downloads.map((file) => file.name).join(", ")}` : ""].filter(Boolean).join("\n"),
      url: `${origin}/term/${work.id}`,
    });
  }
  for (const course of listCourses()) {
    if (!workOpen(course, now).open) continue;
    const when = course.closesAt ?? course.opensAt;
    if (!when) continue;
    const downloads = filesFor(course.id, "", true).filter((file) => file.scope === "class");
    events.push({
      uid: `keel-${course.id}@keel`,
      start: course.opensAt ?? when,
      end: (course.closesAt ?? when) + 60 * 60 * 1000,
      title: course.title,
      details: [course.summary, downloads.length ? `Downloads: ${downloads.map((file) => file.name).join(", ")}` : ""].filter(Boolean).join("\n"),
      url: `${origin}/term/course/${course.id}`,
    });
  }
  for (const note of listAnnouncements()) {
    if (note.status !== "published") continue;
    const when = note.publishAt ?? now;
    events.push({
      uid: `keel-${note.id}@keel`,
      start: when,
      end: when + 30 * 60 * 1000,
      title: note.title,
      details: note.body,
      url: note.courseId ? `${origin}/term/course/${note.courseId}` : `${origin}/term`,
    });
  }
  return new Response(calendarIcs(events), {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": "attachment; filename=\"keel.ics\"",
      "cache-control": "private, no-store",
    },
  });
}

function defaultDeadline(weekNo: number, now: number): number {
  const date = new Date(now);
  const untilMonday = (8 - date.getUTCDay()) % 7 || 7;
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + untilMonday + (weekNo - 1) * 7, 16, 0, 0);
}

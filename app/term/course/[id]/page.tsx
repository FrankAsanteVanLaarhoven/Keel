import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WeekTools } from "@/components/term-desk";
import { courseById, filesFor, listAnnouncements } from "@/lib/classbook";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { currentUser } from "@/lib/ready";
import { isStaffOrAdmin } from "@/lib/security";
import { getProfile } from "@/lib/store";
import { workOpen } from "@/lib/term";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const course = await courseById((await params).id);
  return { title: course ? `${course.title} — Keel` : "Keel", robots: { index: false, follow: false } };
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const course = await courseById((await params).id);
  if (!course) notFound();
  const locale = await resolveLocale();
  const m = t(locale);
  const user = await currentUser();
  const staff = isStaffOrAdmin(user ? (await getProfile(user.id))?.role : null, user?.email);
  const open = workOpen(course, Date.now()).open;
  if (!open && !staff) notFound();
  const files = (await filesFor(course.id, user?.id ?? "", staff)).filter((file) => file.scope === "class");
  const notes = (await listAnnouncements()).filter((note) => note.courseId === course.id && (note.status === "published" || staff));
  return (
    <article className="mx-auto w-full max-w-[42rem] px-5 pb-36 pt-10">
      <p className="kicker">{m.publishedCourses}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{course.title}</h1>
      <p className="mt-4 text-xl">{course.summary}</p>
      <p className="mt-4 text-sm text-soft">{open ? m.weekOpen : m.weekPaused}</p>
      <p className="mt-6"><a className="underline" href="/api/calendar">{m.calendarImport}</a></p>
      {notes.length ? (
        <section className="mt-8">
          <h2 className="text-2xl font-medium">{m.announcement}</h2>
          {notes.map((note) => (
            <div key={note.id} className="mt-4 border border-line px-4 py-3">
              <p className="font-medium">{note.title}</p>
              <p className="mt-2">{note.body}</p>
            </div>
          ))}
        </section>
      ) : null}
      <h2 className="mt-8 text-2xl font-medium">{m.classFile}</h2>
      <ul className="mt-3 space-y-2">
        {files.map((file) => (
          <li key={file.id}><a className="underline" href={`/api/files/${file.id}`}>{file.name}</a></li>
        ))}
        {files.length === 0 ? <li className="text-sm text-soft">{m.noFiles}</li> : null}
      </ul>
      {staff ? <WeekTools weekId={course.id} files={files} reviews={[]} classScope m={m} /> : null}
      <p className="mt-8"><Link className="underline" href="/term">{m.termNav}</Link></p>
    </article>
  );
}

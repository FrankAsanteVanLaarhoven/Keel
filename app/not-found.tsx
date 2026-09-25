import Link from "next/link";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";

export default async function NotFound() {
  const m = t(await resolveLocale());
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <h1 className="text-4xl font-medium">{m.notFound}</h1>
      <p className="mt-4">{m.notFoundBody}</p>
      <p className="mt-6">
        <Link className="underline" href="/">{m.homeLink}</Link>
      </p>
    </div>
  );
}

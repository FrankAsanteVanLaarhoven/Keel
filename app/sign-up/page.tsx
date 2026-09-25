import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { AuthPanel } from "@/components/account-panel";

export default async function SignUpPage() {
  const locale = await resolveLocale();
  return <AuthPanel mode="up" m={t(locale)} />;
}

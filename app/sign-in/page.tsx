import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { AuthPanel } from "@/components/account-panel";

export default async function SignInPage() {
  const locale = await resolveLocale();
  return <AuthPanel mode="in" m={t(locale)} />;
}

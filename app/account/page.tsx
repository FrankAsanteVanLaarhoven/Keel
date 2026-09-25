import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { AccountPanel } from "@/components/account-panel";

export default async function AccountPage() {
  const locale = await resolveLocale();
  return <AccountPanel m={t(locale)} />;
}

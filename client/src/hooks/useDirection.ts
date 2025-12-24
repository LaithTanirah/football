import { useLocaleStore } from "@/store/localeStore";
import { locales } from "@/lib/i18n/types";

export function useDirection() {
  const { locale } = useLocaleStore();
  const config = locales[locale];

  return {
    dir: config.dir,
    isRTL: config.dir === "rtl",
  };
}

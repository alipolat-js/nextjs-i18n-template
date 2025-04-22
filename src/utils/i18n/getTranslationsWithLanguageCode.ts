import { i18n } from "@/i18n.config";

export async function getTranslationsWithLanguageCode(
  onTranslationsLoad: (translations: Record<string, any>) => object,
  languageCode: string | any,
) : Promise<Record<string, any>>  {
  const module = await import(/* @vite-ignore */ `${i18n.translationsPath}/${languageCode}.json`);

  if(onTranslationsLoad) {
    onTranslationsLoad(module)
  }
  
  return module.default
}
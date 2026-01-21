import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { getOptions, fallbackLng, type Language } from './settings';
import itCommon from './locales/it/common.json';
import itProducts from './locales/it/products.json';
import itServices from './locales/it/services.json';
import itAuth from './locales/it/auth.json';
import itAdmin from './locales/it/admin.json';

const resources = {
  it: {
    common: itCommon,
    products: itProducts,
    services: itServices,
    auth: itAuth,
    admin: itAdmin,
  },
};

async function initI18next(lng: Language, ns: string | string[]) {
  const i18nInstance = createInstance();
  await i18nInstance.use(initReactI18next).init({
    ...getOptions(lng, Array.isArray(ns) ? ns[0] : ns),
    resources,
  });
  return i18nInstance;
}

export async function getTranslation(
  lng: Language = fallbackLng,
  ns: string | string[] = 'common'
) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance,
  };
}

"use client";

import i18next from "i18next";
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next";
import { getOptions, fallbackLng, type Language } from "./settings";
import itCommon from "./locales/it/common.json";
import itProducts from "./locales/it/products.json";
import itServices from "./locales/it/services.json";
import itAuth from "./locales/it/auth.json";
import itAdmin from "./locales/it/admin.json";

const resources = {
  it: {
    common: itCommon,
    products: itProducts,
    services: itServices,
    auth: itAuth,
    admin: itAdmin,
  },
};

i18next.use(initReactI18next).init({
  ...getOptions(),
  resources,
});

export function useTranslation(lng: Language = fallbackLng, ns?: string) {
  const ret = useTranslationOrg(ns);
  if (ret.i18n.language !== lng) {
    ret.i18n.changeLanguage(lng);
  }
  return ret;
}


export const fallbackLng = 'it';
export const languages = [fallbackLng] as const;
export type Language = (typeof languages)[number];
export const defaultNS = 'common';

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}

import { BASE_URL } from "@/lib/constants";

// Business info for structured data
export const businessInfo = {
  name: "Svetla Estetica",
  description: "Centro estetico professionale a Dalmine, Bergamo. Trattamenti viso e corpo, prodotti di qualità, manicure, pedicure, ceretta e molto altro.",
  url: BASE_URL,
  telephone: "+393935026350",
  whatsapp: "+393935026350",
  telephoneAlt: "+390350632279",
  address: {
    streetAddress: "Viale Natale Betelli, 51",
    addressLocality: "Dalmine",
    addressRegion: "BG",
    postalCode: "24044",
    addressCountry: "IT",
  },
  geo: {
    latitude: 45.649876,
    longitude: 9.601234,
  },
  openingHours: [
    "Mo-Fr 09:00-20:00",
    "Sa 09:00-18:00",
  ],
  image: `${BASE_URL}/logo-cropped.webp`,
  priceRange: "€€",
  sameAs: [
    "https://www.facebook.com/SvetlaEsteticaDalmine",
    "https://www.instagram.com/svetlaesteticadalmine/",
  ],
};

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: businessInfo.name,
    description: businessInfo.description,
    url: businessInfo.url,
    telephone: businessInfo.telephone,
    image: businessInfo.image,
    priceRange: businessInfo.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessInfo.address.streetAddress,
      addressLocality: businessInfo.address.addressLocality,
      addressRegion: businessInfo.address.addressRegion,
      postalCode: businessInfo.address.postalCode,
      addressCountry: businessInfo.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: businessInfo.geo.latitude,
      longitude: businessInfo.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: businessInfo.sameAs,
  };
}

export function generateProductSchema(product: {
  uuid: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  category: string;
  brand_name?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} - Prodotto di bellezza professionale`,
    image: product.image_url || `${BASE_URL}/logo-cropped.webp`,
    url: `${BASE_URL}/prodotti/${product.uuid}`,
    ...(product.brand_name && {
      brand: {
        "@type": "Brand",
        name: product.brand_name,
      },
    }),
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: product.price,
      availability: product.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: businessInfo.name,
      },
    },
  };
}

export function generateServiceSchema(service: {
  uuid: string;
  name: string;
  description: string | null;
  price: number;
  duration_min: number;
  image_url: string | null;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description || `${service.name} - Trattamento estetico professionale`,
    image: service.image_url || `${BASE_URL}/logo-cropped.webp`,
    url: `${BASE_URL}/trattamenti/${service.uuid}`,
    provider: {
      "@type": "BeautySalon",
      name: businessInfo.name,
      url: businessInfo.url,
    },
    areaServed: {
      "@type": "City",
      name: "Dalmine",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: service.price,
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateProductListSchema(products: Array<{
  uuid: string;
  name: string;
  price: number;
  image_url: string | null;
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        url: `${BASE_URL}/prodotti/${product.uuid}`,
        image: product.image_url || `${BASE_URL}/logo-cropped.webp`,
        offers: {
          "@type": "Offer",
          priceCurrency: "EUR",
          price: product.price,
        },
      },
    })),
  };
}

export function generateServiceListSchema(services: Array<{
  uuid: string;
  name: string;
  price: number;
  image_url: string | null;
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.name,
        url: `${BASE_URL}/trattamenti/${service.uuid}`,
        image: service.image_url || `${BASE_URL}/logo-cropped.webp`,
        offers: {
          "@type": "Offer",
          priceCurrency: "EUR",
          price: service.price,
        },
      },
    })),
  };
}

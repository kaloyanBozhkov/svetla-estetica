/**
 * Migration script: Old MySQL DB -> New Prisma PostgreSQL DB
 * 
 * Old tables:
 * - products (id, stock, name, description, price, img)
 * - categories (id, name, type) - type is always 'products'
 * - brands (id, name)
 * - connect_categories_products (id, product_id, category_id)
 * - connect_brands_products (id, product_id, brand_id)
 * - offers (id, product_id, price) - special discounted prices
 * 
 * Run: npx tsx scripts/migrate-old-db.ts
 */

import { PrismaClient, product_category } from "@prisma/client";

const db = new PrismaClient();

// Category mapping: old name -> new enum
const categoryMapping: Record<string, product_category> = {
  "VISO": "viso",
  "CORPO": "corpo",
  "SOLARI": "solari",
  "TISANE": "tisane",
  "MAKE UP": "make_up",
  "PROFUMI": "profumi",
  "MANI E PIEDI": "mani_e_piedi",
};

// Old DB data structures
interface OldProduct {
  id: number;
  stock: number;
  name: string;
  description: string | null;
  price: number;
  img: string | null;
}

interface OldCategory {
  id: number;
  name: string;
  type: string;
}

interface OldCategoryProduct {
  id: number;
  product_id: number;
  category_id: number;
}

interface OldOffer {
  id: number;
  product_id: number;
  price: number;
}

// Data from the SQL dump
const oldCategories: OldCategory[] = [
  { id: 3, name: "MANI E PIEDI", type: "products" },
  { id: 4, name: "TISANE", type: "products" },
  { id: 5, name: "MAKE UP", type: "products" },
  { id: 6, name: "CORPO", type: "products" },
  { id: 7, name: "VISO", type: "products" },
  { id: 8, name: "SOLARI", type: "products" },
];

const oldOffers: OldOffer[] = [
  { id: 1, product_id: 133, price: 20 },
  { id: 2, product_id: 134, price: 20 },
  { id: 3, product_id: 107, price: 20 },
  { id: 4, product_id: 102, price: 20 },
  { id: 5, product_id: 230, price: 14 },
];

// Products data extracted from SQL
const oldProducts: OldProduct[] = [
  { id: 15, stock: 5, name: "Crema Mani al Veleno Delle Api", description: "Straordinaria crema a base di cera e veleno d'api. Aiuta a mitigare rossore e screpolature, protegge, ammorbidisce e previene le macchie della pelle.", price: 12, img: "cmavd.jpg" },
  { id: 16, stock: 2, name: "Crema Mani Biostrutturante", description: "La crema mani bioristrutturante mitiga le screpolature e ne previene la formazione ed il peggioramento.", price: 12, img: "cmb.jpg" },
  { id: 244, stock: 15, name: "Lifting Express", description: "Accademia della bellezza è vicina alle esigenze di ogni donna. Lifting express concentrato di principi attivi ad azione stirante e levigante.", price: 3, img: "le.jpg" },
  { id: 13, stock: 0, name: "Segreti D'Oriente - Crema corpo e Bagno crema", description: "Crema corpo e Bagno crema ricchi di principi attivi vegetali per un'azione forte contro gli inestetismi del corpo.", price: 29, img: "sdccebc.jpg" },
  { id: 119, stock: 6, name: "Sapone Liquido Black Carbon Detossinante", description: "L'azione del carbone attivo dalle proprietà purificanti e detossinanti si unisce a quella lenitiva della Camomilla e della Calendula.", price: 15, img: "slbcd.jpg" },
  { id: 120, stock: 10, name: "Acido Jalurnico Puro in Soluzione Concentrata 30ml", description: "Soluzione alla massima concentrazione ottenibile di Acido Jaluronico in acqua.", price: 30, img: "ajpisc.jpg" },
  { id: 9, stock: 8, name: "Crema 24h Pelli Sensibili", description: "Crema viso 24 h ideale nel trattamento delle pelli ipersensibili e con tendenza alla couperose.", price: 22, img: "c2ps.jpg" },
  { id: 10, stock: 0, name: "Dolci Ricordi - Crema Corpo e Bagno crema", description: "Crema corpo e Bagno crema ricchi di principi attivi vegetali per un'azione forte contro gli inestetismi del corpo.", price: 29, img: "drcceb.jpg" },
  { id: 5, stock: 0, name: "Ambra Soave - crema corpo e bagno crema", description: "Crema corpo e Bagno crema ricchi di principi attivi vegetali per un'azione forte contro gli inestetismi del corpo.", price: 29, img: "asccebc.jpg" },
  { id: 6, stock: 5, name: "Body Butter", description: "Burro per il corpo con una ricca composizione di oli naturali e vitamine, che nutre la pelle e la protegge.", price: 30, img: "bb.jpg" },
  { id: 243, stock: 15, name: "Crema Viso Pink Superidratante 50ml", description: "L'innovativa tecnologia Aqua Pink garantisce ad ogni tipo di pelle idratazione istantanea e rigenerazione cellulare.", price: 30, img: "cvpk.jpg" },
  { id: 17, stock: 5, name: "Crema Mani Olio D'Arancio Dolce", description: "E' una crema di bellezza per le mani, ricca di Burro di Karite e Olio d'Arancio Dolce.", price: 14, img: "cmodd.jpg" },
  { id: 18, stock: 3, name: "Crema mani per polvere di perla e olio D'Argan", description: "La crema mani con Polvere di Perla mitiga le screpolature e ne previene la formazione ed il peggioramento.", price: 12, img: "cmpdpeod.jpg" },
  { id: 19, stock: 5, name: "Crema Mani Schiarente al Limone", description: "Freddo, acqua e detersivi, costituiscono delle vere aggressioni per le nostre mani.", price: 12, img: "cmsal.jpg" },
  { id: 118, stock: 10, name: "Maschera Viso TNT Black Carbon Detossinante", description: "Maschera di bellezza in foglio di tessuto non tessuto pre formato, nera, al Carbone Vegetale", price: 5, img: "mvtbcd.jpg" },
  { id: 242, stock: 15, name: "Eye Patches - Bava di Lumaca", description: "Un trattamento innovativo realizzato con la tecnologia Dermo Science Cryo Effect.", price: 22, img: "epbdl.jpg" },
  { id: 116, stock: 10, name: "Maschera Viso Black Carbon Purificante Detossinante 150ml", description: "La mitica maschera nera a 'strappo' finalmente Made in Italy. Rimuove impurità, pellicine e punti neri.", price: 32, img: "mvbcpd.jpg" },
  { id: 23, stock: 5, name: "Crema Piedi Menta e Burro di Karite", description: "Trattamento idratante in crema per il benessere dei piedi.", price: 12, img: "cpnebdk.jpg" },
  { id: 24, stock: 5, name: "Crema Piedi Olio D'Argan e Ratania", description: "Straordinaria emulsione fluida ricca di Olio di Argan di origine biologica e Ratania.", price: 12, img: "cpodaer.jpg" },
  { id: 241, stock: 15, name: "No Age Siero Collagene Extreme 30ml", description: "Ricostituente estremo per il tessuto connettivo. Ideale sia come anti-age che come riparatore del derma.", price: 30, img: "nasce.jpg" },
  { id: 26, stock: 5, name: "BB Cream Chiara", description: "Si tratta di un prodotto straordinario che permette di risolvere in un unico gesto la bellezza quotidiana del viso.", price: 14, img: "bcc.jpg" },
  { id: 27, stock: 5, name: "BB cream Scura", description: "Si tratta di un prodotto straordinario che permette di risolvere in un unico gesto la bellezza quotidiana del viso.", price: 14, img: "bcs.jpg" },
  { id: 141, stock: 5, name: "Crema Rimodellante Sumir", description: "Sfiorare per riattivare i tuoi sensi. Lasciati inebriare dalle fragranze esotiche ed evocative.", price: 25, img: "crsumire.jpeg" },
  { id: 31, stock: 10, name: "Coloriel Fondotinta", description: "Fondotinta fluido adatto a tutti i tipi di pelle, a lunga durata, con una copertura perfetta.", price: 19, img: "cf.jpg" },
  { id: 32, stock: 3, name: "Crema Contorno Occhi Cellule Staminali", description: "Crema antieta che aiuta a distendere la pelle delicata del contorno occhi.", price: 24, img: "ccocs.jpg" },
  { id: 140, stock: 5, name: "Crema Rimodellante Kiku", description: "Sfiorare per riattivare i tuoi sensi. Il nuovo complesso 'Slim-Excess' attiva istantaneamente il processo di lipolisi.", price: 25, img: "kiku.jpeg" },
  { id: 35, stock: 4, name: "Crema viso Polvere di Corallo", description: "Delicatissima, dalla texture morbida e facilmente assorbibile, questa emulsione è ricca di principi attivi.", price: 30, img: "cvpdc.jpg" },
  { id: 36, stock: 3, name: "Crema Viso al Veleno Delle Api", description: "Adatta a tutti i tipi di pelle si applica con un delicato massaggio circolare.", price: 36, img: "cvavd.jpg" },
  { id: 37, stock: 2, name: "Crema Viso anti-Age polvere di Perla", description: "Prodotto straordinario per il viso, adatto a tutti i tipi di pelle.", price: 35, img: "cvapdp.jpg" },
  { id: 38, stock: 3, name: "Crema Viso Antietà 24h Cellule Staminali", description: "Crema viso 24h particolarmente ricca, ideale per contrastare efficacemente l'invecchiamento cutaneo.", price: 27, img: "cva2cs.jpg" },
  { id: 39, stock: 5, name: "Crema Viso Bacche di Goji Tutti i Tipi di Pelle", description: "Straordinaria crema per il viso con estratto glicerico di Bacche di Goji ad effetto anti-age.", price: 27, img: "cvbdgtitdp.jpg" },
  { id: 40, stock: 5, name: "Crema Viso Idratante Pelli Secche", description: "Prezioso prodotto cosmetico a base di acido jaluronico, ideale nel trattamento delle pelli disidratate.", price: 22, img: "cvips.jpg" },
  { id: 41, stock: 3, name: "Crema Illuminante Antistress Pelli Secche", description: "Crema per il viso 24h superidratante e multivitaminica ad azione illuminante.", price: 22, img: "ciaps.jpg" },
  { id: 42, stock: 0, name: "Crema viso Melograno Pelli Mature over 40", description: "Straordinaria crema per il viso con Olio Bio di Melograno, ad azione urto anti-age e antirughe.", price: 33, img: "cvmpmo4.jpg" },
  { id: 43, stock: 5, name: "Crema Viso Mirtillo Rosso Pelli Sensibili", description: "Straordinaria crema per il viso con estratto glicolico di Mirtillo Rosso ad effetto anti-radicali liberi.", price: 27, img: "cvmrps.jpg" },
  { id: 44, stock: 5, name: "Crema Viso Nutriente Pelli secche", description: "Questa crema e stata formulata per le pelli piu delicate, sensibili, secche e screpolate.", price: 22, img: "cvnps.jpg" },
  { id: 45, stock: 5, name: "Crema Viso Protettiva Pelli Sensibili", description: "Prodotto cosmetico dalla particolare formulazione, indicato nel trattamento delle pelli ipersensibili.", price: 22, img: "cvpps.jpg" },
  { id: 74, stock: 44, name: "Tisana Brucia Grassi Silhouette", description: "Straordinaria Tisana ricca di bel 14 erbe, un sapiente e ricercato mix che aiuta a ritrovare una forma perfetta.", price: 8, img: "tbgs.jpg" },
  { id: 75, stock: 49, name: "Tisana Buona Digestione", description: "Un'alimentazione veloce e poco corretta, una vita sedentaria rallentano il transito intestinale.", price: 8, img: "tbd.jpg" },
  { id: 76, stock: 38, name: "Tisana Cellulit Off", description: "Favorisce l'eliminazione dei liquidi in eccesso. Aiuta la regolarita del microcircolo.", price: 8, img: "tco.jpg" },
  { id: 77, stock: 48, name: "Tisana Drenante Sgonifa Pancia", description: "Spesso si puo avere uno spiacevole senso di gonfiore alla pancia e pesantezza alle gambe.", price: 8, img: "tdsp.jpg" },
  { id: 78, stock: 50, name: "Tisana Gambe Belle", description: "Favorisce una pelle luminosa elastica e giovane.", price: 8, img: "tgb.jpg" },
  { id: 79, stock: 46, name: "Tisana Pelle Giovane", description: "Favorisce una pelle luminosa elastica e giovane.", price: 8, img: "tpg.jpg" },
  { id: 80, stock: 50, name: "Tisana Pelle Pura", description: "Un'alimentazione scorretta spesso e' responsabile di una pelle grassa ed impura.", price: 8, img: "tpp.jpg" },
  { id: 81, stock: 50, name: "Tisana Sogni Belli", description: "Il sonno disturbato e' ormai una costante della vita moderna.", price: 8, img: "tsb.jpg" },
  { id: 83, stock: 50, name: "Coloriel Smalti", description: "60 splendidi smalti dai colori classici e di moda rigorosamente Made in Italy.", price: 7, img: "cs.jpg" },
  { id: 208, stock: 10, name: "Solare Protezione Alta 250ml", description: "Straordinario prodotto solare alta protezione.", price: 16, img: "spa250ml.jpg" },
  { id: 103, stock: 10, name: "Doposole Melograno 250ml", description: "Emulsione doposole, lenitiva, rinfrescante e idratante.", price: 16, img: "dm.jpg" },
  { id: 104, stock: 10, name: "Summertime Solare 3 IN 1 250ml", description: "Emulsione multifunzione di ultima generazione.", price: 24, img: "ss3i1.jpg" },
];

// Category-Product mappings from SQL (partial - main categories)
const oldCategoryProducts: OldCategoryProduct[] = [
  // MANI E PIEDI (id: 3)
  { id: 1, product_id: 15, category_id: 3 },
  { id: 2, product_id: 16, category_id: 3 },
  { id: 3, product_id: 17, category_id: 3 },
  { id: 4, product_id: 18, category_id: 3 },
  { id: 5, product_id: 19, category_id: 3 },
  { id: 6, product_id: 23, category_id: 3 },
  { id: 7, product_id: 24, category_id: 3 },
  // TISANE (id: 4)
  { id: 12, product_id: 74, category_id: 4 },
  { id: 13, product_id: 75, category_id: 4 },
  { id: 14, product_id: 76, category_id: 4 },
  { id: 15, product_id: 77, category_id: 4 },
  { id: 16, product_id: 78, category_id: 4 },
  { id: 17, product_id: 79, category_id: 4 },
  { id: 18, product_id: 80, category_id: 4 },
  { id: 19, product_id: 81, category_id: 4 },
  // MAKE UP (id: 5)
  { id: 21, product_id: 83, category_id: 5 },
  { id: 22, product_id: 31, category_id: 5 },
  // CORPO (id: 6)
  { id: 66, product_id: 13, category_id: 6 },
  { id: 67, product_id: 10, category_id: 6 },
  { id: 68, product_id: 5, category_id: 6 },
  { id: 69, product_id: 6, category_id: 6 },
  { id: 70, product_id: 141, category_id: 6 },
  { id: 71, product_id: 140, category_id: 6 },
  // VISO (id: 7)
  { id: 116, product_id: 244, category_id: 7 },
  { id: 117, product_id: 119, category_id: 7 },
  { id: 118, product_id: 120, category_id: 7 },
  { id: 119, product_id: 9, category_id: 7 },
  { id: 120, product_id: 243, category_id: 7 },
  { id: 121, product_id: 118, category_id: 7 },
  { id: 122, product_id: 242, category_id: 7 },
  { id: 123, product_id: 116, category_id: 7 },
  { id: 126, product_id: 241, category_id: 7 },
  { id: 127, product_id: 26, category_id: 7 },
  { id: 128, product_id: 27, category_id: 7 },
  { id: 129, product_id: 32, category_id: 7 },
  { id: 130, product_id: 35, category_id: 7 },
  { id: 131, product_id: 36, category_id: 7 },
  { id: 132, product_id: 37, category_id: 7 },
  { id: 133, product_id: 38, category_id: 7 },
  { id: 134, product_id: 39, category_id: 7 },
  { id: 135, product_id: 40, category_id: 7 },
  { id: 136, product_id: 41, category_id: 7 },
  { id: 137, product_id: 42, category_id: 7 },
  { id: 138, product_id: 43, category_id: 7 },
  { id: 139, product_id: 44, category_id: 7 },
  { id: 140, product_id: 45, category_id: 7 },
  // SOLARI (id: 8)
  { id: 201, product_id: 208, category_id: 8 },
  { id: 202, product_id: 103, category_id: 8 },
  { id: 203, product_id: 104, category_id: 8 },
];

// Build category map
const productCategoryMap = new Map<number, number>();
oldCategoryProducts.forEach((cp) => {
  productCategoryMap.set(cp.product_id, cp.category_id);
});

// Build offer map
const offerMap = new Map<number, number>();
oldOffers.forEach((o) => {
  offerMap.set(o.product_id, o.price);
});

// Get category enum from old category id
function getCategoryEnum(categoryId: number): product_category {
  const category = oldCategories.find((c) => c.id === categoryId);
  if (!category) return "viso"; // default
  return categoryMapping[category.name] || "viso";
}

// Clean HTML from description
function cleanDescription(desc: string | null): string | null {
  if (!desc) return null;
  return desc
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Convert price from euros to cents
function priceToCents(price: number): number {
  return Math.round(price * 100);
}

// Generate image URL from product name (first letter of each word)
function generateImageUrl(name: string): string {
  const initials = name
    .split(/\s+/)
    .map((word) => word.charAt(0).toLowerCase())
    .join("");
  return `https://svetlaestetica.com/img/prodotti/${initials}.jpg`;
}

async function migrate() {
  console.log("Starting migration...\n");

  let created = 0;
  let skipped = 0;

  for (const oldProduct of oldProducts) {
    const categoryId = productCategoryMap.get(oldProduct.id);
    const category = categoryId ? getCategoryEnum(categoryId) : "viso";
    
    // Check for special offer price
    const offerPrice = offerMap.get(oldProduct.id);
    const finalPrice = offerPrice ?? oldProduct.price;

    try {
      await db.product.create({
        data: {
          name: oldProduct.name,
          description: cleanDescription(oldProduct.description),
          price: priceToCents(finalPrice),
          stock: oldProduct.stock,
          category,
          image_url: generateImageUrl(oldProduct.name),
          active: oldProduct.stock > 0,
        },
      });
      created++;
      console.log(`✓ Created: ${oldProduct.name}`);
    } catch (error) {
      skipped++;
      console.log(`✗ Skipped: ${oldProduct.name} - ${error}`);
    }
  }

  console.log(`\n=== Migration Complete ===`);
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
}

migrate()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });


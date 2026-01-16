/**
 * Seed script: Create default services/treatments
 *
 * Run: npx tsx scripts/seed-services.ts
 */

import { PrismaClient, service_category } from "@prisma/client";
import { oldTreatments } from "./old-parsed/TREATMENTS";
import { oldProducts } from "./old-parsed/PRODUCTS";

const db = new PrismaClient();

// Generate image URL from service name (first letter of each word)
function generateImageUrl(name: string, imageType: "trattamenti" | "prodotti"): string {
  const initials = name
    .split(/\s+/)
    .map((word) => word.charAt(0).toLowerCase())
    .join("");
  return `https://svetla-estetica.s3.eu-west-1.amazonaws.com/images/${imageType}/${initials}.jpg`;
}

async function seed() {
  console.log("Seeding services & products...\n");

  let createdServices = 0;
  let createdProducts = 0;

  db.service.deleteMany();
  db.product.deleteMany();
  db.brand.deleteMany();

  for (const service of oldTreatments) {
    try {
      await db.service.create({
        data: {
          name: service.name,
          description: service.description,
          price: service.price,
          duration_min: 0,
          category: service.category,
          image_url: generateImageUrl(service.name, "trattamenti"),
          active: true,
        },
      });
      createdServices++;
      console.log(`✓ Created service: ${service.name}`);
    } catch (error) {
      console.log(`✗ Failed: ${service.name} - ${error}`);
    }
  }

  const BRANDS = ["Accademia della Bellezza", "Rosa Bulgara", "-"];
  for (const brand of BRANDS) {
    try {
      await db.brand.create({
        data: {
          name: brand,
        },
      });
    } catch (error) {
      console.log(`✗ Failed: ${brand} - ${error}`);
    }
  }

  const brands = await db.brand.findMany();
  const fallbackBrand = brands.find((b) => b.name === "-");

  for (const product of oldProducts) {
    try {
      const productBrand = brands.find(
        (b) =>
          b.name.toLowerCase().trim().replaceAll(" ", "") ===
          product.brand?.toLowerCase().trim().replaceAll(" ", "")
      );
      if (!productBrand) {
        console.info("no brnad for product", product.name);
      }
      await db.product.create({
        data: {
          image_url: generateImageUrl(product.name, "prodotti"),
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
          brand_id: productBrand?.id ?? fallbackBrand!.id,
          active: true,
        },
      });
      createdProducts++;
      console.log(`✓ Created product: ${product.name}`);
    } catch (error) {
      console.log(`✗ Failed: ${product.name} - ${error}`);
    }
  }

  console.log(`\n=== Seeding Complete ===`);
  console.log(`Created: ${createdServices} services`);
  console.log(`Created: ${createdProducts} products`);
}

seed()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

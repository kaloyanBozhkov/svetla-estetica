/**
 * Seed script: Create default services/treatments
 *
 * Run: npx tsx scripts/seed-services.ts
 */
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { oldTreatments } from "./old-parsed/TREATMENTS";
import { oldProducts } from "./old-parsed/PRODUCTS";
import { images } from "./old-parsed/images";
import path from "path";

const db = new PrismaClient();

const HIGHLIGHTED_SERVICES = [
  {
    name: "Pulizia della pelle",
    priority: 10,
  },
];

const HIGHLIGHTED_PRODUCTS = [
  { name: "Tisana Cellulit Off", priority: 10 },
  {
    name: "Perlage Crema Viso Anti-Age",
    priority: 9,
  },
  {
    name: "Gold Filler 24 Kt",
    priority: 8,
  },
  {
    name: "No Age Siero Collagene Extreme",
    priority: 7,
  },
  {
    name: "Crema Mani al Veleno Delle Api",
    priority: 6,
  },
];

// Generate image URL from service name (first letter of each word)
function generateImageUrl(name: string): string {
  const found = images.find(
    (i) =>
      i.name
        .toLowerCase()
        .replaceAll(" ", "")
        .replaceAll("`", "'")
        .replaceAll("-", "")
        .replaceAll(",", "")
        .replaceAll("'", "") ===
      name
        .toLowerCase()
        .replaceAll(" ", "")
        .replaceAll("`", "'")
        .replaceAll("-", "")
        .replaceAll(",", "")
        .replaceAll("'", "")
  );
  if (!found) {
    return "";
  }
  return found.img ?? "";
}

async function seed() {
  console.log("Seeding services & products...\n");

  let createdServices = 0;
  let createdProducts = 0;

  await db.order.deleteMany();
  await db.order_item.deleteMany();
  await db.booking.deleteMany();
  await db.service.deleteMany();
  await db.product.deleteMany();
  await db.brand.deleteMany();

  let withoutImageServices = [];
  let withoutImageProducts = [];

  for (const service of oldTreatments) {
    const imgUrl = generateImageUrl(service.name);
    if (!imgUrl) {
      console.info("no image found for service", service.name);
      withoutImageServices.push(service);
    }
    try {
      await db.service.create({
        data: {
          name: service.name,
          description: service.description,
          price: service.price * 100,
          duration_min: 0,
          category: service.category,
          image_url: imgUrl,
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
      const imgUrl = generateImageUrl(product.name);

      if (!imgUrl) {
        console.info("no image found for product", product.name);
        withoutImageProducts.push(product);
      }
      await db.product.create({
        data: {
          image_url: imgUrl,
          name: product.name,
          description: product.description,
          price: product.price * 100,
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
  if (withoutImageServices.length > 0) {
    console.log(`✗ Without image services: ${withoutImageServices.length}`);
    fs.writeFileSync(
      path.join(__dirname, "scripts", "withoutImageServices.json"),
      JSON.stringify(withoutImageServices, null, 2)
    );
  }
  if (withoutImageProducts.length > 0) {
    console.log(`✗ Without image products: ${withoutImageProducts.length}`);
    fs.writeFileSync(
      path.join(__dirname, "scripts", "withoutImageProducts.json"),
      JSON.stringify(withoutImageProducts, null, 2)
    );
  }

  for (const service of HIGHLIGHTED_SERVICES) {
    await db.service.updateMany({
      where: {
        name: {
          contains: service.name,
        },
      },
      data: {
        priority: service.priority,
      },
    });
  }

  for (const product of HIGHLIGHTED_PRODUCTS) {
    await db.product.updateMany({
      where: {
        name: {
          contains: product.name,
        },
      },
      data: {
        priority: product.priority,
      },
    });
  }
}

seed()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

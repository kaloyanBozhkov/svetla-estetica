import { db } from "../src/lib/db";
import { writeFileSync, existsSync } from "fs";
import { join } from "path";
import { getLLMResponse } from "@koko420/ai-tools";
import { retry } from "@koko420/shared";
import { z } from "zod";

const PRODUCTS_BACKUP_FILE = ".backup-products.json";
const SERVICES_BACKUP_FILE = ".backup-services.json";

interface BackupEntry {
  id: number;
  uuid: string;
  backedUpAt: string;
  original: {
    title: string;
    description: string | null;
  };
  formatted: {
    title: string;
    description: string;
  };
}

const PRODUCT_FORMAT_SYSTEM_MESSAGE = `You are a text formatter for an Italian cosmetics e-commerce. Your task is ONLY to format text, NOT to change its meaning or content.

Rules:
1. Fix obvious grammar/spelling mistakes in Italian
2. For TITLE:
   - Format the title letters' casings to be "product name/title"-esque 
   - Format dosages/amounts correctly: "30ml." (no space between number and unit, with abbreviation dot)
   - Examples: "30 ml" → "30ml.", "100ML" → "100ml.", "50ml" → "50ml."
   - Do NOT change the product name itself
3. For DESCRIPTION:
   - Add HTML tags to make it readable and visually appealing, where sensible.
   - Use <br/> for paragraph breaks
   - Use <strong> for emphasis on key benefits or product names
   - Use <em> for subtle emphasis
   - Use <ul><li>...</li></ul> for lists if applicable
   - Keep the exact same content and meaning
   - Do NOT add new information

Return ONLY JSON in this exact shape:
{ "result": { "title": "...", "description": "..." } }

Language: Italian`;

const SERVICE_FORMAT_SYSTEM_MESSAGE = `You are a text formatter for an Italian aesthetics center website. Your task is ONLY to format text, NOT to change its meaning or content.

Rules:
1. Fix obvious grammar/spelling mistakes in Italian
2. For TITLE:
   - Format the title letters' casings to be elegant and professional
   - Do NOT change the treatment name itself
3. For DESCRIPTION:
   - Add HTML tags to make it readable and visually appealing, where sensible.
   - Use <br/> for paragraph breaks
   - Use <strong> for emphasis on key benefits or treatment names
   - Use <em> for subtle emphasis
   - Use <ul><li>...</li></ul> for lists if applicable
   - Keep the exact same content and meaning
   - Do NOT add new information

Return ONLY JSON in this exact shape:
{ "result": { "title": "...", "description": "..." } }

Language: Italian`;

const resultSchema = z.object({
  result: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

async function formatProductTitle(title: string, description: string | null) {
  const userMessage = `Title: ${title}
Description: ${description || "No description"}`;

  const response = await retry(
    () =>
      getLLMResponse({
        userMessage,
        systemMessage: PRODUCT_FORMAT_SYSTEM_MESSAGE,
        schema: resultSchema,
      }),
    3
  );

  return {
    title: response.result.title,
    description: response.result.description,
  };
}

async function formatServiceTitle(title: string, description: string | null) {
  const userMessage = `Title: ${title}
Description: ${description || "No description"}`;

  const response = await retry(
    () =>
      getLLMResponse({
        userMessage,
        systemMessage: SERVICE_FORMAT_SYSTEM_MESSAGE,
        schema: resultSchema,
      }),
    3
  );

  return {
    title: response.result.title,
    description: response.result.description,
  };
}

async function formatProducts() {
  console.log("📦 Fetching all products...");
  const products = await db.product.findMany({
    select: {
      id: true,
      uuid: true,
      name: true,
      description: true,
    },
  });

  console.log(`Found ${products.length} products to format\n`);

  const backup: Record<number, BackupEntry> = {};

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i + 1}/${products.length}] Formatting: ${product.name}`);

    try {
      const formatted = await formatProductTitle(product.name, product.description);

      // Store backup entry
      backup[product.id] = {
        id: product.id,
        uuid: product.uuid,
        backedUpAt: new Date().toISOString(),
        original: {
          title: product.name,
          description: product.description,
        },
        formatted: {
          title: formatted.title,
          description: formatted.description,
        },
      };

      // Update database
      await db.product.update({
        where: { id: product.id },
        data: {
          name: formatted.title,
          description: formatted.description,
        },
      });

      console.log(`✅ Updated: ${formatted.title}\n`);

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to format product ${product.id}:`, error);
      console.log("Continuing with next product...\n");
    }
  }

  // Save backup
  const backupPath = join(process.cwd(), PRODUCTS_BACKUP_FILE);
  writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  console.log(`\n💾 Backup saved to ${backupPath}`);

  return backup;
}

async function formatServices() {
  console.log("💆 Fetching all services...");
  const services = await db.service.findMany({
    select: {
      id: true,
      uuid: true,
      name: true,
      description: true,
    },
  });

  console.log(`Found ${services.length} services to format\n`);

  const backup: Record<number, BackupEntry> = {};

  for (let i = 0; i < services.length; i++) {
    const service = services[i];
    console.log(`[${i + 1}/${services.length}] Formatting: ${service.name}`);

    try {
      const formatted = await formatServiceTitle(service.name, service.description);

      // Store backup entry
      backup[service.id] = {
        id: service.id,
        uuid: service.uuid,
        backedUpAt: new Date().toISOString(),
        original: {
          title: service.name,
          description: service.description,
        },
        formatted: {
          title: formatted.title,
          description: formatted.description,
        },
      };

      // Update database
      await db.service.update({
        where: { id: service.id },
        data: {
          name: formatted.title,
          description: formatted.description,
        },
      });

      console.log(`✅ Updated: ${formatted.title}\n`);

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to format service ${service.id}:`, error);
      console.log("Continuing with next service...\n");
    }
  }

  // Save backup
  const backupPath = join(process.cwd(), SERVICES_BACKUP_FILE);
  writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  console.log(`\n💾 Backup saved to ${backupPath}`);

  return backup;
}

async function main() {
  console.log("🚀 Starting AI formatting script...\n");

  // Check if backups already exist
  const productsBackupExists = existsSync(join(process.cwd(), PRODUCTS_BACKUP_FILE));
  const servicesBackupExists = existsSync(join(process.cwd(), SERVICES_BACKUP_FILE));

  if (productsBackupExists || servicesBackupExists) {
    console.log("⚠️  Warning: Backup files already exist!");
    console.log("Please review and remove them before running this script again.");
    console.log("This prevents accidentally overwriting existing backups.\n");
    process.exit(1);
  }

  try {
    console.log("=== Formatting Products ===\n");
    await formatProducts();

    console.log("\n=== Formatting Services ===\n");
    await formatServices();

    console.log("\n✅ All done!");
    console.log("📝 Review the changes in your database");
    console.log("🔄 To rollback, use the backup files to restore original values");
  } catch (error) {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();


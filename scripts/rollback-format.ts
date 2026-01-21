import { db } from '../src/lib/db';
import { readFileSync } from 'fs';
import { join } from 'path';

const PRODUCTS_BACKUP_FILE = '.backup-products.json';
const SERVICES_BACKUP_FILE = '.backup-services.json';

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

async function rollbackProducts() {
  console.log('📦 Rolling back products...');

  const backupPath = join(process.cwd(), PRODUCTS_BACKUP_FILE);
  const backup: Record<number, BackupEntry> = JSON.parse(readFileSync(backupPath, 'utf-8'));

  const entries = Object.values(backup);
  console.log(`Found ${entries.length} products to restore\n`);

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    console.log(`[${i + 1}/${entries.length}] Restoring: ${entry.original.title}`);

    try {
      await db.product.update({
        where: { id: entry.id },
        data: {
          name: entry.original.title,
          description: entry.original.description,
        },
      });

      console.log(`✅ Restored\n`);
    } catch (error) {
      console.error(`❌ Failed to restore product ${entry.id}:`, error);
    }
  }
}

async function rollbackServices() {
  console.log('💆 Rolling back services...');

  const backupPath = join(process.cwd(), SERVICES_BACKUP_FILE);
  const backup: Record<number, BackupEntry> = JSON.parse(readFileSync(backupPath, 'utf-8'));

  const entries = Object.values(backup);
  console.log(`Found ${entries.length} services to restore\n`);

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    console.log(`[${i + 1}/${entries.length}] Restoring: ${entry.original.title}`);

    try {
      await db.service.update({
        where: { id: entry.id },
        data: {
          name: entry.original.title,
          description: entry.original.description,
        },
      });

      console.log(`✅ Restored\n`);
    } catch (error) {
      console.error(`❌ Failed to restore service ${entry.id}:`, error);
    }
  }
}

async function main() {
  console.log('🔄 Starting rollback script...\n');

  try {
    console.log('=== Rolling Back Products ===\n');
    await rollbackProducts();

    console.log('\n=== Rolling Back Services ===\n');
    await rollbackServices();

    console.log('\n✅ Rollback complete!');
    console.log('📝 All titles and descriptions restored to original values');
  } catch (error) {
    console.error('\n❌ Rollback failed:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();

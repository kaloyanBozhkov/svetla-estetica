/**
 * Seed script: Create default services/treatments
 * 
 * Run: npx tsx scripts/seed-services.ts
 */

import { PrismaClient, service_category } from "@prisma/client";

const db = new PrismaClient();

// Generate image URL from service name (first letter of each word)
function generateImageUrl(name: string): string {
  const initials = name
    .split(/\s+/)
    .map((word) => word.charAt(0).toLowerCase())
    .join("");
  return `https://svetlaestetica.com/img/trattamenti/${initials}.jpg`;
}

interface ServiceSeed {
  name: string;
  description: string;
  price: number; // in cents
  duration_min: number;
  category: service_category;
}

const services: ServiceSeed[] = [
  // VISO
  { name: "Pulizia Viso Base", description: "Pulizia viso completa con estrazione comedoni.", price: 4500, duration_min: 60, category: "viso" },
  { name: "Pulizia Viso Profonda", description: "Pulizia viso approfondita con trattamento specifico.", price: 6000, duration_min: 75, category: "viso" },
  { name: "Trattamento Anti-Age", description: "Trattamento ringiovanente con acido ialuronico.", price: 7500, duration_min: 60, category: "viso" },
  { name: "Trattamento Idratante", description: "Maschera idratante per pelli secche.", price: 5000, duration_min: 45, category: "viso" },
  
  // CORPO
  { name: "Massaggio Rilassante", description: "Massaggio rilassante total body.", price: 6000, duration_min: 60, category: "corpo" },
  { name: "Massaggio Anticellulite", description: "Trattamento specifico per cellulite.", price: 5500, duration_min: 45, category: "corpo" },
  { name: "Trattamento Snellente", description: "Trattamento rimodellante corpo.", price: 7000, duration_min: 60, category: "corpo" },
  
  // MAKE UP
  { name: "Trucco Giorno", description: "Make up naturale per ogni occasione.", price: 3500, duration_min: 30, category: "make_up" },
  { name: "Trucco Sera/Evento", description: "Make up elegante per serate speciali.", price: 5000, duration_min: 45, category: "make_up" },
  { name: "Trucco Sposa", description: "Make up completo per il giorno più bello.", price: 8000, duration_min: 60, category: "make_up" },
  
  // CERETTA
  { name: "Ceretta Gambe Intere", description: "Epilazione gambe complete.", price: 3000, duration_min: 45, category: "ceretta" },
  { name: "Ceretta Mezza Gamba", description: "Epilazione mezza gamba.", price: 1800, duration_min: 25, category: "ceretta" },
  { name: "Ceretta Inguine", description: "Epilazione zona inguinale.", price: 1500, duration_min: 20, category: "ceretta" },
  { name: "Ceretta Braccia", description: "Epilazione braccia complete.", price: 1500, duration_min: 20, category: "ceretta" },
  { name: "Ceretta Ascelle", description: "Epilazione ascelle.", price: 1000, duration_min: 15, category: "ceretta" },
  { name: "Ceretta Baffetti", description: "Epilazione labbro superiore.", price: 800, duration_min: 10, category: "ceretta" },
  
  // SOLARIUM
  { name: "Solarium 10 minuti", description: "Sessione solarium base.", price: 800, duration_min: 10, category: "solarium" },
  { name: "Solarium 15 minuti", description: "Sessione solarium media.", price: 1200, duration_min: 15, category: "solarium" },
  { name: "Solarium 20 minuti", description: "Sessione solarium completa.", price: 1500, duration_min: 20, category: "solarium" },
  
  // PEDICURE
  { name: "Pedicure Estetico", description: "Pedicure curativo ed estetico.", price: 3500, duration_min: 45, category: "pedicure" },
  { name: "Pedicure con Smalto", description: "Pedicure completo con applicazione smalto.", price: 4000, duration_min: 60, category: "pedicure" },
  { name: "Pedicure Spa", description: "Trattamento pedicure con scrub e maschera.", price: 5000, duration_min: 75, category: "pedicure" },
  
  // MANICURE
  { name: "Manicure Classica", description: "Manicure tradizionale con smalto.", price: 2000, duration_min: 30, category: "manicure" },
  { name: "Manicure Semipermanente", description: "Manicure con smalto semipermanente.", price: 3500, duration_min: 45, category: "manicure" },
  { name: "Ricostruzione Unghie", description: "Ricostruzione unghie in gel.", price: 5000, duration_min: 90, category: "manicure" },
  
  // LUCE PULSATA
  { name: "Luce Pulsata Baffetti", description: "Epilazione definitiva labbro superiore.", price: 3000, duration_min: 15, category: "luce_pulsata" },
  { name: "Luce Pulsata Ascelle", description: "Epilazione definitiva ascelle.", price: 5000, duration_min: 20, category: "luce_pulsata" },
  { name: "Luce Pulsata Inguine", description: "Epilazione definitiva zona bikini.", price: 7000, duration_min: 30, category: "luce_pulsata" },
  { name: "Luce Pulsata Gambe", description: "Epilazione definitiva gambe.", price: 15000, duration_min: 60, category: "luce_pulsata" },
  
  // GROTTA DI SALE
  { name: "Grotta di Sale 30 min", description: "Sessione haloterapia rilassante.", price: 2000, duration_min: 30, category: "grotta_di_sale" },
  { name: "Grotta di Sale 45 min", description: "Sessione haloterapia completa.", price: 2500, duration_min: 45, category: "grotta_di_sale" },
  
  // APPUNTAMENTO
  { name: "Consulenza Gratuita", description: "Consulenza personalizzata sui trattamenti.", price: 0, duration_min: 30, category: "appuntamento" },
];

async function seed() {
  console.log("Seeding services...\n");

  let created = 0;

  db.service.deleteMany();
  db.product.deleteMany();

  for (const service of services) {
    try {
      await db.service.create({
        data: {
          name: service.name,
          description: service.description,
          price: service.price,
          duration_min: service.duration_min,
          category: service.category,
          image_url: generateImageUrl(service.name),
          active: true,
        },
      });
      created++;
      console.log(`✓ Created: ${service.name}`);
    } catch (error) {
      console.log(`✗ Failed: ${service.name} - ${error}`);
    }
  }

  console.log(`\n=== Seeding Complete ===`);
  console.log(`Created: ${created} services`);
}

seed()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });


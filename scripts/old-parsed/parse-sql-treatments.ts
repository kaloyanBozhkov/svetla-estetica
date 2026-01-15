import fs from "fs";
import path from "path";
/**
 * Parses SQL INSERT statements for treatments (trattamenti) and extracts all columns
 *
 * Columns: id_trattamento, nome_trattamento_it, nome_trattamento_en,
 *          descrizione_trattamento_it, descrizione_trattamento_en,
 *          prezzo_trattamento, img_trattamento, categoria_trattamento
 *
 * Usage:
 * 1. Paste your SQL into the `sqlInput` variable below
 * 2. Run: npx tsx scripts/parse-sql-treatments.ts
 * 3. Copy the output to update seed-services.ts
 */

// Paste your SQL INSERT statement here
const sqlInput = fs.readFileSync(
  path.join(__dirname, "../ALL_TREATMENTS.txt"),
  "utf8"
);

interface ParsedTreatment {
  id: number;
  name_it: string;
  name_en: string;
  description_it: string | null;
  description_en: string | null;
  price: number;
  img: string | null;
  category: string;
}

function parseSqlInsert(sql: string): ParsedTreatment[] {
  const treatments: ParsedTreatment[] = [];

  // Remove the INSERT INTO header
  let content = sql.replace(/INSERT INTO.*?VALUES\s*/is, "").trim();

  // Remove trailing semicolon
  content = content.replace(/;\s*$/, "");

  // Split by rows - each row starts with ( and ends with )
  const rows: string[] = [];
  let currentRow = "";
  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (escapeNext) {
      currentRow += char;
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      currentRow += char;
      escapeNext = true;
      continue;
    }

    if (char === "'" && !escapeNext) {
      inString = !inString;
      currentRow += char;
      continue;
    }

    if (!inString) {
      if (char === "(") {
        if (depth === 0) {
          currentRow = "";
        } else {
          currentRow += char;
        }
        depth++;
        continue;
      }

      if (char === ")") {
        depth--;
        if (depth === 0) {
          rows.push(currentRow.trim());
          currentRow = "";
        } else {
          currentRow += char;
        }
        continue;
      }
    }

    if (depth > 0) {
      currentRow += char;
    }
  }

  // Parse each row
  for (const row of rows) {
    const parsed = parseRow(row);
    if (parsed) {
      treatments.push(parsed);
    }
  }

  return treatments;
}

function parseRow(row: string): ParsedTreatment | null {
  const values: (string | number | null)[] = [];
  let current = "";
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (escapeNext) {
      // Handle escaped characters
      if (char === "r") {
        current += "\r";
      } else if (char === "n") {
        current += "\n";
      } else if (char === "'") {
        current += "'";
      } else if (char === "\\") {
        current += "\\";
      } else {
        current += char;
      }
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    if (char === "'" && !escapeNext) {
      if (!inString) {
        inString = true;
        current = "";
      } else {
        inString = false;
        // Don't add yet, wait for comma
      }
      continue;
    }

    if (char === "," && !inString) {
      // End of value
      const trimmed = current.trim();
      if (trimmed === "NULL" || trimmed === "") {
        values.push(null);
      } else if (!isNaN(Number(trimmed)) && trimmed !== "") {
        values.push(Number(trimmed));
      } else {
        values.push(trimmed);
      }
      current = "";
      continue;
    }

    current += char;
  }

  // Don't forget the last value
  const trimmed = current.trim();
  if (trimmed === "NULL" || trimmed === "") {
    values.push(null);
  } else if (!isNaN(Number(trimmed)) && trimmed !== "") {
    values.push(Number(trimmed));
  } else {
    values.push(trimmed);
  }

  if (values.length < 8) {
    console.error("Invalid row, not enough values:", row.substring(0, 50));
    return null;
  }

  return {
    id: values[0] as number,
    name_it: values[1] as string,
    name_en: values[2] as string,
    description_it: values[3] as string | null,
    description_en: values[4] as string | null,
    price: values[5] as number,
    img: values[6] as string | null,
    category: values[7] as string,
  };
}

function escapeString(str: string | null): string {
  if (str === null) return "null";
  return `\`${str
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "")}\``;
}

function generateTypeScriptArray(treatments: ParsedTreatment[]): string {
  const lines = treatments.map((t) => {
    return `  {
    name: ${escapeString(t.name_it)},
    description: ${escapeString(t.description_it)},
    price: ${t.price},
    img: ${escapeString(t.img)},
    category: service_category.${t.category.toLowerCase().split(' ').join('_')},
  },`;
  });

  return `const oldTreatments = [\n${lines.join("\n")}\n];`;
}

// Run the parser
const treatments = parseSqlInsert(sqlInput);

console.log("=== Parsed Treatments ===\n");
console.log(`Found ${treatments.length} treatments\n`);

fs.writeFileSync("TREATMENTS.ts", generateTypeScriptArray(treatments));
// Output interface
console.log("=== TypeScript Interface ===\n");

// Output as TypeScript
console.log("\n\n=== TypeScript Array (copy to seed-services.ts) ===\n");
console.log();

// Summary by category
console.log("\n\n=== Summary by Category ===\n");
const byCategory = new Map<string, number>();
treatments.forEach((t) => {
  byCategory.set(t.category, (byCategory.get(t.category) || 0) + 1);
});
byCategory.forEach((count, cat) => {
  console.log(`${cat}: ${count} treatments`);
});

// List all treatments
console.log("\n\n=== All Treatments ===\n");
treatments.forEach((t) => {
  console.log(`[${t.id}] ${t.name_it} (${t.category}) - €${t.price}`);
});

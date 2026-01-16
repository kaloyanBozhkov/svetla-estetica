import fs from "fs";
import path from "path";
import { images } from "./images";

/**
 * Parses SQL INSERT statements for products and extracts all columns
 *
 * Columns: id_prodotto, disponibilita, titolo_prodotto_it, titolo_prodotto_en,
 *          descrizione_prodotto_it, descrizione_prodotto_en, prezzo_prodotto,
 *          img_prodotto, categoria_prodotto, marchio
 *
 * Usage:
 * 1. Paste your SQL into ALL_PRODUCTS.txt
 * 2. Run: npx tsx scripts/parse-sql-products.ts
 * 3. Copy the output to update migrate-old-db.ts
 */

const sqlInput = fs.readFileSync(
  path.join(__dirname, "../ALL_PRODUCTS.txt"),
  "utf8"
);

interface ParsedProduct {
  id: number;
  stock: number;
  name_it: string;
  name_en: string;
  description_it: string | null;
  description_en: string | null;
  price: number;
  img: string | null;
  category: string;
  brand: string;
}

function parseSqlInsert(sql: string): ParsedProduct[] {
  const products: ParsedProduct[] = [];

  // Remove the INSERT INTO header
  let content = sql.replace(/INSERT INTO[\s\S]*?VALUES\s*/i, "").trim();

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
      products.push(parsed);
    }
  }

  return products;
}

function parseRow(row: string): ParsedProduct | null {
  const values: (string | number | null)[] = [];
  let current = "";
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (escapeNext) {
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
      }
      continue;
    }

    if (char === "," && !inString) {
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

  // Last value
  const trimmed = current.trim();
  if (trimmed === "NULL" || trimmed === "") {
    values.push(null);
  } else if (!isNaN(Number(trimmed)) && trimmed !== "") {
    values.push(Number(trimmed));
  } else {
    values.push(trimmed);
  }

  // Need 10 columns:
  // 0: id_prodotto, 1: disponibilita, 2: titolo_prodotto_it, 3: titolo_prodotto_en,
  // 4: descrizione_prodotto_it, 5: descrizione_prodotto_en, 6: prezzo_prodotto,
  // 7: img_prodotto, 8: categoria_prodotto, 9: marchio
  if (values.length < 10) {
    console.error(
      `Invalid row, expected 10 values but got ${values.length}:`,
      row.substring(0, 80)
    );
    return null;
  }

  return {
    id: values[0] as number,
    stock: values[1] as number,
    name_it: values[2] as string,
    name_en: values[3] as string,
    description_it: values[4] as string | null,
    description_en: values[5] as string | null,
    price: values[6] as number,
    img: values[7] as string | null,
    category: values[8] as string,
    brand: values[9] as string,
  };
}

function escapeForTs(value: string | number | null): string {
  if (value === null || value === undefined) return "null";
  const str = String(value);
  return `\`${str
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "")}\``;
}

function generateImageUrl(name: string): string {
  const found = images.find((i) => i.name === name);
  if (!found) {
    console.log("no image found for", name);
  }
  return found?.img ?? "";
}

function generateTypeScriptArray(products: ParsedProduct[]): string {
  const lines = products.map((p) => {
    return `  {
    stock: ${p.stock},
    name: ${escapeForTs(p.name_it)},
    description: ${escapeForTs(p.description_it)},
    price: ${p.price},
    img: ${escapeForTs(generateImageUrl(p.name_it))},
    category: product_category.${p.category.toLowerCase().split(" ").join("_")},
    brand: ${escapeForTs(p.brand)},
  },`;
  });

  return `const oldProducts = [\n${lines.join("\n")}\n];`;
}

(() => {
  const products = parseSqlInsert(sqlInput);

  console.log("=== Parsed Products ===\n");
  console.log(`Found ${products.length} products\n`);

  // Output interface
  // Output array
  console.log("\n\n=== TypeScript Array ===\n");
  const tsOutput = generateTypeScriptArray(products);
  console.log(tsOutput);

  // Write to file
  fs.writeFileSync("PRODUCTS_PARSED.ts", tsOutput);
  console.log("\n\nWritten to PRODUCTS_PARSED.ts");

  // Summary by category
  console.log("\n\n=== Summary by Category ===\n");
  const byCategory = new Map<string, number>();
  products.forEach((p) => {
    byCategory.set(p.category, (byCategory.get(p.category) || 0) + 1);
  });
  byCategory.forEach((count, cat) => {
    console.log(`${cat}: ${count} products`);
  });
})();

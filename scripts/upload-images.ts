import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

const BUCKET_NAME = "svetla-estetica";
const REGION = "eu-west-1";

// Load env vars
import "dotenv/config";

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

type ImageType = "prodotti" | "trattamenti";

interface UploadResult {
  success: string[];
  failed: { path: string; error: string }[];
}

const MAX_SIZE_KB = 150;
const MAX_SIZE_BYTES = MAX_SIZE_KB * 1024;

async function convertToWebp(inputPath: string): Promise<Buffer> {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  // Start with high quality
  let quality = 85;
  let buffer = await image.webp({ quality }).toBuffer();

  // If under limit, return as is
  if (buffer.length <= MAX_SIZE_BYTES) {
    return buffer;
  }

  // Try reducing quality first (down to 60)
  while (buffer.length > MAX_SIZE_BYTES && quality > 60) {
    quality -= 5;
    buffer = await sharp(inputPath).webp({ quality }).toBuffer();
  }

  if (buffer.length <= MAX_SIZE_BYTES) {
    return buffer;
  }

  // If still too large, resize while maintaining aspect ratio
  const maxDimension = 1200;
  let width = metadata.width || maxDimension;
  let height = metadata.height || maxDimension;

  while (buffer.length > MAX_SIZE_BYTES && (width > 400 || height > 400)) {
    // Reduce dimensions by 20%
    width = Math.round(width * 0.8);
    height = Math.round(height * 0.8);

    buffer = await sharp(inputPath)
      .resize(width, height, { fit: "inside", withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();
  }

  return buffer;
}

async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
}

async function processImages(
  folder: string,
  imageType: ImageType
): Promise<UploadResult> {
  const result: UploadResult = { success: [], failed: [] };

  if (!fs.existsSync(folder)) {
    console.log(`⚠️  Folder not found: ${folder}`);
    return result;
  }

  const files = fs.readdirSync(folder).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
  });

  console.log(`\n📁 Processing ${files.length} images from ${folder}...`);

  for (const file of files) {
    const inputPath = path.join(folder, file);
    const baseName = path.basename(file, path.extname(file));
    const s3Key = `images/${imageType}/${baseName}.webp`;

    try {
      process.stdout.write(`  Converting ${file}...`);

      const webpBuffer = await convertToWebp(inputPath);
      const sizeKB = Math.round(webpBuffer.length / 1024);

      process.stdout.write(` ${sizeKB}KB, uploading...`);

      await uploadToS3(webpBuffer, s3Key, "image/webp");

      console.log(` ✅`);
      result.success.push(inputPath);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.log(` ❌ ${errorMsg}`);
      result.failed.push({ path: inputPath, error: errorMsg });
    }
  }

  return result;
}

async function main() {
  console.log("🚀 Starting image upload to S3...\n");
  console.log(`Bucket: ${BUCKET_NAME}`);
  console.log(`Region: ${REGION}`);

  const scriptsDir = path.dirname(new URL(import.meta.url).pathname);
  const prodottiFolder = path.join(scriptsDir, "images", "prodotti");
  const trattamentiFolder = path.join(scriptsDir, "images", "trattamenti");

  const prodottiResult = await processImages(prodottiFolder, "prodotti");
  const trattamentiResult = await processImages(trattamentiFolder, "trattamenti");

  // Summary
  const totalSuccess =
    prodottiResult.success.length + trattamentiResult.success.length;
  const totalFailed =
    prodottiResult.failed.length + trattamentiResult.failed.length;

  console.log("\n" + "=".repeat(50));
  console.log("📊 SUMMARY");
  console.log("=".repeat(50));
  console.log(`✅ Successfully uploaded: ${totalSuccess}`);
  console.log(`❌ Failed: ${totalFailed}`);

  if (totalFailed > 0) {
    console.log("\n❌ Failed uploads:");
    [...prodottiResult.failed, ...trattamentiResult.failed].forEach((f) => {
      console.log(`  - ${f.path}`);
      console.log(`    Error: ${f.error}`);
    });

    // Write failed paths to file
    const failedPaths = [...prodottiResult.failed, ...trattamentiResult.failed].map(
      (f) => f.path
    );
    fs.writeFileSync(
      path.join(scriptsDir, "failed-uploads.txt"),
      failedPaths.join("\n")
    );
    console.log("\n📝 Failed paths written to scripts/failed-uploads.txt");
  }

  console.log("\n✨ Done!");
}

main().catch(console.error);


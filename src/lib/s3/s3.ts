import { env } from "@/env";
import { S3 } from "aws-sdk";

export const s3 = new S3({
  region: "eu-west-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  signatureVersion: "v4",
});

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const bucket = process.env.S3_BUCKET!;

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "us-east-1",
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export function publicUrlForKey(key: string) {
  const base = process.env.S3_PUBLIC_URL?.replace(/\/$/, "");
  return `${base}/${key}`;
}

/** Uploads a file buffer to the SeaweedFS/S3 bucket and returns its key + public URL. */
export async function uploadMedia(params: {
  buffer: Buffer;
  contentType: string;
  fileName: string;
  folder?: string;
}) {
  const ext = params.fileName.includes(".")
    ? params.fileName.slice(params.fileName.lastIndexOf("."))
    : "";
  const key = `${params.folder ? `${params.folder}/` : ""}${randomUUID()}${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: params.buffer,
      ContentType: params.contentType,
    })
  );
  // Note: public read is granted at the bucket level (SeaweedFS bucket
  // policy / filer config), not per-object ACL — see docker/README for setup.

  return { key, url: publicUrlForKey(key) };
}

export async function deleteMedia(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

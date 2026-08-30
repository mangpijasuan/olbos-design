import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const bucket = process.env.S3_BUCKET ?? "olbosevents-media";

export const s3 = new S3Client({
  region: process.env.S3_REGION ?? "us-east-1",
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  },
});

export function publicMediaUrl(key: string) {
  const base = process.env.S3_PUBLIC_URL ?? `${process.env.S3_ENDPOINT}/${bucket}`;
  return `${base.replace(/\/$/, "")}/${key}`;
}

export async function createUploadUrl(params: {
  folder: "events" | "guests" | "avatars";
  contentType: string;
}) {
  const extension = params.contentType.split("/")[1] ?? "bin";
  const key = `${params.folder}/${randomUUID()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: params.contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return { uploadUrl, key, publicUrl: publicMediaUrl(key) };
}

export async function deleteMediaObject(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

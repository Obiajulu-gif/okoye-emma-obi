import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";

import { ObjectId } from "mongodb";

import { collections, getDb, getGridFSBucket } from "@/lib/db";
import { serializeMongo } from "@/lib/serializers";
import type { ImageDoc } from "@/types/portfolio";

type UploadImageParams = {
  filename: string;
  contentType: string;
  buffer: Buffer;
  alt?: string;
  sourceUrl?: string;
};

async function writeBufferToGridFs(params: UploadImageParams) {
  const bucket = await getGridFSBucket();
  const uploadStream = bucket.openUploadStream(params.filename, {
    metadata: {
      contentType: params.contentType,
      sourceUrl: params.sourceUrl,
    },
  });

  await new Promise<void>((resolve, reject) => {
    Readable.from(params.buffer)
      .pipe(uploadStream)
      .on("error", reject)
      .on("finish", () => resolve());
  });

  return uploadStream.id as ObjectId;
}

export async function uploadImageBuffer(params: UploadImageParams): Promise<ImageDoc> {
  const fileId = await writeBufferToGridFs(params);
  const db = await getDb();

  const doc = {
    fileId,
    filename: params.filename,
    contentType: params.contentType,
    size: params.buffer.length,
    alt: params.alt || "",
    sourceUrl: params.sourceUrl || "",
    createdAt: new Date(),
  };

  const result = await db.collection(collections.images).insertOne(doc);

  return serializeMongo({
    ...doc,
    _id: result.insertedId,
  }) as unknown as ImageDoc;
}

export async function listImages(): Promise<ImageDoc[]> {
  const db = await getDb();
  const docs = await db
    .collection(collections.images)
    .find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  return serializeMongo(docs) as unknown as ImageDoc[];
}

export async function storeRemoteImage(url: string, alt = "", filenameHint?: string) {
  const response = await fetch(url, {
    next: { revalidate: 60 * 60 * 6 },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch image: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "application/octet-stream";
  if (!contentType.startsWith("image/")) {
    throw new Error("Remote URL did not return an image");
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const extension = contentType.split("/")[1] || "png";
  const sanitized = (filenameHint || randomUUID()).replace(/[^a-zA-Z0-9-_]/g, "-");

  return uploadImageBuffer({
    filename: `${sanitized}.${extension}`,
    contentType,
    buffer,
    alt,
    sourceUrl: url,
  });
}

export async function findImageById(id: string) {
  const db = await getDb();
  const objectId = new ObjectId(id);

  const image = await db.collection(collections.images).findOne({ _id: objectId });
  if (!image) return null;

  return image;
}

import { Readable } from "node:stream";

import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { collections, getDb, getGridFSBucket } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid image id" }, { status: 400 });
  }

  const db = await getDb();
  const bucket = await getGridFSBucket();

  const objectId = new ObjectId(id);

  let image = await db.collection(collections.images).findOne({ _id: objectId });
  if (!image) {
    image = await db.collection(collections.images).findOne({ fileId: objectId });
  }

  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const stream = bucket.openDownloadStream(image.fileId as ObjectId);
  const webStream = Readable.toWeb(stream as unknown as Readable) as ReadableStream<Uint8Array>;

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": image.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename=\"${image.filename || "media"}\"`,
    },
  });
}

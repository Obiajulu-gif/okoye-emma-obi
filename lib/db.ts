import { Db, GridFSBucket, MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined = global.__mongoClientPromise;

export async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }

  if (!clientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 20,
    });
    clientPromise = client.connect();

    if (process.env.NODE_ENV !== "production") {
      global.__mongoClientPromise = clientPromise;
    }
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB || "okoyePortfolio";
  return client.db(dbName);
}

export async function getGridFSBucket(): Promise<GridFSBucket> {
  const db = await getDb();
  return new GridFSBucket(db, { bucketName: "media" });
}

export const collections = {
  siteContent: "siteContent",
  skills: "skills",
  projects: "projects",
  awards: "awards",
  images: "images",
} as const;

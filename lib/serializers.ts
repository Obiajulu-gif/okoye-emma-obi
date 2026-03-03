import { ObjectId } from "mongodb";

function isObjectId(value: unknown): value is ObjectId {
  return value instanceof ObjectId;
}

export function serializeMongo<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => serializeMongo(item)) as T;
  }

  if (value && typeof value === "object") {
    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};

    for (const [key, entry] of Object.entries(input)) {
      if (isObjectId(entry)) {
        output[key] = entry.toHexString();
      } else if (entry instanceof Date) {
        output[key] = entry.toISOString();
      } else {
        output[key] = serializeMongo(entry);
      }
    }

    return output as T;
  }

  return value;
}

import { config as loadEnv } from "dotenv";

import { collections, getDb, getMongoClient } from "@/lib/db";
import { defaultAwards, defaultProjects, defaultSiteContent, defaultSkills } from "@/lib/default-data";
import { resolveProjectFromGitHub } from "@/lib/github";

loadEnv({ path: ".env.local" });
loadEnv();

function stripId<T extends { _id?: unknown }>(doc: T): Omit<T, "_id"> {
  const clone = { ...doc };
  delete (clone as { _id?: unknown })._id;
  return clone;
}

async function main() {
  const db = await getDb();

  const shouldResolveGitHub = process.argv.includes("--resolve-github");

  const siteExists = await db.collection(collections.siteContent).countDocuments();
  if (!siteExists) {
    await db.collection(collections.siteContent).insertOne({
      ...stripId(defaultSiteContent),
      updatedAt: new Date(),
    });
    console.log("Seeded siteContent");
  }

  const skillsExists = await db.collection(collections.skills).countDocuments();
  if (!skillsExists) {
    await db.collection(collections.skills).insertMany(
      defaultSkills.map((skill) => ({
        ...stripId(skill),
        updatedAt: new Date(),
      })),
    );
    console.log("Seeded skills");
  }

  const projectsExists = await db.collection(collections.projects).countDocuments();
  if (!projectsExists) {
    await db.collection(collections.projects).insertMany(
      defaultProjects.map((project) => ({
        ...stripId(project),
        updatedAt: new Date(),
      })),
    );
    console.log("Seeded projects");
  }

  const awardsExists = await db.collection(collections.awards).countDocuments();
  if (!awardsExists) {
    await db.collection(collections.awards).insertMany(
      defaultAwards.map((award) => ({
        ...stripId(award),
        updatedAt: new Date(),
      })),
    );
    console.log("Seeded awards");
  }

  if (shouldResolveGitHub) {
    const projects = await db.collection(collections.projects).find({}).toArray();

    for (const project of projects) {
      try {
        const metadata = await resolveProjectFromGitHub(project.name, "Obiajulu-gif");

        await db.collection(collections.projects).updateOne(
          { _id: project._id },
          {
            $set: {
              autoMetadata: metadata.autoMetadata,
              githubUrl: metadata.autoMetadata.githubUrl || project.githubUrl || "",
              description: metadata.autoMetadata.description || project.description || "",
              tags: metadata.autoMetadata.tags || project.tags || [],
              languages: metadata.autoMetadata.languages || project.languages || [],
              homepage: metadata.autoMetadata.homepage || project.homepage || "",
              heroImageUrl: metadata.autoMetadata.heroImageUrl || project.heroImageUrl || "",
              needsRepo: metadata.needsRepo,
              needsImage: metadata.needsImage,
              updatedAt: new Date(),
            },
          },
        );

        console.log(`Resolved project metadata: ${project.name}`);
      } catch (error) {
        console.error(`Failed to resolve ${project.name}:`, error);
      }
    }
  }
}

main()
  .then(async () => {
    const client = await getMongoClient();
    await client.close();
    console.log("Seed completed");
  })
  .catch(async (error) => {
    console.error(error);
    try {
      const client = await getMongoClient();
      await client.close();
    } catch {
      // ignore
    }
    process.exit(1);
  });

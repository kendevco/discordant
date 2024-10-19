import { PrismaClient, Prisma } from '@prisma/client';
import fs from 'fs/promises';

import path from 'path';

const db = new PrismaClient();

type ModelMethods = {
  findMany: () => Promise<any[]>;
  findUnique: (query: any) => Promise<any | null>;
  create: (data: any) => Promise<any>;
};

type ModelMap = {
  [modelName: string]: ModelMethods;
};

const modelMap: ModelMap = {
  profile: db.profile,
  server: db.server,
  member: db.member,
  channel: db.channel,
  message: db.message,
  conversation: db.conversation,
  directMessage: db.directMessage,
};

export async function exportData() {
  const models = Object.keys(modelMap);

  for (const model of models) {
    const records = await modelMap[model].findMany();

    const json = JSON.stringify(records, null, 2);

    const filename = `${model}.json`;
    const file = path.join(process.cwd(), 'public', 'seed', filename);

    // Ensure the seed directory exists
    await fs.mkdir(path.dirname(file), { recursive: true });

    await fs.writeFile(file, json);

    console.log(`Exported ${records.length} ${model} to ${file}`);
  }
}

export async function importData() {
  const models = ['profile', 'server', 'member', 'channel', 'message', 'conversation', 'directMessage'];

  for (const model of models) {
    const filename = `${model}.json`;
    const file = path.join(process.cwd(), 'public', 'seed', filename);

    try {
      // Read the JSON file
      const json = await fs.readFile(file, 'utf-8');
      // Parse the JSON data
      const records = JSON.parse(json);

      // Iterate over each record
      for (const record of records) {
        switch (model) {
          case 'profile':
            await db.profile.upsert({
              where: { id: record.id },
              update: record,
              create: record,
            });
            break;
          case 'server':
            await db.server.upsert({
              where: { id: record.id },
              update: record,
              create: record,
            });
            break;
          case 'member':
            await db.member.upsert({
              where: { id: record.id },
              update: record,
              create: record,
            });
            break;
          case 'channel':
            await db.channel.upsert({
              where: { id: record.id },
              update: record,
              create: record,
            });
            break;
          case 'message':
            await db.message.upsert({
              where: { id: record.id },
              update: record,
              create: record,
            });
            break;
          case 'conversation':
            await db.conversation.upsert({
              where: { id: record.id },
              update: record,
              create: record,
            });
            break;
          case 'directMessage':
            await db.directMessage.upsert({
              where: { id: record.id },
              update: record,
              create: record,
            });
            break;
        }
      }

      console.log(`Imported ${records.length} ${model} from ${file}`);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        console.log(`No seed file found for ${model}, skipping...`);
      } else {
        console.error(`Error importing ${model}:`, error);
      }
    }
  }
}

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
    const file = path.join(process.cwd(), 'public', filename);

    await fs.writeFile(file, json); // <-- Use fs.writeFile directly

    console.log(`Exported ${records.length} ${model} to ${file}`);
  }
}

export async function importData() {
  const models = ['profile', 'server', 'member', 'channel', 'message', 'conversation', 'directMessage'];

  for (const model of models) {
    const filename = `${model}.json`;
    const file = path.join(process.cwd(), 'public', filename);

    // Read the JSON file
    const json = await fs.readFile(file, 'utf-8');
    // Parse the JSON data
    const records = JSON.parse(json);

    // Iterate over each record
    for (const record of records) {
      switch (model) {
        case 'profile':
          const existingProfile = await db.profile.findUnique({ where: { id: record.id } });
          if (!existingProfile) {
            try {
              await db.profile.create({ data: record });
            } catch (error) {
              if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                // Unique constraint violation, update the existing record
                const { userId, ...data } = record;
                await db.profile.update({
                  where: { userId },
                  data,
                });
              } else {
                throw error;
              }
            }
          }
          break;
        case 'server':
          const existingServer = await db.server.findUnique({ where: { id: record.id } });
          if (!existingServer) {
            await db.server.create({ data: record });
          }
          break;
        case 'member':
          const existingMember = await db.member.findUnique({ where: { id: record.id } });
          if (!existingMember) {
            await db.member.create({ data: record });
          }
          break;
        case 'channel':
          const existingChannel = await db.channel.findUnique({ where: { id: record.id } });
          if (!existingChannel) {
            await db.channel.create({ data: record });
          }
          break;
        case 'message':
          const existingMessage = await db.message.findUnique({ where: { id: record.id } });
          if (!existingMessage) {
            await db.message.create({ data: record });
          }
          break;
        case 'conversation':
          const existingConversation = await db.conversation.findUnique({ where: { id: record.id } });
          if (!existingConversation) {
            await db.conversation.create({ data: record });
          }
          break;
        case 'directMessage':
          const existingDirectMessage = await db.directMessage.findUnique({ where: { id: record.id } });
          if (!existingDirectMessage) {
            await db.directMessage.create({ data: record });
          }
          break;
      }
    }

    console.log(`Imported ${records.length} ${model} from ${file}`);
  }
}


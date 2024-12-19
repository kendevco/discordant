import fs from "fs";
import path from "path";

export interface SeedFileData {
  NAME: string;
  PREAMBLE: string;
  SEED_CHAT: string;
}

export function readFilesInFolder(folderPath: string): SeedFileData[] {
  // Read the contents of the folder
  const files = fs.readdirSync(folderPath);
  // Loop through each file and create an object with PREAMBLE and SEED_CHAT properties
  const data = files.map((file) => {
    // Read the contents of the file
    const text = fs.readFileSync(path.join(folderPath, file), "utf8");

    const nameMatch = text.match(/NAME:\s*\n\n([\s\S]*?)\n\nPREAMBLE:/);
    const preambleMatch = text.match(/PREAMBLE:\s*\n\n([\s\S]*?)\n\nSEED_CHAT:/);
    const seedChatMatch = text.match(/SEED_CHAT:\s*\n\n([\s\S]*)/);

    const name = nameMatch ? nameMatch[1].trim() : '';
    const preamble = preambleMatch ? preambleMatch[1].trim() : '';
    const seedChat = seedChatMatch ? seedChatMatch[1].trim() : '';

    // Create the object with PREAMBLE and SEED_CHAT properties
    return { NAME: name, PREAMBLE: preamble, SEED_CHAT: seedChat };
  });

  return data;
}
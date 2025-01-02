export const generateUsernameFromEmail = async (email: string, db: any) => {
  // Get the part before @ and remove special characters
  const baseName = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");

  // Try the base name first
  const baseExists = await db.profile.findFirst({
    where: { name: baseName },
  });

  if (!baseExists) return baseName;

  // If base name exists, add random numbers until we find a unique one
  let username = "";
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    const randomNum = Math.floor(Math.random() * 9999);
    username = `${baseName}${randomNum}`;

    // Check if this username exists
    const exists = await db.profile.findFirst({
      where: { name: username },
    });

    if (!exists) {
      isUnique = true;
    }
    attempts++;
  }

  return username || `${baseName}${Date.now()}`;
};

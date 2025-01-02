import { Profile, MemberRole } from "@prisma/client";
import { db } from "@/lib/db";

// Define permission levels
export enum Permission {
  READ = "read",
  WRITE = "write",
  MODERATE = "moderate",
  ADMIN = "admin",
  SYSTEM = "system",
}

// Define role mappings with explicit Permission[] type
const ROLE_PERMISSIONS: Record<MemberRole | "SYSTEM", Permission[]> = {
  [MemberRole.GUEST]: [Permission.READ],
  [MemberRole.MODERATOR]: [
    Permission.READ,
    Permission.WRITE,
    Permission.MODERATE,
  ],
  [MemberRole.ADMIN]: [
    Permission.READ,
    Permission.WRITE,
    Permission.MODERATE,
    Permission.ADMIN,
  ],
  SYSTEM: [
    Permission.READ,
    Permission.WRITE,
    Permission.MODERATE,
    Permission.ADMIN,
    Permission.SYSTEM,
  ],
};

// System IDs
const SYSTEM_IDS = {
  USER_ID: "system-user-9000",
  ADMIN_ID: "user_2UiYG68D5ki8SE5RBJGkgkWRvjS",
  // Add other system IDs here
};

export async function isSystemUser(profileId: string) {
  return profileId === SYSTEM_IDS.USER_ID;
}

export async function isAdmin(profile: Profile | null) {
  if (!profile) return false;

  // Check if system user
  if (await isSystemUser(profile.id)) return true;

  // Check if admin in any server
  const adminMembership = await db.member.findFirst({
    where: {
      profileId: profile.id,
      role: MemberRole.ADMIN,
    },
  });

  return !!adminMembership;
}

export async function hasPermission(
  profile: Profile | null,
  permission: Permission,
  serverId?: string
) {
  if (!profile) return false;

  // System user has all permissions
  if (await isSystemUser(profile.id)) return true;

  // If serverId provided, check server-specific permissions
  if (serverId) {
    const member = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId,
      },
    });

    if (!member) return false;

    return ROLE_PERMISSIONS[member.role].includes(permission);
  }

  // Otherwise check if user has permission in any server
  const members = await db.member.findMany({
    where: {
      profileId: profile.id,
    },
  });

  return members.some((member) =>
    ROLE_PERMISSIONS[member.role].includes(permission)
  );
}

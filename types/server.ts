import { Server, Member, Profile, Channel } from "@prisma/client";

export type ServerWithMembersWithProfiles = Pick<
  Server,
  | "id"
  | "name"
  | "imageUrl"
  | "inviteCode"
  | "profileId"
  | "createdAt"
  | "updatedAt"
> & {
  members: (Member & {
    profile: Profile;
  })[];
  channels: Channel[];
}; 
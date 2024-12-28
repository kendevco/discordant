import { Server, Channel, Member, Profile } from "@prisma/client";

export interface ServerWithMembersWithProfiles extends Server {
  members: (Member & {
    profile: Profile;
  })[];
  channels: Channel[];
}

export interface MemberWithProfile extends Member {
  profile: Profile;
}

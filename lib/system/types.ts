import { Channel, Member, Message, Profile, Server } from "@prisma/client";

export type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & {
    profile: Profile;
  })[];
  channels: Channel[];
};

export type MemberWithProfile = Member & {
  profile: Profile;
};

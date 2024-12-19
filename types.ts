import { Server as NetServer } from 'http';
import { NextApiResponse } from "next";
import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type MessageWithMemberWithProfile = {
  id: string;
  content: string;
  fileUrl: string | null;
  memberId: string;
  channelId: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  member: Member & {
    profile: Profile;
  };
};

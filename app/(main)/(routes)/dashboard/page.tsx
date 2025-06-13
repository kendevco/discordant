import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { UserAvatarWithStatus } from "@/components/user-avatar-with-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, MessageSquare, Users, Bell } from "lucide-react";
import { UI_CONFIG } from "@/lib/constants/ui-config";

const DashboardPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  // Get user's profile and recent activity
  const profile = await db.profile.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!profile) {
    return redirect("/setup");
  }

  // Get recent messages from servers user is a member of
  const recentMessages = await db.message.findMany({
    where: {
      channel: {
        server: {
          members: {
            some: {
              profileId: profile.id,
            },
          },
        },
      },
      NOT: {
        memberId: {
          in: await db.member.findMany({
            where: { profileId: profile.id },
            select: { id: true },
          }).then(members => members.map(m => m.id)),
        },
      },
    },
    include: {
      member: {
        include: {
          profile: true,
        },
      },
      channel: {
        include: {
          server: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  // Get online users from servers user is a member of
  const onlineUsers = await db.member.findMany({
    where: {
      server: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      isOnline: true,
      NOT: {
        profileId: profile.id,
      },
    },
    include: {
      profile: true,
      server: true,
    },
    take: 20,
  });

  return (
    <div className="bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] flex-1">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {profile.name}!
            </h1>
            <p className="text-zinc-300 mt-1">
              Here's what's happening in your servers
            </p>
          </div>
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Messages */}
          <Card className="lg:col-span-2 bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <MessageSquare className="h-5 w-5 mr-2" />
                Recent Messages
                {recentMessages.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {recentMessages.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMessages.length === 0 ? (
                <p className="text-zinc-300 text-center py-8">
                  No new messages. You're all caught up! 🎉
                </p>
              ) : (
                recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <UserAvatarWithStatus
                      src={message.member.profile.imageUrl || undefined}
                      className="h-8 w-8"
                      showStatus={false}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white text-sm">
                          {message.member.profile.name}
                        </span>
                        <span className="text-xs text-zinc-400">
                          in #{message.channel.name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {message.channel.server.name}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm mt-1 truncate">
                        {message.content.length > UI_CONFIG.MESSAGE_LINE_WRAP
                          ? `${message.content.substring(0, UI_CONFIG.MESSAGE_LINE_WRAP)}...`
                          : message.content}
                      </p>
                      <span className="text-xs text-zinc-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Online Users */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="h-5 w-5 mr-2" />
                Online Now
                <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-300">
                  {onlineUsers.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {onlineUsers.length === 0 ? (
                <p className="text-zinc-300 text-center py-4">
                  No one else is online right now
                </p>
              ) : (
                onlineUsers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <UserAvatarWithStatus
                      src={member.profile.imageUrl || undefined}
                      className="h-8 w-8"
                      isOnline={member.isOnline}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">
                        {member.profile.name}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {member.server.name}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Settings */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Settings className="h-5 w-5 mr-2" />
              Quick Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Message Line Wrap
                </label>
                <div className="text-xs text-zinc-300">
                  Currently: {UI_CONFIG.MESSAGE_LINE_WRAP} characters
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Compact Messages
                </label>
                <div className="text-xs text-zinc-300">
                  {UI_CONFIG.USER_PREFERENCES.COMPACT_MESSAGES ? "Enabled" : "Disabled"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Show Timestamps
                </label>
                <div className="text-xs text-zinc-300">
                  {UI_CONFIG.USER_PREFERENCES.SHOW_TIMESTAMPS ? "Enabled" : "Disabled"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Show Avatars
                </label>
                <div className="text-xs text-zinc-300">
                  {UI_CONFIG.USER_PREFERENCES.SHOW_AVATARS ? "Enabled" : "Disabled"}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Settings className="h-4 w-4 mr-2" />
                Configure Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage; 
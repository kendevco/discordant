"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
};

export const MediaRoom = ({
  chatId,
  video,
  audio
}: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    const fetchToken = async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${encodeURIComponent(chatId)}&username=${encodeURIComponent(name)}`);
        const data = await resp.json();

        if (!resp.ok) {
          throw new Error(data.error || 'Failed to get token');
        }

        if (typeof data.token !== 'string') {
          throw new Error('Invalid token format received');
        }

        console.log("LiveKit token received:", data.token.substring(0, 20) + "...");
        console.log("LiveKit URL:", data.url);
        setToken(data.token);
        setWsUrl(data.url);
        setError(null);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Failed to get LiveKit token';
        console.error("LiveKit token error:", errorMessage);
        setError(errorMessage);
        setToken("");
        setWsUrl(null);
      }
    };

    fetchToken();
  }, [user?.firstName, user?.lastName, chatId]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <p className="text-sm text-rose-500">
          Error: {error}
        </p>
      </div>
    );
  }

  if (token === "" || !wsUrl) {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <Loader2
          className="my-4 h-7 w-7 text-zinc-500 animate-spin"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading...
        </p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={wsUrl}
      token={token}
      connect={true}
      video={video}
      audio={audio}
      onError={(err) => {
        console.error("LiveKit connection error:", err);
        setError(err.message);
      }}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}
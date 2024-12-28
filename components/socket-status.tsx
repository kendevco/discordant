import { useSocket } from "@/hooks/use-socket";
import { ActionTooltip } from "@/components/action-tooltip";
import { Wifi, WifiOff } from "lucide-react";

export const SocketStatus = () => {
  const { status } = useSocket();

  const statusMap = {
    connected: {
      icon: <Wifi className="h-4 w-4 text-emerald-500" />,
      label: "Connected",
    },
    disconnected: {
      icon: <WifiOff className="h-4 w-4 text-rose-500" />,
      label: "Disconnected",
    },
    connecting: {
      icon: <Wifi className="h-4 w-4 text-amber-500 animate-pulse" />,
      label: "Connecting...",
    },
    error: {
      icon: <WifiOff className="h-4 w-4 text-rose-500" />,
      label: "Connection Error",
    },
  };

  const { icon, label } = statusMap[status];

  return (
    <ActionTooltip label={label} side="left">
      <div className="flex items-center justify-center h-6 w-6">
        {icon}
      </div>
    </ActionTooltip>
  );
}; 
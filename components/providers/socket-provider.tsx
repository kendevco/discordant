"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";

import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
    lastActivity: number;
    updateLastActivity: () => void;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    lastActivity: Date.now(),
    updateLastActivity: () => {},
});

export const useSocket = () => {
     return useContext(SocketContext);
}

export const SocketProvider = ({ 
    children 
}: { children: React.ReactNode}) => {
    
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastActivity, setLastActivity] = useState(Date.now());

    const updateLastActivity = useCallback(() => {
        setLastActivity(Date.now());
    }, []);

    useEffect(() => {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;

        const socketInstance = new (ClientIO as any)(siteUrl!, {  
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }
        
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected, lastActivity, updateLastActivity }}>
            {children}
        </SocketContext.Provider>
    );
}

"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export const SocketIndicator = () => {
    const { isConnected, lastActivity, updateLastActivity } = useSocket();
    const [pollingInterval, setPollingInterval] = useState(1000);
    const [activityStatus, setActivityStatus] = useState("Active");

    useEffect(() => {
        const handleActivity = () => {
            updateLastActivity();
            setActivityStatus("Active");
        };

        // Add event listeners for user activity
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('click', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('click', handleActivity);
        };
    }, [updateLastActivity]);

    useEffect(() => {
        const calculatePollingInterval = () => {
            const inactiveTime = Date.now() - lastActivity;
            if (inactiveTime < 60000) { // Less than 1 minute
                return 1000; // 1 second
            } else if (inactiveTime < 300000) { // Less than 5 minutes
                return 5000; // 5 seconds
            } else if (inactiveTime < 900000) { // Less than 15 minutes
                return 15000; // 15 seconds
            } else {
                return 60000; // 1 minute
            }
        };

        const updateStatus = () => {
            const newInterval = calculatePollingInterval();
            setPollingInterval(newInterval);

            const inactiveTime = Date.now() - lastActivity;
            if (inactiveTime < 60000) {
                setActivityStatus("Active");
            } else if (inactiveTime < 300000) {
                setActivityStatus("Idle");
            } else if (inactiveTime < 900000) {
                setActivityStatus("Inactive");
            } else {
                setActivityStatus("Away");
            }
        };

        const intervalId = setInterval(updateStatus, 1000);

        return () => clearInterval(intervalId);
    }, [lastActivity]);

    if (isConnected) {
        return (
            <Badge variant="outline" className="bg-emerald-600 text-white border-none">
                Live: Real-time updates | {activityStatus}
            </Badge>
        );
    }

    return (
        <Badge variant="outline" className="bg-yellow-600 text-white border-none">
            Fallback: Polling every {pollingInterval / 1000}s | {activityStatus}
        </Badge>
    );
};

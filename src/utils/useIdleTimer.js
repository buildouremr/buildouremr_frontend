import { useEffect, useRef, useCallback } from "react";

const IDLE_TIME = 10 * 60 * 1000; // 10 min
const WARNING_TIME = 60 * 1000;   // 1 min

export default function useIdleTimer(onLogout, onShowWarning) {

    const idleTimer = useRef(null);
    const logoutTimer = useRef(null);

    const resetTimers = useCallback(() => {

        clearTimeout(idleTimer.current);
        clearTimeout(logoutTimer.current);

        idleTimer.current = setTimeout(() => {

            onShowWarning();

            logoutTimer.current = setTimeout(() => {

                localStorage.removeItem("token");

                onLogout();

            }, WARNING_TIME);

        }, IDLE_TIME);
    }, [onShowWarning, onLogout]);

    useEffect(() => {

        const events = [
            "mousemove",
            "mousedown",
            "keypress",
            "scroll",
            "touchstart"
        ];

        events.forEach(event =>
            window.addEventListener(event, resetTimers)
        );

        resetTimers();

        return () => {

            clearTimeout(idleTimer.current);
            clearTimeout(logoutTimer.current);

            events.forEach(event =>
                window.removeEventListener(event, resetTimers)
            );
        };

    }, [resetTimers]);

    return resetTimers;
}
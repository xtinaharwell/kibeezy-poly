import { useEffect, useState } from "react";

export function useAuth(redirectTo: string = "/login") {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // First check localStorage - this is our source of truth
                const storedUser = localStorage.getItem("poly_user");
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setLoading(false);
                    return; // Trust localStorage, don't verify with backend every time
                }

                // No user in localStorage, redirect to login
                if (redirectTo !== "/login") {
                    localStorage.setItem("poly_redirect", redirectTo);
                }
                window.location.href = "/login";
            } catch (err) {
                console.error("Auth check error:", err);
                if (redirectTo !== "/login") {
                    localStorage.setItem("poly_redirect", redirectTo);
                }
                window.location.href = "/login";
            }
        };

        checkAuth();
    }, [redirectTo]);

    return { user, loading, error };
}

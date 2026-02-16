/**
 * Utility for making authenticated API calls
 * Automatically includes user phone number from localStorage in headers
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const storedUser = localStorage.getItem("poly_user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) || {}),
    };

    // Include user phone number for backend authentication
    if (user && user.phone_number) {
        headers["X-User-Phone-Number"] = user.phone_number;
    }

    return fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });
}

// Responsible for all JWT authentication helper functions.
// Kept in lib/ because this is pure logic, not a UI component.

export function getAuthToken(): string | null {
    // Guard against server-side execution where document is not available.
    if (typeof document === "undefined") return null;

    const allCookies = document.cookie.split("; ");

    const authCookie = allCookies.find((cookie) =>
        cookie.startsWith("auth_token=")
    );

    if (!authCookie) return null;

    return authCookie.split("=")[1];
}

export function isUserAuthenticated(): boolean {
    return getAuthToken() !== null;
}
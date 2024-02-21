import { browser } from "$app/environment";
import { error } from "@sveltejs/kit";

export default async function fetchRefresh(fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>, path: string) {
    const req = fetch(path);

    // if this is a hard refresh then this is happening in the server and layout already refreshes the token
    if (!browser) return req;

    const res = await req;
    if (res.status === 401) {
        if (!window.refreshPromise) {
            window.refreshPromise = fetch('/api/auth/refresh').finally(() => { window.refreshPromise = null; });
        }

        const refreshRes = await window.refreshPromise;

        if (!refreshRes.ok) throw error(401, 'Session Expired');

        return fetch(path);
    }

    return res;
}
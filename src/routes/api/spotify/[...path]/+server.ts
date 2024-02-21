import { SPOTIFY_BASE_URL } from "$env/static/private";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, cookies, params, url }) => {
    const accessToken = cookies.get('access_token');

    const response = await fetch(`${SPOTIFY_BASE_URL}/${params.path}${url.search}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const responseJson = await response.json();

    if (responseJson.error) {
        throw error(responseJson.error.status, responseJson.error.message);
    }

    return json(responseJson);
}
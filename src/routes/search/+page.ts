import { fetchRefresh } from "$helpers";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, url }) => {

    const query = url.searchParams.get('q');

    if (query) {
        throw redirect(307, `/search/${query}`);
    }

    const catsRes = await fetchRefresh(fetch, `/api/spotify/browse/categories?limit=50`);

    return {
        title: 'Search',
        categories: catsRes.ok ? await catsRes.json() as SpotifyApi.MultipleCategoriesResponse : undefined,
    }
}
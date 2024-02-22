import { fetchRefresh } from "$helpers";
import { error, type NumericRange } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params, depends, route }) => {
    depends(`app:${route.id}`);

    const query = params.query;
    const searchParams = new URLSearchParams({
        q: query,
        type: 'album,artist,playlist',
        limit: '6',
    }).toString();

    const resultRes = await fetchRefresh(fetch, `/api/spotify/search?${searchParams}`);

    if (!resultRes.ok) {
        throw error(resultRes.status as NumericRange<400, 599>, 'Failed to load results!');
    }

    const resultJson: SpotifyApi.SearchResponse = await resultRes.json();

    return {
        title: `Search result for ${query}`,
        searchResults: resultJson
    }
}
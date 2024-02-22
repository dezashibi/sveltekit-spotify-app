import { fetchRefresh } from "$helpers";
import { error, type NumericRange } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
    const playlistRes = await fetchRefresh(fetch, `/api/spotify/playlists/${params.id}?${new URLSearchParams({
        fields: 'id,name,description'
    }).toString()}`);

    if (!playlistRes.ok) {
        throw error(playlistRes.status as NumericRange<400, 599>, 'Failed to load playlist!');
    }

    const playlistJson: SpotifyApi.SinglePlaylistResponse = await playlistRes.json();

    return {
        playlist: playlistJson,
        title: `Edit ${playlistJson.name}`
    }
}
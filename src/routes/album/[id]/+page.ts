import { fetchRefresh } from "$helpers";
import { error, type NumericRange } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params, depends, route }) => {

    depends(`app:${route.id}`);

    const albumRes = await fetchRefresh(fetch, `/api/spotify/albums/${params.id}`);

    if (!albumRes.ok) {
        throw error(albumRes.status as NumericRange<400, 599>, 'Failed to load album');
    }

    const albumJson: SpotifyApi.SingleAlbumResponse = await albumRes.json();

    let color = null;

    if (albumJson.images.length > 0) {
        const colorRes = await fetch(`/api/average-color?${new URLSearchParams({
            image: albumJson.images[0].url
        }).toString()}`);

        if (colorRes.ok) {
            color = (await colorRes.json()).color;
        }
    }

    return {
        album: albumJson,
        title: albumJson.name,
        color,
    }
}
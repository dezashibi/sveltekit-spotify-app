import { fetchRefresh } from "$helpers";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch: _fetch, parent }) => {
    const { user } = await parent();

    const fetch = (path: string) => fetchRefresh(_fetch, path);

    // Start all independent fetches simultaneously.
    const newReleasesPromise = fetch("/api/spotify/browse/new-releases?limit=6");
    const featuredPlaylistsPromise = fetch("/api/spotify/browse/featured-playlists?limit=6");
    const userPlaylistsPromise = fetch(`/api/spotify/users/${user?.id}/playlists?limit=6`);
    const catsResPromise = fetch("/api/spotify/browse/categories");

    // Immediately await only the promise that needs to be resolved before starting dependent operations.
    const catsRes = await catsResPromise;
    const catsResJson: SpotifyApi.MultipleCategoriesResponse | undefined = catsRes.ok ? await catsRes.json() : undefined;
    const randomCats = catsResJson ? catsResJson.categories.items.sort(() => 0.5 - Math.random()).slice(0, 3) : [];

    // Start dependent fetches as soon as possible.
    const randomCatsPromises = randomCats.map(cat => fetch(`/api/spotify/browse/categories/${cat.id}/playlists?limit=6`));

    // Await all fetches together for maximum concurrency.
    const [newReleasesRes, featuredPlaylistsRes, userPlaylistsRes, ...randomCatsRes] = await Promise.all([
        newReleasesPromise,
        featuredPlaylistsPromise,
        userPlaylistsPromise,
        ...randomCatsPromises,
    ]);

    // Convert all responses to JSON concurrently.
    const categoriesPlaylistsPromises = randomCatsRes.map(res => res.ok ? res.json() as Promise<SpotifyApi.CategoryPlaylistsResponse> : undefined);
    const categoriesPlaylists = await Promise.all(categoriesPlaylistsPromises);

    return {
        newReleases: newReleasesRes.ok ? await newReleasesRes.json() as SpotifyApi.ListOfNewReleasesResponse : undefined,
        featuredPlaylists: featuredPlaylistsRes.ok ? await featuredPlaylistsRes.json() as SpotifyApi.ListOfFeaturedPlaylistsResponse : undefined,
        userPlaylists: userPlaylistsRes.ok ? await userPlaylistsRes.json() as SpotifyApi.ListOfUsersPlaylistsResponse : undefined,
        homeCategories: randomCats,
        categoriesPlaylists,
    };
}

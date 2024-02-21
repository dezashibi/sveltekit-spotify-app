// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        interface PageState {
            user: SpotifyApi.CurrentUsersProfileResponse | null;
            title?: string;
            color?: string | null;
        }
        // interface Platform {}
    }
    declare interface Window {
        refreshPromise: Promise<Response> | null
    }
}


export { };

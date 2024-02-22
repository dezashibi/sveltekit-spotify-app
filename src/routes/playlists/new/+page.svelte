<script lang="ts">
	import { Button, PlaylistForm } from '$components';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<h2>Add a New Playlist</h2>

<PlaylistForm userId={data.user?.id} {form} />

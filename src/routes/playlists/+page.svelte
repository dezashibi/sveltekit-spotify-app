<script lang="ts">
	import { Button, Card, Modal, Pagination, PlaylistForm } from '$components';
	import { toasts } from '$stores';
	import MicroModal from 'micromodal';
	import type { PageData } from './$types';
	import type { ActionData } from './new/$types';

	export let data: PageData;
	export let form: ActionData;

	$: playlists = data.userPlaylists;

	let isLoading = false;

	async function loadMoreItems() {
		if (!playlists.next) return;

		isLoading = true;

		const res = await fetch(playlists.next.replace('https://api.spotify.com/v1/', '/api/spotify/'));

		if (res.ok) {
			const resJson = await res.json();

			playlists = {
				...resJson,
				items: [...playlists.items, ...resJson.items]
			};
		} else {
			toasts.error('Could not load data!');
		}

		isLoading = false;
	}
</script>

<div class="content">
	{#if playlists.items.length > 0}
		<div class="title">
			<h1>{data.title}</h1>
			<Button
				element="a"
				href="/playlists/new"
				on:click={(e) => {
					e.preventDefault();
					MicroModal.show('add-playlist-modal');
				}}
			>
				+ Add New
			</Button>
		</div>

		<div class="grid-items">
			{#each playlists.items as item}
				<Card {item} />
			{/each}
		</div>

		<Pagination paginatedList={playlists} on:loadmore={loadMoreItems} {isLoading} />
	{:else}
		<div class="empty">
			<p>No playlist</p>
			<Button
				element="a"
				href="/playlists/new"
				on:click={(e) => {
					e.preventDefault();
					MicroModal.show('add-playlist-modal');
				}}
			>
				+ Add New
			</Button>
		</div>
	{/if}
</div>

<Modal id="add-playlist-modal" title="Add a New Playlist">
	<PlaylistForm {form} userId={data.user?.id} action="/playlists/new" />
</Modal>

<style lang="scss">
	.content {
		padding-bottom: 60px;

		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.grid-items {
			margin-bottom: 40px;
		}

		.empty {
			text-align: center;
			margin-top: 40px;

			p {
				font-size: functions.toRem(22);
				font-weight: 600;
			}
		}
	}
</style>

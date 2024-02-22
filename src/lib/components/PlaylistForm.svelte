<script lang="ts">
	import { Button } from '$components';
	import type { ActionData as AddActionData } from '../../routes/playlists/new/$types';
	import type { ActionData as EditActionData } from '../../routes/playlist/[id]/edit/$types';
	import { applyAction, enhance } from '$app/forms';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		success: {};
		redirect: {};
	}>();

	let isLoading = false;

	export let form: AddActionData | EditActionData;
	export let userId: string | undefined = undefined;
	export let action: string | undefined = undefined;
	export let playlist:
		| SpotifyApi.PlaylistObjectFull
		| SpotifyApi.PlaylistObjectSimplified
		| undefined = undefined;
</script>

<form
	method="POST"
	{action}
	use:enhance={() => {
		isLoading = true;

		return async ({ result }) => {
			await applyAction(result);
			isLoading = false;

			if (result.type === 'success') {
				dispatch('success', {});
			} else if (result.type === 'redirect') {
				dispatch('redirect', {});
			}
		};
	}}
>
	{#if userId}
		<input type="hidden" name="userId" value={userId} />
	{/if}

	<div class="field" class:has-error={form?.nameError}>
		<label for="playlist-name">Name *</label>
		<input
			type="text"
			name="name"
			id="playlist-name"
			placeholder="Playlist name"
			value={form?.name || playlist?.name || ''}
		/>
		{#if form?.nameError}
			<p class="error">{form.nameError}</p>
		{/if}
	</div>

	<div class="field">
		<label for="playlist-description">Description</label>
		<input
			type="text"
			name="description"
			id="playlist-description"
			placeholder="Playlist description"
			value={form?.description || playlist?.description || ''}
		/>
	</div>

	{#if form?.apiError}
		<p class="error">{form.apiError}</p>
	{/if}

	<div class="submit-button">
		<Button element="button" type="submit" disabled={isLoading}>
			{playlist ? 'Save Playlist' : 'Create Playlist'}
		</Button>
	</div>
</form>

<style lang="scss">
	form {
		max-width: 400px;

		.field {
			margin-bottom: 20px;

			&.has-error input {
				outline: 2px solid var(--error);
			}

			label {
				display: inline-block;
				margin-bottom: 10px;
				font-size: functions.toRem(14);
			}

			input {
				width: 100%;
			}
		}

		p.error {
			color: var(--error);
			font-size: functions.toRem(14);
			margin: 10px 0 0;
		}

		.submit-button {
			text-align: right;
			margin-top: 40px;
		}
	}
</style>

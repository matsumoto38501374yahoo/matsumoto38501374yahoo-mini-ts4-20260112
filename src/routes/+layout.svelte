<script lang="ts">
	import Theme from "$src/components/Theme.svelte";
  import HomeButton from '$src/components/HomeButton.svelte';
</script>

<nav class="fixed-nav">
	<HomeButton />
</nav>

<slot />

<Theme />

<style>
  .fixed-nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }
</style>
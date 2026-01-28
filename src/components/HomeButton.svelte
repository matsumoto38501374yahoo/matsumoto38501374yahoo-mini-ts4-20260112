<script>
  import { goto } from '$app/navigation';
  import Button, { Label, Icon } from '@smui/button';
</script>

<Button on:click={() => goto('/')} variant="text" class="home-button">
  <Icon class="material-icons">home</Icon>
  <Label>Home</Label>
</Button>

<style>
  .home-button {
    min-width: 40px;
    padding: 4px;
  }
</style>

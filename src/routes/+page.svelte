
<script lang="ts">
  import Button, { Label, Icon } from '@smui/button';
  import LayoutGrid, { Cell as GridCell } from '@smui/layout-grid'
</script>

<h1 style="padding: 2rem;">Welcome to SvelteKit</h1>

<LayoutGrid style="width: 80%;" >
  <GridCell span="{6}" align="middle">
    <Button href="/task_list" variant="unelevated" class="green-button" style="width: 100%">
			<Icon class="material-icons">route</Icon>
			<Label>Task List</Label>
    </Button>
  </GridCell>
  <GridCell span="{6}" align="middle">
    <Button href="/" variant="unelevated" style="width: 100%">
			<Icon class="material-icons">construction</Icon>
			<Label>作成中</Label>
    </Button>
  </GridCell>
    
  <GridCell span="{6}" align="middle">
    <Button href="/" variant="unelevated" style="width: 100%">
			<Icon class="material-icons">construction</Icon>
			<Label>作成中</Label>
    </Button>
  </GridCell>
  <GridCell span="{6}" align="middle">
    <Button href="/" variant="unelevated" style="width: 100%">
			<Icon class="material-icons">construction</Icon>
			<Label>作成中</Label>
    </Button>
  </GridCell>
  <GridCell span="{6}" align="middle">
    <Button href="/" variant="unelevated" style="width: 100%">
			<Icon class="material-icons">construction</Icon>
			<Label>作成中</Label>
    </Button>
  </GridCell>
  <GridCell span="{6}" align="middle">
    <Button href="/" variant="unelevated" style="width: 100%">
			<Icon class="material-icons">construction</Icon>
			<Label>作成中</Label>
    </Button>
  </GridCell>
</LayoutGrid>

<style>
:global(.green-button) {
  --mdc-theme-primary: #2ecc71;
}
:global(.green-button:hover) {
	--mdc-theme-primary: #237244;
}
</style>
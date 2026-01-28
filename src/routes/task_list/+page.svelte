<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import type { Task } from '$lib/server/task_db';

  // 子コンポーネント
  import TaskTable from './TaskTable.svelte';
  import CreateDialog from './CreateDialog.svelte';
  import EditDialog from './EditDialog.svelte';
  import DeleteDialog from './DeleteDialog.svelte';
  import HomeButton from '$src/components/HomeButton.svelte';
  
  // SMUI Components
  import Button, { Label } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import Snackbar, { Actions } from '@smui/snackbar';
  import Textfield from '@smui/textfield';
  import Icon from '@smui/textfield/icon';

  // Props
  export let data: PageData;
  export let form: ActionData;

  // UI State
  let openCreateDialog = false;
  let openEditDialog = false;
  let openDeleteDialog = false;
  let selectedTask: Task | null = null;
  let searchQuery = '';
  let filterQuery = '';

  // actionの結果 formで受け取れる
  $: if (form?.message) {
    showSnackbar(form.message);
  }

  // 入力確定したときだけ反応させる
  function handleSearchChange() {
    // searchQuery: 入力中にリアルタイムに更新される。
    // filterQuery: on:change のタイミングでのみ更新される（確定後）。
    filterQuery = searchQuery;
  }

  $: filteredTasks = data.tasks
    .filter(task => {
        const query = filterQuery.toLowerCase();
        return task.title.toLowerCase().includes(query) ||
               (task.description || '').toLowerCase().includes(query);
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());


  // イベントハンドラー -----------

  // TaskTableのEditボタンから発火
  function handleEdit(event: CustomEvent<Task>) {
    selectedTask = event.detail; // dispatch('edit', task) の第2引数
    openEditDialog = true;
  }

  function handleDelete(event: CustomEvent<Task>) {
    selectedTask = event.detail;
    openDeleteDialog = true;
  }

  // Snackbar State
  let snackbar: Snackbar;
  let snackbarMessage = '';
  
  function showSnackbar(msg: string) {
    snackbarMessage = msg;
    if (snackbar) snackbar.open();
  }

  function handleSuccess(event: CustomEvent<string>) {
    showSnackbar(event.detail);
  }

</script>

<svelte:head>
  <title>タスク一覧</title>
</svelte:head>

<div class="page-container">
  <!-- ヘッダーエリア -->
  <div class="page-header">
    <div>
      <h1>タスク一覧</h1>
      <div class="search-box">
        <Textfield
          bind:value={searchQuery}
          on:change={handleSearchChange}
          label="タイトルや説明で検索..."
          variant="standard"
          style="width: 250px;"
        >
          <Icon class="material-icons" slot="leadingIcon">search</Icon>
        </Textfield>
      </div>

    </div>
    <div class="page-actions">
      <Button on:click={() => (openCreateDialog = true)} variant="unelevated" color="primary">
        <Label>➕ 新規タスク</Label>
      </Button>
    </div>
  </div>

  <!-- データテーブルエリア -->
  <TaskTable 
    tasks={filteredTasks} 
    on:edit={handleEdit} 
    on:delete={handleDelete} 
  />
</div>

<!-- ダイアログ -->
<CreateDialog 
  bind:open={openCreateDialog} 
  on:success={handleSuccess} 
/>

<EditDialog 
  bind:open={openEditDialog} 
  task={selectedTask}
  on:success={handleSuccess} 
/>

<DeleteDialog 
  bind:open={openDeleteDialog} 
  task={selectedTask} 
  on:success={handleSuccess}
/>

<!-- スナックバー -->
<Snackbar bind:this={snackbar}>
  <Label>{snackbarMessage}</Label>
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<style>
  .page-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between; /* 左右両端に配置*/
    align-items: center; /* 上下中央 */
    margin-bottom: 1rem;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
  }

</style>
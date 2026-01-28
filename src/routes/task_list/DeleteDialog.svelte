<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { enhance } from '$app/forms';
  import type { Task } from '$lib/server/task_db';

  // SMUI Components
  import Button from '@smui/button';
  import Dialog, { Title, Content, Actions } from '@smui/dialog';

  export let open = false;
  export let task: Task | null = null;

  const dispatch = createEventDispatcher<{success: string;}>();
</script>

<Dialog bind:open>
  <Title>削除確認</Title>
  <Content>
    このタスクを削除してもよろしいですか？
    {#if task}
      <p style="font-weight: bold; margin: 1rem 0;">{task.title}</p>
    {/if}
    
    <form
      id="delete-form"
      action="?/delete"
      method="POST"
      use:enhance={() => {
        return async ({ result }) => {
          if (result.type === 'success') {
            open = false;
            dispatch('success', '削除しました');
          }
        };
      }}
    >
      {#if task}
        <input type="hidden" name="id" value={task.id} />
      {/if}
    </form>
  </Content>
  <Actions>
    <Button on:click={() => (open = false)}>キャンセル</Button>
    <Button type="submit" form="delete-form" variant="raised" color="secondary">
      削除する
    </Button>
  </Actions>
</Dialog>

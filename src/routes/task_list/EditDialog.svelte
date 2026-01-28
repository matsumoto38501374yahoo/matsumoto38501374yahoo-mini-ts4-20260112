<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { enhance } from '$app/forms';
  import type { Task } from '$lib/server/task_db';

  // SMUI Components
  import Button from '@smui/button';
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import TextField from '@smui/textfield';

  export let open = false;
  export let task: Task | null = null;

  const dispatch = createEventDispatcher<{success: string;}>();

  // YYYY-MM-DD形式にするヘルパー
  // 引数としてstringの場合があるかもしれない。
  function formatDateForInput(dateInput: Date | string): string {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    return d.toISOString().split('T')[0];
  }
</script>

<Dialog bind:open>
  <Title>タスク編集</Title>
  <Content>
    {#if task}
      <form
        id="edit-form"
        action="?/update"
        method="POST"
        use:enhance={() => {
          return async ({ result, update }) => {
            if (result.type === 'success') {
              await update(); // 画面更新
              open = false;
              dispatch('success', 'タスクを更新しました');
            }
          };
        }}
      >
        <input type="hidden" name="id" value={task.id} />
        
        <div class="checkbox-area">
          <label>
            <input
              type="checkbox"
              name="done"
              value="true"
              checked={task.done}
            />
            完了済み
          </label>
        </div>

        <div class="form-grid">
          <TextField
            variant="outlined"
            label="タイトル"
            input$name="title"
            value={task.title}
            required
            style="width: 100%; margin-top: 1rem;"
          />
          <TextField
            variant="outlined"
            label="期限"
            type="date"
            input$name="date"
            value={formatDateForInput(task.date)}
            style="width: 100%; margin-top: 1rem;"
          />
          <TextField
            variant="outlined"
            label="説明"
            textarea
            input$name="description"
            value={task.description}
            style="width: 100%; margin-top: 1rem;"
          />
        </div>
      </form>
    {/if}
  </Content>
  <Actions>
    <Button on:click={() => (open = false)}>キャンセル</Button>
    <Button type="submit" form="edit-form" variant="raised">保存</Button>
  </Actions>
</Dialog>

<style>
  .form-grid {
    padding: 1rem 0;
  }
  .checkbox-area {
    padding: 0.5rem 0;
  }
</style>
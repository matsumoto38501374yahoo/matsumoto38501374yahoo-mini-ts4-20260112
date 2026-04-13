<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { enhance } from "$app/forms";
  import type { Task } from "$lib/server/task_db";

  // SMUI Components
  import Button from "@smui/button";
  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import TextField from "@smui/textfield";

  // Internal State
  let open = false;
  let editingTask: Task | null = null;

  // Form Fields
  let title = "";
  let dateStr = "";
  let description = "";
  let done = false;

  const dispatch = createEventDispatcher<{ success: string }>();

  function formatDateForInput(dateInput: Date | string): string {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    return d.toISOString().split("T")[0];
  }

  // ★ Method Call Pattern
  // Completely eliminates synchronization bugs by manually setting state
  // ONLY when the parent explicitly requests to show the dialog for a specific task.
  export function show(task: Task) {
    editingTask = task;

    // Copy values to local state
    title = task.title;
    // Handle Date formatting safely
    dateStr = formatDateForInput(task.date);
    description = task.description;
    done = task.done;

    open = true;
  }

  function close() {
    open = false;
    // Optional: clear state, but not strictly necessary as show() overwrites it
    editingTask = null;
  }
</script>

<Dialog bind:open>
  <Title>タスク編集</Title>
  <Content>
    <!-- 念のため editingTaskが存在しているかifでチェックする -->
    {#if editingTask}
      <form
        id="edit-form"
        action="?/update"
        method="POST"
        use:enhance={() => {
          return async ({ result, update }) => {
            if (result.type === "success") {
              await update(); // 画面更新
              close();
              dispatch("success", "タスクを更新しました");
            } else if (result.type === "failure") {
              alert(result.data?.message || "更新に失敗しました");
            }
          };
        }}
      >
        <input type="hidden" name="id" value={editingTask.id} />

        <div class="checkbox-area">
          <label>
            <input
              type="checkbox"
              name="done"
              value="true"
              bind:checked={done}
            />
            完了済み
          </label>
        </div>

        <div class="form-grid">
          <TextField
            variant="outlined"
            label="タイトル"
            input$name="title"
            bind:value={title}
            required
            style="width: 100%; margin-top: 1rem;"
          />
          <TextField
            variant="outlined"
            label="期限"
            type="date"
            input$name="date"
            bind:value={dateStr}
            style="width: 100%; margin-top: 1rem;"
          />
          <TextField
            variant="outlined"
            label="説明"
            textarea
            input$name="description"
            bind:value={description}
            style="width: 100%; margin-top: 1rem;"
          />
        </div>
      </form>
    {/if}
  </Content>
  <Actions>
    <Button on:click={close}>キャンセル</Button>
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

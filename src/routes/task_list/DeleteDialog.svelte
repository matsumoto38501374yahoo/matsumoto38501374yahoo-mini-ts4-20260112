<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { enhance } from "$app/forms";
  import type { Task } from "$lib/server/task_db";

  // SMUI Components
  import Button from "@smui/button";
  import Dialog, { Title, Content, Actions } from "@smui/dialog";

  // Internal State
  let open = false;
  let task: Task | null = null;

  const dispatch = createEventDispatcher<{ success: string }>();

  // ★ Method Call Pattern
  export function show(targetTask: Task) {
    task = targetTask;
    open = true;
  }

  function close() {
    open = false;
    // task = null; // Optional
  }
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
        return async ({ result, update }) => {
          if (result.type === "success") {
            // update() はSvelteKitの use:enhance が提供する関数
            // フォーム送信後にサーバーからのデータでページを再取得・更新します。
            // これがないと、削除後も画面上のタスク一覧が更新されず古い状態が表示されたままになる。
            // close() で見た目上はダイアログが閉じますが、削除されたタスクがまだ表示されたままという状態になります。
            // await が必要なのは、ページの更新が完了してから close() と dispatch を呼ぶためです。順序が重要です
            // update()により +page.server.ts の load が再実行されて data.tasksの再取得が行なわれる。
            await update(); // 画面更新
            close();
            dispatch("success", "削除しました");
          } else if (result.type === "failure") {
            alert(result.data?.message || "削除に失敗しました");
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
    <Button on:click={close}>キャンセル</Button>
    <Button type="submit" form="delete-form" variant="raised" color="secondary">
      削除する
    </Button>
  </Actions>
</Dialog>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { enhance } from "$app/forms";

  // SMUI Components
  import Button from "@smui/button";
  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import TextField from "@smui/textfield";

  let open = false;

  const dispatch = createEventDispatcher<{ success: string }>();

  let title = "";
  // dateの初期値として今日の日付(YYYY-MM-DD)を設定
  let date = new Date().toISOString().split("T")[0];
  let description = "";

  export function show() {
    title = "";
    date = new Date().toISOString().split("T")[0];
    description = "";
    open = true;
  }

  function close() {
    open = false;
  }
</script>

<Dialog bind:open>
  <Title>新規タスク作成</Title>
  <Content>
    <form
      id="create-form"
      action="?/create"
      method="POST"
      use:enhance={() => {
        return async ({ result, update }) => {
          if (result.type === "success") {
            await update(); // 画面更新
            close();
            dispatch("success", "タスクを作成しました");
            // フォームをリセット
            // これをしないと、テキストボックスの線がおかしくなる。
            //  ↓↓↓
            // 一旦コメントアウトした。もしあとでおかしくなったら、復活させる。
            // title = "";
            // date = new Date().toISOString().split("T")[0];
            // description = "";
          }
        };
      }}
    >
      <div class="form-grid">
        <TextField
          bind:value={title}
          variant="outlined"
          label="タイトル"
          type="text"
          input$name="title"
          required
          style="width: 100%;"
        />
        <TextField
          bind:value={date}
          variant="outlined"
          label="期限"
          type="date"
          input$name="date"
          style="width: 100%; margin-top: 1rem;"
        />
        <TextField
          bind:value={description}
          variant="outlined"
          label="説明"
          textarea
          input$name="description"
          style="width: 100%; margin-top: 1rem;"
        />
      </div>
    </form>
  </Content>
  <Actions>
    <Button on:click={() => close()}>キャンセル</Button>
    <Button type="submit" form="create-form" variant="raised">作成</Button>
  </Actions>
</Dialog>

<style>
  .form-grid {
    padding: 1rem 0;
  }
</style>

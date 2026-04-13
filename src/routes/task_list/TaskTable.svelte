<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { enhance } from "$app/forms";
  import type { Task } from "$lib/server/task_db";

  // SMUI Components
  import Button, { Icon } from "@smui/button";
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import IconButton from "@smui/icon-button";

  export let tasks: Task[] = [];

  const dispatch = createEventDispatcher<{
    edit: Task;
    delete: Task;
  }>();

  // 表示用日付(yyyy/M/d)
  function formatDateDisplay(dateInput: Date | string): string {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    return d.toLocaleDateString("ja-JP");
  }
</script>

<div>
  {#if tasks.length === 0}
    <div class="empty-state">
      <p>タスクがありません。</p>
    </div>
  {:else}
    <DataTable style="width: 100%;">
      <Head>
        <Row>
          <Cell>完了</Cell>
          <Cell>タイトル</Cell>
          <Cell>期限</Cell>
          <Cell>説明</Cell>
          <Cell>アクション</Cell>
        </Row>
      </Head>
      <Body>
        {#each tasks as task (task.id)}
          <Row class={task.done ? "task-done" : ""}>
            <Cell>
              <form action="?/update" method="POST" use:enhance>
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="title" value={task.title} />
                <input type="hidden" name="date" value={task.date} />
                <input
                  type="hidden"
                  name="done"
                  value={task.done ? "false" : "true"}
                />

                <IconButton class="material-icons" action="submit">
                  {task.done ? "check_box" : "check_box_outline_blank"}
                </IconButton>
              </form>
            </Cell>
            <Cell>{task.title}</Cell>
            <Cell>{formatDateDisplay(task.date)}</Cell>
            <Cell>
              <span class="description-text"
                >{task.description || "(空欄)"}</span
              >
            </Cell>
            <Cell>
              <div class="action-buttons">
                <Button
                  on:click={() => dispatch("edit", task)}
                  variant="outlined"
                  style="min-width: auto;"
                >
                  <Icon class="material-icons">edit</Icon>
                </Button>
                <Button
                  on:click={() => dispatch("delete", task)}
                  variant="outlined"
                  color="secondary"
                  style="min-width: auto; margin-left: 8px;"
                >
                  <Icon class="material-icons">delete</Icon>
                </Button>
              </div>
            </Cell>
          </Row>
        {/each}
      </Body>
    </DataTable>
  {/if}
</div>

<style>
  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .description-text {
    display: inline-block;
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* ← 追加 inline-block が縦方向の基準線（baseline）をずらしているのを修正する*/
    vertical-align: middle;
  }

  .task-done {
    background-color: #f5f5f5;
    color: #888;
    text-decoration: line-through;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #666;
  }
</style>

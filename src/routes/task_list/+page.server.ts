import { fail } from "@sveltejs/kit";
import type { Cookies } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "$lib/server/task_db";

function getUserID(cookies: Cookies): string {
  let userId = cookies.get("userid");
  if (!userId) {
    userId = crypto.randomUUID();
    cookies.set("userid", userId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return userId;
}

export const load: PageServerLoad = async ({ cookies }) => {
  const userId = getUserID(cookies);
  const tasks = await getTasks(userId);
  return { tasks };
};

export const actions: Actions = {
  create: async ({ request, cookies }) => {
    const userId = getUserID(cookies);
    const data = await request.formData();

    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const dateStr = data.get("date") as string;

    if (!title) {
      return fail(400, { missing: true, message: "Title がない" });
    }

    // 日付 空文字対策
    const date = dateStr ? new Date(dateStr) : new Date();

    await createTask(userId, title, description, date);
  },

  update: async ({ request, cookies }) => {
    const userId = getUserID(cookies);
    const data = await request.formData();

    const id = data.get("id") as string;
    if (!id) return fail(400, { message: "IDがみつかりませんでした。" });

    // HTML のチェックボックスは、チェックされているときだけフォームに送信される。
    // formDataにdoneがあればチェックが付いているということ。
    //const done = data.has('done');
    const done = data.get("done") === "true";

    // 他のフィールドも更新できるように取得
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const dateStr = data.get("date") as string;

    // 部分更新用のオブジェクトを作成 ※[todo]要理解深める
    const updates: any = { done };
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (dateStr) updates.date = new Date(dateStr);

    await updateTask(userId, id, updates);
  },

  delete: async ({ request, cookies }) => {
    const userId = getUserID(cookies);
    const data = await request.formData();

    const id = data.get("id") as string;
    if (!id) return fail(400, { message: "IDがみつかりませんでした。" });

    await deleteTask(userId, id);
  },
};

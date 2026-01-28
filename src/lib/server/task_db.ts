import { initialTasks } from './initialTasks.js';

// 型定義
export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date; // SSRでload->dataのときに文字列になる？要チェック。
  done: boolean;
}

// データベース (メモリ内)
// キーは userid (string)、値は Taskの配列
const db = new Map<string, Task[]>();

// Taskリストを取得する
export async function getTasks(userId: string): Promise<Task[]> {
  try {
    // 非同期通信のシミュレーション（100ms待機）
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (!db.has(userId)) {
      db.set(
        userId,
        initialTasks.map(t => ({
          id: crypto.randomUUID(),
          title: t.title,
          description: t.description,
          date: new Date(t.date), // 必要 initialには文字列で格納されている
          done: false
        }))
      );
    }

    // データが存在しない場合、空の配列で初期化
    // if (!db.has(userId)) {
    //   db.set(userId, []);
    // }

    const tasks = db.get(userId);

    if (!tasks) {
      throw new Error(`throw Error not found, userId: ${userId}`);
    }

    return tasks;

  } catch (error) {
    console.error(`ユーザーID: ${userId} のタスクを取得できませんでした`, error);
    throw error;
  }
}

export async function createTask(
  userId: string, 
  title: string, 
  description: string, 
  date: Date
): Promise<void> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (!db.has(userId)) {
      db.set(userId, []);
    }
    
    const tasks = db.get(userId);

    if (tasks) {
      tasks.push({
        id: crypto.randomUUID(),
        title,
        description,
        date,
        done: false
      });
    } else {
       throw new Error(`throw Error createTask, userId: ${userId}`);
    }

  } catch (error) {
    console.error(`catch error createTask,userId: ${userId}:`, error);
    throw error;
  }
}

export async function updateTask(
  userId: string, 
  taskId: string, 
  updates: Partial<Omit<Task, 'id'>>
): Promise<void> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const tasks = db.get(userId);

    if (tasks) {
      const index = tasks.findIndex((task) => task.id === taskId);

      if (index !== -1) {
        // 既存のタスクと更新内容をマージ
        tasks[index] = {
          ...tasks[index], // 既存全データを展開
          ...updates
        };
      } else {
        throw new Error(`throw Error, taskId: ${taskId} not found for userId: ${userId}.`);
      }
    } else {
        throw new Error(`throw Error, userId: ${userId} not found.`);
    }

  } catch (error) {
    console.error(`catch error updateTask, taskId: ${taskId} for user ${userId}:`, error);
    throw error;
  }
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const tasks = db.get(userId);

    if (tasks) {
      const index = tasks.findIndex((task) => task.id === taskId);

      if (index !== -1) {
        tasks.splice(index, 1);
      } else {
        console.warn(`Not found, taskId: ${taskId}`);
      }
    }

  } catch (error) {
    console.error(`Error deleteTask, taskId:  ${taskId} userId: ${userId}:`, error);
    throw error;
  }
}
"use strict";

export const STORAGE_VERSION = 1;

function cloneTasks(tasks) {
  return tasks.map((task) => ({ ...task }));
}

function isValidTask(task) {
  if (task === null || typeof task !== "object") return false;

  if (!Number.isSafeInteger(task.id) || task.id <= 0) {
    return false;
  }

  if (
    typeof task.title !== "string" ||
    task.title.trim().length < 1 ||
    task.title.trim().length > 100
  ) {
    return false;
  }

  if (typeof task.completed !== "boolean") {
    return false;
  }

  if (!["low", "medium", "high"].includes(task.priority)) {
    return false;
  }

  return true;
}

export function isValidTaskList(value) {
  if (!Array.isArray(value)) {
    return false;
  }

  const ids = new Set();

  for (const task of value) {
    if (!isValidTask(task)) {
      return false;
    }

    if (ids.has(task.id)) {
      return false;
    }

    ids.add(task.id);
  }

  return true;
}

export function loadTasks(storage, key, fallbackTasks) {
  const fallback = cloneTasks(fallbackTasks);

  try {
    const raw = storage.getItem(key);

    if (raw === null) {
      return {
        ok: true,
        source: "initial",
        tasks: fallback
      };
    }

    const parsed = JSON.parse(raw);

    if (parsed === null || typeof parsed !== "object") {
      return {
        ok: false,
        source: "fallback",
        tasks: fallback,
        error: "Сохранённые данные имеют неверный формат."
      };
    }

    if (parsed.version !== STORAGE_VERSION) {
      return {
        ok: false,
        source: "fallback",
        tasks: fallback,
        error: "Версия сохранённых данных не поддерживается."
      };
    }

    if (!isValidTaskList(parsed.tasks)) {
      return {
        ok: false,
        source: "fallback",
        tasks: fallback,
        error: "Сохранённый список задач имеет неверную структуру."
      };
    }

    return {
      ok: true,
      source: "storage",
      tasks: cloneTasks(parsed.tasks)
    };
  } catch (error) {
    return {
      ok: false,
      source: "fallback",
      tasks: fallback,
      error: "Не удалось прочитать сохранённые данные."
    };
  }
}

export function saveTasks(storage, key, tasks) {
  if (!isValidTaskList(tasks)) {
    return {
      ok: false,
      error: "Нельзя сохранить некорректный список задач."
    };
  }

  try {
    const payload = {
      version: STORAGE_VERSION,
      tasks: cloneTasks(tasks)
    };

    storage.setItem(key, JSON.stringify(payload));

    return {
      ok: true
    };
  } catch (error) {
    return {
      ok: false,
      error: "Не удалось сохранить данные."
    };
  }
}

export function removeSavedTasks(storage, key) {
  try {
    storage.removeItem(key);

    return {
      ok: true
    };
  } catch (error) {
    return {
      ok: false,
      error: "Не удалось удалить сохранённые данные."
    };
  }
}
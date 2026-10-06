"use strict";

const validPriorities = ["low", "medium", "high"];

function validateId(id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return {
      ok: false,
      error: "id должен быть положительным безопасным целым числом"
    };
  }

  return {
    ok: true
  };
}

function validateTitle(title) {
  if (typeof title !== "string") {
    return {
      ok: false,
      error: "Название задачи должно быть строкой"
    };
  }

  const normalizedTitle = title.trim();

  if (
    normalizedTitle.length < 1 ||
    normalizedTitle.length > 100
  ) {
    return {
      ok: false,
      error: "Название задачи должно содержать от 1 до 100 символов"
    };
  }

  return {
    ok: true,
    title: normalizedTitle
  };
}

function validatePriority(priority) {
  if (!validPriorities.includes(priority)) {
    return {
      ok: false,
      error: "Приоритет должен быть low, medium или high"
    };
  }

  return {
    ok: true
  };
}

export function createTask(
  id,
  title,
  priority = "medium"
) {
  const idResult = validateId(id);

  if (!idResult.ok) {
    return idResult;
  }

  const titleResult = validateTitle(title);

  if (!titleResult.ok) {
    return titleResult;
  }

  const priorityResult =
    validatePriority(priority);

  if (!priorityResult.ok) {
    return priorityResult;
  }

  return {
    ok: true,
    task: {
      id,
      title: titleResult.title,
      completed: false,
      priority
    }
  };
}

export function findTaskById(tasks, id) {
  return tasks.find(
    (task) => task.id === id
  );
}

export function getPendingTasks(tasks) {
  return tasks.filter(
    (task) => task.completed === false
  );
}

export function getTaskTitles(tasks) {
  return tasks.map(
    (task) => task.title
  );
}

export function getTaskStats(tasks) {
  const total = tasks.length;

  let completed = 0;

  for (const task of tasks) {
    if (task.completed === true) {
      completed += 1;
    }
  }

  const pending = total - completed;

  const progress =
    total === 0
      ? 0
      : (completed / total) * 100;

  return {
    total,
    completed,
    pending,
    progress
  };
}

export function addTask(
  tasks,
  id,
  title,
  priority = "medium"
) {
  const idResult = validateId(id);

  if (!idResult.ok) {
    return idResult;
  }

  const existingTask =
    findTaskById(tasks, id);

  if (existingTask !== undefined) {
    return {
      ok: false,
      error: `Задача с id ${id} уже существует`
    };
  }

  const taskResult =
    createTask(
      id,
      title,
      priority
    );

  if (!taskResult.ok) {
    return taskResult;
  }

  return {
    ok: true,
    tasks: [
      ...tasks,
      taskResult.task
    ]
  };
}

export function setTaskCompleted(
  tasks,
  id,
  completed
) {
  const idResult = validateId(id);

  if (!idResult.ok) {
    return idResult;
  }

  if (typeof completed !== "boolean") {
    return {
      ok: false,
      error: "completed должен быть логическим значением"
    };
  }

  const task =
    findTaskById(tasks, id);

  if (task === undefined) {
    return {
      ok: false,
      error: `Задача с id ${id} не найдена`
    };
  }

  const updatedTasks =
    tasks.map((currentTask) => {
      if (currentTask.id !== id) {
        return currentTask;
      }

      return {
        ...currentTask,
        completed
      };
    });

  return {
    ok: true,
    tasks: updatedTasks
  };
}

export function renameTask(
  tasks,
  id,
  title
) {
  const idResult = validateId(id);

  if (!idResult.ok) {
    return idResult;
  }

  const titleResult =
    validateTitle(title);

  if (!titleResult.ok) {
    return titleResult;
  }

  const task =
    findTaskById(tasks, id);

  if (task === undefined) {
    return {
      ok: false,
      error: `Задача с id ${id} не найдена`
    };
  }

  const updatedTasks =
    tasks.map((currentTask) => {
      if (currentTask.id !== id) {
        return currentTask;
      }

      return {
        ...currentTask,
        title: titleResult.title
      };
    });

  return {
    ok: true,
    tasks: updatedTasks
  };
}

export function removeTask(
  tasks,
  id
) {
  const idResult = validateId(id);

  if (!idResult.ok) {
    return idResult;
  }

  const task =
    findTaskById(tasks, id);

  if (task === undefined) {
    return {
      ok: false,
      error: `Задача с id ${id} не найдена`
    };
  }

  return {
    ok: true,
    tasks: tasks.filter(
      (currentTask) =>
        currentTask.id !== id
    )
  };
}

export function updateTask(
  tasks,
  id,
  title,
  priority
) {
  const idResult = validateId(id);

  if (!idResult.ok) {
    return idResult;
  }

  const titleResult =
    validateTitle(title);

  if (!titleResult.ok) {
    return titleResult;
  }

  const priorityResult =
    validatePriority(priority);

  if (!priorityResult.ok) {
    return priorityResult;
  }

  const task =
    findTaskById(tasks, id);

  if (task === undefined) {
    return {
      ok: false,
      error: `Задача с id ${id} не найдена`
    };
  }

  const updatedTasks =
    tasks.map((currentTask) => {
      if (currentTask.id !== id) {
        return currentTask;
      }

      return {
        ...currentTask,
        title: titleResult.title,
        priority
      };
    });

  return {
    ok: true,
    tasks: updatedTasks
  };
}
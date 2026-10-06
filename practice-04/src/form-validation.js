"use strict";

function validateId(id) {
  if (
    !Number.isSafeInteger(id) ||
    id <= 0
  ) {
    return false;
  }

  return true;
}

function validateTitle(title) {
  if (typeof title !== "string") {
    return false;
  }

  const normalizedTitle =
    title.trim();

  return (
    normalizedTitle.length >= 1 &&
    normalizedTitle.length <= 100
  );
}

function validatePriority(priority) {
  return [
    "low",
    "medium",
    "high"
  ].includes(priority);
}

export function validateTaskDraft(
  draft,
  tasks,
  editingId = null
) {
  const errors = {};

  let id;

  if (editingId !== null) {
    id = editingId;

    if (!validateId(id)) {
      errors.id =
        "Некорректный идентификатор задачи.";
    } else if (
      !tasks.some(
        (task) => task.id === id
      )
    ) {
      errors.id =
        `Задача с id ${id} не найдена.`;
    }
  } else {
    if (
      typeof draft.id !== "string" &&
      typeof draft.id !== "number"
    ) {
      errors.id =
        "Введите идентификатор задачи.";
    } else if (
      String(draft.id).trim() === ""
    ) {
      errors.id =
        "Введите идентификатор задачи.";
    } else {
      id = Number(draft.id);

      if (!validateId(id)) {
        errors.id =
          "id должен быть положительным целым числом.";
      } else if (
        tasks.some(
          (task) => task.id === id
        )
      ) {
        errors.id =
          `Задача с id ${id} уже существует.`;
      }
    }
  }

  if (
    typeof draft.title !== "string"
  ) {
    errors.title =
      "Название задачи должно быть строкой.";
  } else {
    const normalizedTitle =
      draft.title.trim();

    if (
      normalizedTitle.length < 1
    ) {
      errors.title =
        "Название задачи не может быть пустым.";
    } else if (
      normalizedTitle.length > 100
    ) {
      errors.title =
        "Название задачи должно содержать не более 100 символов.";
    }
  }

  if (
    !validatePriority(
      draft.priority
    )
  ) {
    errors.priority =
      "Выберите допустимый приоритет.";
  }

  if (
    Object.keys(errors).length > 0
  ) {
    return {
      ok: false,
      errors
    };
  }

  return {
    ok: true,
    value: {
      id,
      title: draft.title.trim(),
      priority: draft.priority
    }
  };
}
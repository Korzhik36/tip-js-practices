"use strict";

import { getTaskStats } from "./task-service.js";

export function createTaskElement(task) {
  const listItem = document.createElement("li");
  listItem.className = "task-card";
  listItem.dataset.taskId = String(task.id);

  if (task.completed) {
    listItem.classList.add("is-completed");
  }

  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = task.title;

  const status = document.createElement("div");
  status.className = "task-status";
  status.textContent = task.completed ? "Выполнена" : "В работе";

  const priority = document.createElement("div");
  priority.className = "task-priority";

  const priorityNames = {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий"
  };

  priority.textContent = priorityNames[task.priority];

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.dataset.action = "toggle";
  toggleButton.setAttribute(
    "aria-pressed",
    String(task.completed)
  );

  const toggleLabel = document.createElement("span");
  toggleLabel.className = "action-label";
  toggleLabel.textContent = "Выполнена";

  toggleButton.append(toggleLabel);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";

  const deleteLabel = document.createElement("span");
  deleteLabel.className = "action-label";
  deleteLabel.textContent = "Удалить";

  deleteButton.append(deleteLabel);

  actions.append(toggleButton, deleteButton);

  listItem.append(title, status, priority, actions);

  return listItem;
}

export function renderTaskList(listElement, tasks) {
  const taskElements = tasks.map((task) => createTaskElement(task));

  listElement.replaceChildren(...taskElements);
}

export function renderSummary(summaryElement, tasks, visibleCount) {
  const stats = getTaskStats(tasks);

  const totalElement = summaryElement.querySelector(
    '[data-stat="total"]'
  );

  const completedElement = summaryElement.querySelector(
    '[data-stat="completed"]'
  );

  const pendingElement = summaryElement.querySelector(
    '[data-stat="pending"]'
  );

  const progressElement = summaryElement.querySelector(
    '[data-stat="progress"]'
  );

  const visibleElement = summaryElement.querySelector(
    '[data-stat="visible"]'
  );

  totalElement.textContent = String(stats.total);
  completedElement.textContent = String(stats.completed);
  pendingElement.textContent = String(stats.pending);
  progressElement.textContent = `${stats.progress.toFixed(1)}%`;
  visibleElement.textContent = String(visibleCount);
}

export function renderEmptyState(messageElement, total, visibleCount) {
  if (total === 0 && visibleCount === 0) {
    messageElement.textContent = "Список задач пуст.";
    messageElement.hidden = false;
    return;
  }

  if (total > 0 && visibleCount === 0) {
    messageElement.textContent = "Нет задач по выбранному фильтру.";
    messageElement.hidden = false;
    return;
  }

  messageElement.textContent = "";
  messageElement.hidden = true;
}
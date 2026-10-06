"use strict";

import { demoTasks } from "./data.js";

import {
  findTaskById,
  setTaskCompleted,
  removeTask,
  getTaskStats
} from "./task-service.js";

import { getVisibleTasks } from "./task-selectors.js";

import {
  renderTaskList,
  renderSummary,
  renderEmptyState
} from "./task-view.js";

const taskListElement = document.querySelector("#task-list");
const summaryElement = document.querySelector("#task-summary");
const emptyMessageElement = document.querySelector("#empty-message");
const errorMessageElement = document.querySelector("#operation-message");
const filterButtons = document.querySelectorAll("[data-filter]");

let currentTasks = [...demoTasks];
let currentFilter = "all";

function showError(message) {
  errorMessageElement.textContent = message;
}

function clearError() {
  errorMessageElement.textContent = "";
}

function updateActiveFilter() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderApp() {
  const visibleTasks = getVisibleTasks(
    currentTasks,
    currentFilter
  );

  renderTaskList(
    taskListElement,
    visibleTasks
  );

  renderSummary(
    summaryElement,
    currentTasks,
    visibleTasks.length
  );

  renderEmptyState(
    emptyMessageElement,
    currentTasks.length,
    visibleTasks.length
  );

  updateActiveFilter();
}

function restoreTaskFocus(id, action) {
  const selector =
    `li[data-task-id="${id}"] button[data-action="${action}"]`;

  const button = taskListElement.querySelector(selector);

  if (button) {
    button.focus();
  }
}

function handleTaskListClick(event) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const button = event.target.closest(
    "button[data-action]"
  );

  if (!button || !taskListElement.contains(button)) {
    return;
  }

  const action = button.dataset.action;

  if (
    action !== "toggle" &&
    action !== "delete"
  ) {
    return;
  }

  const taskCard = button.closest(
    "li[data-task-id]"
  );

  if (
    !taskCard ||
    !taskListElement.contains(taskCard)
  ) {
    return;
  }

  const id = Number(taskCard.dataset.taskId);

  if (
    !Number.isSafeInteger(id) ||
    id <= 0
  ) {
    showError(
      "Некорректный идентификатор задачи."
    );
    return;
  }

  let result;

  if (action === "toggle") {
    const task = findTaskById(
      currentTasks,
      id
    );

    if (task === undefined) {
      showError(
        `Задача с id ${id} не найдена.`
      );
      return;
    }

    result = setTaskCompleted(
      currentTasks,
      id,
      !task.completed
    );
  } else {
    result = removeTask(
      currentTasks,
      id
    );
  }

  if (!result.ok) {
    showError(result.error);
    return;
  }

  currentTasks = result.tasks;

  clearError();

  renderApp();

  if (action === "toggle") {
    restoreTaskFocus(
      id,
      action
    );
  }
}

function handleFilterClick(event) {
  if (
    !(event.currentTarget instanceof HTMLButtonElement)
  ) {
    return;
  }

  const filter =
    event.currentTarget.dataset.filter;

  if (
    filter !== "all" &&
    filter !== "pending" &&
    filter !== "completed"
  ) {
    return;
  }

  currentFilter = filter;

  clearError();

  renderApp();

  const activeFilterButton =
    document.querySelector(
      `[data-filter="${currentFilter}"]`
    );

  if (activeFilterButton) {
    activeFilterButton.focus();
  }
}

taskListElement.addEventListener(
  "click",
  handleTaskListClick
);

filterButtons.forEach((button) => {
  button.addEventListener(
    "click",
    handleFilterClick
  );
});

renderApp();

const initialStats =
  getTaskStats(currentTasks);

console.log(
  `ПР3 запущена: ${initialStats.total} задач, ` +
  `${initialStats.completed} выполнено, ` +
  `${initialStats.pending} в работе`
);
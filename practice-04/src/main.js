import { demoTasks, variantTasks, variantNumber } from "./data.js";
import {
  addTask,
  findTaskById,
  removeTask,
  setTaskCompleted,
  updateTask,
} from "./task-service.js";
import { getVisibleTasks } from "./task-selectors.js";
import {
  renderEmptyState,
  renderSummary,
  renderTaskList,
} from "./task-view.js";
import { validateTaskDraft } from "./form-validation.js";
import {
  loadTasks,
  removeSavedTasks,
  saveTasks,
} from "./task-storage.js";

const elements = {
  list: document.querySelector("#task-list"),
  filters: document.querySelector("#task-filters"),
  summary: document.querySelector("#task-summary"),
  empty: document.querySelector("#empty-message"),
  message: document.querySelector("#operation-message"),
  datasetLabel: document.querySelector("#dataset-label"),
  storageStatus: document.querySelector("#storage-status"),
  form: document.querySelector("#task-form"),
  formHeading: document.querySelector("#form-heading"),
  formMode: document.querySelector("#form-mode"),
  formMessage: document.querySelector("#form-message"),
  idInput: document.querySelector("#task-id"),
  titleInput: document.querySelector("#task-title"),
  priorityInput: document.querySelector("#task-priority"),
  submitButton: document.querySelector("#form-submit"),
  cancelButton: document.querySelector("#cancel-edit"),
  resetButton: document.querySelector("#reset-data"),
};

const params = new URLSearchParams(window.location.search);
const isVariant = params.get("dataset") === "variant";
const isCheckRun = params.get("mode") === "check";

const initialTasks = isVariant ? variantTasks : demoTasks;
const datasetName = isVariant ? "variant" : "demo";

const storageKey = isCheckRun
  ? `tip-js-practice-04:checks:${datasetName}`
  : `tip-js-practice-04:${datasetName}`;

let loaded;

try {
  loaded = loadTasks(window.localStorage, storageKey, initialTasks);
} catch (error) {
  loaded = {
    ok: false,
    source: "fallback",
    tasks: initialTasks.map((task) => ({ ...task })),
    error: `Хранилище не инициализировано: ${error.message}`,
  };

  console.error(error);
}

let currentTasks = loaded.tasks;
let currentFilter = "all";
let editingId = null;

elements.datasetLabel.textContent = isVariant
  ? `Индивидуальный вариант: ${variantNumber ?? "не указан"}`
  : "Общий контрольный набор";

if (loaded.source === "storage") {
  elements.storageStatus.textContent =
    "Данные восстановлены из localStorage.";
} else if (loaded.ok) {
  elements.storageStatus.textContent =
    "Используется исходный набор; сохранённых данных пока нет.";
} else {
  elements.storageStatus.textContent = loaded.error;
  elements.storageStatus.classList.add("is-warning");
}

/* ---------- Отрисовка ---------- */

function renderApp() {
  const visibleTasks = getVisibleTasks(currentTasks, currentFilter);

  renderTaskList(elements.list, visibleTasks);
  renderSummary(elements.summary, currentTasks, visibleTasks.length);
  renderEmptyState(
    elements.empty,
    currentTasks.length,
    visibleTasks.length,
  );

  const filterButtons = elements.filters.querySelectorAll(
    "[data-filter]",
  );

  for (const button of filterButtons) {
    const isActive =
      button.dataset.filter === currentFilter;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

/* ---------- Ошибки формы ---------- */

function clearFieldError(name) {
  const input = elements.form.elements.namedItem(name);
  const message = elements.form.querySelector(
    `[data-error-for="${name}"]`,
  );

  if (
    input instanceof HTMLInputElement ||
    input instanceof HTMLSelectElement
  ) {
    input.setCustomValidity("");
    input.removeAttribute("aria-invalid");
  }

  if (message) {
    message.textContent = "";
  }
}

function clearFormErrors() {
  for (const name of ["id", "title", "priority"]) {
    clearFieldError(name);
  }

  elements.formMessage.textContent = "";
}

function showFormErrors(errors) {
  clearFormErrors();

  for (const [name, text] of Object.entries(errors)) {
    const input = elements.form.elements.namedItem(name);
    const message = elements.form.querySelector(
      `[data-error-for="${name}"]`,
    );

    if (
      input instanceof HTMLInputElement ||
      input instanceof HTMLSelectElement
    ) {
      input.setCustomValidity(text);
      input.setAttribute("aria-invalid", "true");
    }

    if (message) {
      message.textContent = text;
    }
  }

  elements.formMessage.textContent =
    "Проверьте данные формы.";

  elements.form.reportValidity();
}

/* ---------- Режим формы ---------- */

function setFormMode(id = null) {
  clearFormErrors();

  if (id === null) {
    editingId = null;

    elements.form.reset();

    elements.idInput.disabled = false;

    elements.formHeading.textContent = "Добавление задачи";
    elements.formMode.textContent = "Создание новой задачи";
    elements.submitButton.textContent = "Добавить задачу";

    elements.cancelButton.hidden = true;

    elements.idInput.focus();

    return true;
  }

  const task = findTaskById(currentTasks, id);

  if (task === undefined) {
    elements.message.textContent =
      `Задача с id ${id} не найдена.`;

    return false;
  }

  editingId = id;

  elements.idInput.value = String(task.id);
  elements.titleInput.value = task.title;
  elements.priorityInput.value = task.priority;

  elements.idInput.disabled = true;

  elements.formHeading.textContent = "Редактирование задачи";
  elements.formMode.textContent = `Редактирование задачи #${id}`;
  elements.submitButton.textContent = "Сохранить изменения";

  elements.cancelButton.hidden = false;

  elements.titleInput.focus();

  return true;
}

/* ---------- Сохранение ---------- */

function persistCurrentTasks(successMessage) {
  const saved = saveTasks(
    window.localStorage,
    storageKey,
    currentTasks,
  );

  elements.storageStatus.classList.toggle(
    "is-warning",
    !saved.ok,
  );

  elements.storageStatus.textContent = saved.ok
    ? "Изменения сохранены в localStorage."
    : saved.error;

  elements.message.textContent = saved.ok
    ? successMessage
    : `${successMessage} ${saved.error}`;

  renderApp();

  return saved;
}

/* ---------- Фокус после действия ---------- */

function restoreTaskFocus(id, action) {
  const actionButton = elements.list.querySelector(
    `[data-task-id="${id}"] button[data-action="${action}"]`,
  );

  const filterButton = elements.filters.querySelector(
    `[data-filter="${currentFilter}"]`,
  );

  (actionButton ?? filterButton)?.focus();
}

/* ---------- Отправка формы ---------- */

function handleFormSubmit(event) {
  event.preventDefault();

  const draft = {
    id: elements.idInput.value,
    title: elements.titleInput.value,
    priority: elements.priorityInput.value,
  };

  const validation = validateTaskDraft(
    draft,
    currentTasks,
    editingId,
  );

  if (!validation.ok) {
    showFormErrors(validation.errors);
    return;
  }

  let result;

  if (editingId === null) {
    result = addTask(
      currentTasks,
      validation.value.id,
      validation.value.title,
      validation.value.priority,
    );
  } else {
    result = updateTask(
      currentTasks,
      editingId,
      validation.value.title,
      validation.value.priority,
    );
  }

  if (!result.ok) {
    elements.formMessage.textContent = result.error;
    return;
  }

  currentTasks = result.tasks;

  const successMessage =
    editingId === null
      ? "Задача добавлена."
      : "Задача изменена.";

  setFormMode();

  persistCurrentTasks(successMessage);
}

/* ---------- Кнопки карточек ---------- */

function handleTaskListClick(event) {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const card = button.closest("[data-task-id]");

  if (!card) {
    return;
  }

  const id = Number(card.dataset.taskId);
  const action = button.dataset.action;

  if (!Number.isSafeInteger(id)) {
    return;
  }

  if (action === "edit") {
    setFormMode(id);
    return;
  }

  if (action === "toggle") {
    const task = findTaskById(currentTasks, id);

    if (task === undefined) {
      elements.message.textContent =
        `Задача с id ${id} не найдена.`;
      return;
    }

    const result = setTaskCompleted(
      currentTasks,
      id,
      !task.completed,
    );

    if (!result.ok) {
      elements.message.textContent = result.error;
      return;
    }

    currentTasks = result.tasks;

    persistCurrentTasks("Статус задачи изменён.");
    restoreTaskFocus(id, "toggle");

    return;
  }

  if (action === "delete") {
    const result = removeTask(currentTasks, id);

    if (!result.ok) {
      elements.message.textContent = result.error;
      return;
    }

    currentTasks = result.tasks;

    if (editingId === id) {
      setFormMode();
    }

    persistCurrentTasks("Задача удалена.");

    const filterButton = elements.filters.querySelector(
      `[data-filter="${currentFilter}"]`,
    );

    filterButton?.focus();
  }
}

/* ---------- Фильтры ---------- */

function handleFilterClick(event) {
  const button = event.target.closest("[data-filter]");

  if (!button) {
    return;
  }

  const filter = button.dataset.filter;

  if (!["all", "pending", "completed"].includes(filter)) {
    return;
  }

  currentFilter = filter;

  renderApp();
}

/* ---------- Сброс ---------- */

function handleResetClick() {
  try {
    const removed = removeSavedTasks(
      window.localStorage,
      storageKey,
    );

    currentTasks = initialTasks.map((task) => ({ ...task }));
    currentFilter = "all";

    setFormMode();

    elements.message.textContent = removed.ok
      ? "Сохранённые данные удалены. Восстановлен исходный набор."
      : `Исходный набор восстановлен. ${removed.error}`;

    elements.storageStatus.classList.toggle(
      "is-warning",
      !removed.ok,
    );

    elements.storageStatus.textContent = removed.ok
      ? "Используется исходный набор; сохранённых данных пока нет."
      : removed.error;

    renderApp();
  } catch (error) {
    elements.message.textContent =
      `Ошибка сброса: ${error.message}`;

    console.error(error);
  }
}

/* ---------- События ---------- */

elements.form.addEventListener(
  "submit",
  handleFormSubmit,
);

elements.form.addEventListener("input", (event) => {
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLSelectElement
  ) {
    clearFieldError(event.target.name);
  }
});

elements.list.addEventListener(
  "click",
  handleTaskListClick,
);

elements.filters.addEventListener(
  "click",
  handleFilterClick,
);

elements.cancelButton.addEventListener(
  "click",
  () => setFormMode(),
);

elements.resetButton.addEventListener(
  "click",
  handleResetClick,
);

/* ---------- Запуск ---------- */

try {
  setFormMode();
  renderApp();
} catch (error) {
  elements.message.textContent =
    `Ошибка запуска: ${error.message}`;

  console.error(error);
}
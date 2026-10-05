"use strict";

import { demoTasks, variantTasks, variantNumber } from "./data.js";

import {
  createTask,
  findTaskById,
  getPendingTasks,
  getTaskTitles,
  getTaskStats,
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask
} from "./task-service.js";

function printStats(title, tasks) {
  const { total, completed, pending, progress } = getTaskStats(tasks);

  console.log(title);
  console.log(`Всего: ${total}`);
  console.log(`Выполнено: ${completed}`);
  console.log(`Осталось: ${pending}`);

  if (total === 0) {
    console.log("Задач пока нет");
  } else {
    console.log(`Прогресс: ${progress.toFixed(1)}%`);
  }

  console.log();
}

function printTasks(tasks) {
  for (const task of tasks) {
    console.log(
      `id=${task.id}; ${task.title}; выполнено=${task.completed}; приоритет=${task.priority}`
    );
  }

  console.log();
}

function applyResult(currentTasks, result, operationName) {
  if (!result.ok) {
    console.error(`Ошибка (${operationName}): ${result.error}`);
    return currentTasks;
  }

  return result.tasks;
}

console.log("========================================");
console.log("ОБЩИЙ СЦЕНАРИЙ");
console.log("========================================");

let currentTasks = demoTasks;

console.log("Исходные задачи:");
printTasks(currentTasks);

console.log("Названия:");
console.log(getTaskTitles(currentTasks));
console.log();

console.log("Невыполненные задачи:");
console.log(getPendingTasks(currentTasks));
console.log();

printStats("Исходная сводка:", currentTasks);

let result = addTask(
  currentTasks,
  20,
  "Добавить проверку",
  "high"
);

currentTasks = applyResult(currentTasks, result, "добавление");

printStats("После добавления id=20:", currentTasks);

result = setTaskCompleted(currentTasks, 4, true);

currentTasks = applyResult(
  currentTasks,
  result,
  "изменение completed"
);

printStats("После выполнения id=4:", currentTasks);

result = renameTask(
  currentTasks,
  10,
  "Подготовить инструкцию запуска"
);

currentTasks = applyResult(
  currentTasks,
  result,
  "переименование"
);

printStats("После переименования id=10:", currentTasks);

result = removeTask(currentTasks, 7);

currentTasks = applyResult(
  currentTasks,
  result,
  "удаление"
);

printStats("После удаления id=7:", currentTasks);

console.log("Попытка повторно добавить id=20:");

result = addTask(
  currentTasks,
  20,
  "Повторная задача",
  "low"
);

if (!result.ok) {
  console.error(`Ожидаемый отказ: ${result.error}`);
}

console.log();

console.log("Итоговые задачи общего сценария:");
printTasks(currentTasks);

console.log("Исходный demoTasks после всех операций:");
printTasks(demoTasks);

printStats("Сводка исходного demoTasks:", demoTasks);


console.log("========================================");
console.log(`ИНДИВИДУАЛЬНЫЙ ВАРИАНТ №${variantNumber}`);
console.log("========================================");

let variantCurrentTasks = variantTasks;

console.log("Исходные задачи варианта:");
printTasks(variantCurrentTasks);

printStats(
  "Начальная сводка варианта:",
  variantCurrentTasks
);

result = addTask(
  variantCurrentTasks,
  80,
  "Проверить финальный интерфейс",
  "low"
);

variantCurrentTasks = applyResult(
  variantCurrentTasks,
  result,
  "добавление id=80"
);

printStats(
  "После добавления id=80:",
  variantCurrentTasks
);

result = setTaskCompleted(
  variantCurrentTasks,
  11,
  true
);

variantCurrentTasks = applyResult(
  variantCurrentTasks,
  result,
  "изменение id=11"
);

printStats(
  "После изменения id=11:",
  variantCurrentTasks
);

result = renameTask(
  variantCurrentTasks,
  23,
  "Проверить отображение компонентов"
);

variantCurrentTasks = applyResult(
  variantCurrentTasks,
  result,
  "переименование id=23"
);

printStats(
  "После переименования id=23:",
  variantCurrentTasks
);

result = removeTask(
  variantCurrentTasks,
  37
);

variantCurrentTasks = applyResult(
  variantCurrentTasks,
  result,
  "удаление id=37"
);

printStats(
  "После удаления id=37:",
  variantCurrentTasks
);

console.log("Повторная попытка добавить id=80:");

result = addTask(
  variantCurrentTasks,
  80,
  "Дубликат",
  "low"
);

if (!result.ok) {
  console.error(`Ожидаемый отказ: ${result.error}`);
}

console.log();

console.log("Итоговые задачи варианта:");
printTasks(variantCurrentTasks);

console.log("Исходный variantTasks:");
printTasks(variantTasks);

printStats(
  "Сводка исходного variantTasks:",
  variantTasks
);
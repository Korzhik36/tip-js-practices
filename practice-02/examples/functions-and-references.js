"use strict";

console.log("=== Эксперимент 1: sum ===");

function sum(a, b) {
  return a + b;
}

const sumNumbers = sum(2, 3);
const sumWithString = sum("2", 3);

console.log("sum(2, 3):", sumNumbers);
console.log("Тип:", typeof sumNumbers);

console.log('sum("2", 3):', sumWithString);
console.log("Тип:", typeof sumWithString);

console.log();


console.log("=== Эксперимент 2: стрелочная функция ===");

const square = (value) => {
  return value * value;
};

console.log("square(4):", square(4));

console.log();


console.log("=== Эксперимент 3: ссылка на объект ===");

const original = {
  title: "Черновик",
  published: false
};

const alias = original;

alias.published = true;

console.log("original:", original);
console.log("alias:", alias);
console.log("original === alias:", original === alias);

console.log();


console.log("=== Эксперимент 4: spread массива ===");

const tasks = [
  {
    id: 1,
    title: "Первая задача"
  },
  {
    id: 2,
    title: "Вторая задача"
  }
];

const copiedTasks = [...tasks];

console.log("Новый массив:", copiedTasks);
console.log("tasks === copiedTasks:", tasks === copiedTasks);
console.log(
  "tasks[0] === copiedTasks[0]:",
  tasks[0] === copiedTasks[0]
);

copiedTasks[0].title = "Изменено через копию";

console.log("Исходная задача:", tasks[0]);
console.log("Задача в копии:", copiedTasks[0]);

console.log();


console.log("=== Эксперимент 5: spread объекта ===");

const oldTask = {
  id: 10,
  title: "Старая задача",
  completed: false
};

const newTask = {
  ...oldTask,
  completed: true
};

console.log("oldTask:", oldTask);
console.log("newTask:", newTask);
console.log("oldTask === newTask:", oldTask === newTask);

console.log();


console.log("=== Эксперимент 6: параметр по умолчанию ===");

function makeCaption(text = "Без названия") {
  return text;
}

console.log("makeCaption():", makeCaption());
console.log("makeCaption(undefined):", makeCaption(undefined));
console.log("makeCaption(null):", makeCaption(null));
console.log('makeCaption(""):', makeCaption(""));
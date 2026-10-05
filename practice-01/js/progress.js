"use strict";

const totalTasks = 12;
const completedTasks = 5;

if (
  !Number.isFinite(totalTasks) ||
  !Number.isInteger(totalTasks) ||
  !Number.isFinite(completedTasks) ||
  !Number.isInteger(completedTasks)
) {
  console.log("Ошибка: количество задач должно быть целыми числами.");
} else if (
  totalTasks < 0 ||
  totalTasks > 1000 ||
  completedTasks < 0 ||
  completedTasks > totalTasks
) {
  console.log("Ошибка: указано недопустимое количество задач.");
} else if (totalTasks === 0 && completedTasks === 0) {
  console.log("Задач пока нет");
} else {
  const remainingTasks = totalTasks - completedTasks;
  const progress = (completedTasks / totalTasks) * 100;

  let status;

  if (completedTasks === 0) {
    status = "Не начато";
  } else if (completedTasks === totalTasks) {
    status = "Завершено";
  } else {
    status = "В работе";
  }

  console.log(`Всего задач: ${totalTasks}`);
  console.log(`Выполнено: ${completedTasks}`);
  console.log(`Осталось: ${remainingTasks}`);
  console.log(`Прогресс: ${progress.toFixed(1)}%`);
  console.log(`Статус: ${status}`);
}
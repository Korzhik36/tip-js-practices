"use strict";

const totalTasks = 18;
const completedTasks = 6;
const dailyLimit = 5;

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
} else if (
  !Number.isFinite(dailyLimit) ||
  !Number.isInteger(dailyLimit) ||
  dailyLimit < 1 ||
  dailyLimit > 1000
) {
  console.log("Ошибка: дневная норма должна быть целым числом от 1 до 1000.");
} else {
  let remainingTasks = totalTasks - completedTasks;
  let day = 0;

  console.log(`Осталось задач: ${remainingTasks}`);

  while (remainingTasks > 0) {
    day += 1;

    const completedToday = Math.min(dailyLimit, remainingTasks);
    remainingTasks -= completedToday;

    console.log(
      `День ${day}: выполнено ${completedToday}, осталось ${remainingTasks}`
    );
  }

  console.log(`Потребуется дней: ${day}`);
}
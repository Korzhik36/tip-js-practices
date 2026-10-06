# Практическая работа № 4

## Тема

Формы, валидация данных и сохранение состояния приложения в `localStorage`.

## Студент

Коржиков Александр

Группа: ЭФБО-05-25

Номер варианта: 6

## Цель работы

Цель практической работы — продолжить разработку интерфейса из практической работы № 3 и добавить полноценную форму создания и редактирования задач, прикладную и нативную валидацию, сохранение данных в `localStorage`, восстановление состояния после перезагрузки и обработку ошибок хранилища.

## Используемые технологии

- HTML5
- CSS3
- JavaScript
- ES Modules
- DOM API
- `localStorage`
- Node.js
- npm
- Git

## Окружение

- ОС: Windows
- Редактор: Visual Studio Code
- Node.js: v24.16.0
- npm: 11.13.0
- Git: 2.55.0.windows.5
- Браузер: Google Chrome

## 1. Перенос материалов ПР3

Для практической работы №4 были использованы результаты практической работы №3.

В новую работу перенесены модули:

- `data.js`
- `task-service.js`
- `task-selectors.js`
- `task-view.js`

Основной `main.js` ПР3 не переносился целиком, поскольку в ПР4 сценарий приложения был расширен формами, редактированием и сохранением данных.

## 2. Структура проекта

```text
practice-04/
├── README.md
├── package.json
├── index.html
├── styles.css
├── checks.html
├── checks/
│   ├── service.checks.js
│   ├── modules.checks.js
│   └── browser.checks.js
├── tools/
│   └── serve.mjs
└── src/
    ├── data.js
    ├── task-service.js
    ├── task-selectors.js
    ├── task-view.js
    ├── form-validation.js
    ├── task-storage.js
    └── main.js
## To-Do Manager

### Overview

The To-Do Manager is a project management application built with JavaScript, utilizing ES6 modules, Webpack, and local storage for persistent data management. It allows users to create projects, add tasks to those projects, and manage their to-do lists with an intuitive interface.

### Features

#### Project Management:

* [x] Create, update, and delete projects.

* [x] Set an active project to focus on specific tasks.

#### Task Management:

* [x] Add tasks with details such as title, description, due date, priority, and completion status.

* [x] Edit or delete tasks.

* [x] Tasks are scoped to their respective projects.

#### Persistence:

* [x]Data is stored in local storage, ensuring tasks and projects persist across sessions.

#### Dynamic UI:

* [x]Projects and tasks dynamically render in the DOM.

* [x] Highlight the active project for better user focus.

#### Webpack Integration:

* [x] ES6 modules and Webpack bundling ensure a modular and maintainable codebase.

### Installation

Prerequisites

Ensure you have the following installed:

Node.js

npm (Node Package Manager)

Steps

Clone the repository:

```
git clone 
cd todo-js
```

Install dependencies:

```
npm install
```
Start the development server:
```
npx webpack serve
```

Challenges

1. Synchronization Issues

Keeping the UI and local storage in sync was a significant challenge. For example, ensuring that adding a new task to a project dynamically updated both the local storage and the UI.

Solution:
Used centralized state management via a projectManager class to mediate interactions between the storage layer and the UI.

2. Managing Active States

Highlighting the active project and ensuring the correct project ID persisted across reloads required careful handling of local storage and DOM updates.

Solution:
Implemented methods to fetch and set the active project ID, which ensured consistency.

Future Enhancements

Search and Filter: Add the ability to search tasks by keywords and filter tasks by priority or due date.

User Authentication: Implement user accounts to store projects and tasks on a server for multi-device access.

Dark Mode: Add a toggle for light and dark themes.

How to Contribute

Fork the repository and clone it to your local machine.

Create a new branch for your feature or bug fix:

git checkout -b feature-name

Commit your changes and push them to your fork.

Create a pull request detailing your changes.

License

This project is licensed under the MIT License.


Uicons by <a href="https://www.flaticon.com/uicons">Flaticon</a> and icons8
import { projectManager, createProject } from "./projects"
import trash from "./assets/trash.png"
import logger, { getGreeting } from "./utils"
const { format } = require("date-fns")
const projectsEl = document.querySelector("[data-projects]")
const newProjectForm = document.querySelector("[data-new-project-form]")
const newProjectInput = document.querySelector("[data-new-project-input]")
const deleteProjects = document.getElementById("delete-projects")
const dateEl = document.getElementById("date")
const projectEl = document.querySelector(".main__project")
//const today = format(new Date(), "EEE do MMM yyyy")
const today = format(new Date(), "EEEE, MMM do")
dateEl.textContent = `Today, ${today}`
const projects = projectManager.getProjects()

const render = (() => {
  let project = projectManager.getActiveProject()


  const renderProjects = () => {
    let activeProjectId = projectManager.getActiveProjectId()
    clearElements(projectsEl)
    projects.forEach((project) => {
      const li = createProjectListEl(project, activeProjectId)
      projectsEl.append(li)
    })
  }

  const createProjectListEl = (project, activeProjectId) => {
    const li = document.createElement("li")
    li.setAttribute("class", "project__item")
    const img = document.createElement("img")
    li.dataset.projectId = project.id // Store project id for click events
    img.src = trash
    const text = document.createTextNode(` ${project.title} `)
    // Highlight active project
    if (project.id === activeProjectId) {
      li.classList.add("active-project")
    } else {
      li.classList.remove("active-project")
    }

    li.addEventListener("click", () => handleProjectChange(project.id))
    li.append(img)
    li.append(text)
    return li
  }

  const handleProjectChange = (projectId) => {
    projectManager.setActiveProjectId(projectId)
    renderContent()
  }

  const renderProject = () => {
    clearElements(projectEl)

    let project = projectManager.getActiveProject()
    // add current project tile
    const title = document.createElement("h1")
    if (project) {
      title.textContent = `${project.title} Tasks`
      projectEl.append(title)
      // show task list
      const tasksEl = document.createElement("ul")
      // show each task
      project.tasks.forEach((task) => {
        console.log(task.title)
        const li = renderTask(task)
        tasksEl.append(li)
      })
      // add task
      projectEl.append(tasksEl)
    } else {
      title.textContent = "No projects found. Add a project!"
    }
  }

  // DOM elements
// const form = document.getElementById('todo-form');
// const todoList = document.getElementById('todo-list');

// // Handle form submission
// form.addEventListener('submit', (event) => {
//   event.preventDefault(); // Prevent form from refreshing the page

//   // Get form values
//   const name = document.getElementById('task-name').value;
//   const description = document.getElementById('task-desc').value;
//   const dueDate = document.getElementById('task-date').value;
//   const priority = document.getElementById('task-priority').value;

//   // Create a new to-do using the factory
//   const newTodo = createTodo(name, description, dueDate, priority);

//   // Add the new to-do to the array
//   todos.push(newTodo);

//   // Update the display
//   renderTodos();

//   // Clear the form
//   form.reset();
// });
  const renderTask = (task) => {
    const li = createElementWithClass("li", "", "task__item")
    li.dataset.taskId = task.id // Store task id for click events
    if (task.completed) li.classList.add("completed");

    const content = createElementWithClass("div", "", "task__content")
    const priorityIndicator = document.createElement("div");
  priorityIndicator.className = "priority-indicator";
  priorityIndicator.dataset.priority = task.priority;
    const header = createElementWithClass('div', "", "task__header")
    const divLeft = createElementWithClass('div', "", "task__left")

    const checkbox = createElementWithClass("input", "", "checkbox")
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = !task.completed
      li.classList.toggle("completed", task.completed);
      projectManager.save()
    });

    const title = createElementWithClass("span", `${task.title}`, "task__title")
    const description = createElementWithClass("p", task.desc, "task__desc")
    const date = document.createElement('span')
    // description.textContent = task.desc
    date.textContent = `${format(new Date(task.dueDate), "MMM do yyyy")}`

    const options =  createElementWithClass('div', "", "task__options")

    const edit = createElementWithClass("button", "edit", "task__btn--edit")
    const del = createElementWithClass("button", "delete", "task__btn--del")
    divLeft.append(checkbox, title)
    options.append(edit, del)
    header.append(divLeft, date, options)

    content.append(header, description)
    li.append(priorityIndicator, content);
    return li
  }

  function handleTaskCompletion(task, taskElement) {
    task.completed = !task.completed;
  
    // Save the updated project data
    projectManager.save()
  
    // Update task display
    if (task.completed) {
      taskElement.classList.add("completed");
    } else {
      taskElement.classList.remove("completed");
    }
  
    // Re-render the tasks to move completed to the bottom
    //renderProject();
  }

  function createElementWithClass(tagName, text="", className, ...classList) {
    const element = document.createElement(tagName);
    element.classList.add(className, ...classList);
    if (text) element.textContent = text
    return element;
  }

  function renderAll() {
    clearElements(projectsEl)
    renderProjects()


  }

  const renderContent = () => {
    renderProjects()
    clearElements(projectEl)
    const greeting = `${getGreeting()} ${today}`
    const greetingEl = createElementWithClass("p", greeting, "greeting")
    projectEl.append(greetingEl)
    renderProject()
  }

  return { renderProjects, renderProject, renderContent }
})()

const clearElements = (element) => (element.innerHTML = "")

/* Event Listeners */

newProjectForm.addEventListener("submit", function (e) {
  e.preventDefault()

  // Validate
  const inputEl = newProjectInput.value
  if (inputEl == null || inputEl === "") return

  // Create and add project to local storage
  const project = createProject(inputEl)
  projectManager.addProject(project)
  // Reset input field
  newProjectInput.value = null

  // Update the UI
  render.renderContent()
})

deleteProjects.addEventListener("click", function () {
  projectManager.deleteProjects()
  projectManager.initializeProjects()
  render.renderContent()
})

export {render}

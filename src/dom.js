import { projectManager, createProject } from "./projects"
import trash from "./assets/trash.png"
import add from "./assets/add.png"
import logger, { getGreeting } from "./utils"
import trashSvg from "./assets/trash.svg"
import { deleteSVG } from "./assets/icons"

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
const form = document.getElementById("task__form")
const submitButton = document.querySelector("#task__btn")

import Task from "./tasks"
import { saveStorage } from "./storage"

const render = (() => {
  let project = projectManager.getActiveProject()

  const renderProjects = () => {
    let activeProjectId = projectManager.getActiveProjectId() || projects[0].id
    let projects = projectManager.getProjects()
    clearElements(projectsEl)
    projects.forEach((project) => {
      const li = createProjectListEl(project, activeProjectId)
      projectsEl.append(li)
    })
  }

  const createProjectListEl = (project, activeProjectId) => {
    const li = createElementWithClass("li", "", "project__item")    
    const img = document.createElement("svg")
    li.dataset.projectId = project.id // Store project id for click events
    // img.src = trashSvg
    // logger(img.src)
    // img.classList.add("project__img--del")

    const text = document.createTextNode(` ${project.title} `)
    // Highlight active project
    if (project.id === activeProjectId) {
      li.classList.add("active-project")
    } else {
      li.classList.remove("active-project")
    }
    const del = createElementWithClass("button", "", "project__btn--del", "btn")
    //img.src = trashSvg

    del.innerHTML = deleteSVG
    // Delete button functionality
    del.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent triggering the project change event when deleting

  
      if (project) {
        projectManager.deleteProject(project.id)
        
        if(activeProjectId == project.id) {
          projectManager.setActiveProjectId(projects[0].id)
        }
        projectManager.save()
        renderContent()
      }
  //     projectManager.deleteProject(project.id)

  // if(activeProjectId == project.id) {
  //   projectManager.setActiveProjectId(projects[0].id)
  //   renderContent()
  // }
  
  
  //   renderProjects()
  /*if (projectIndex !== -1) {
    // projects.splice(projectIndex, 1); // Remove the project from the array
    projectManager.save() // Update local storage
    renderContent(); // Re-render the list
  */
    })


    //del.append(img)
    li.addEventListener("click", () => handleProjectChange(project.id))
    li.append(text)

    if (project.id != projects[0].id) li.append(del)
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

    if (project) {
      const title = createElementWithClass(
        "div",
        `${project.title} Tasks`,
        "main__title"
      )

      const btn = createElementWithClass("button", "", "btn")
      const img = document.createElement("img")
      img.src = add
      img.alt = "add new task"
      btn.append(img)
      title.append(btn)
      projectEl.append(title)
      btn.addEventListener("click", () => {
        const modal = document.getElementById("task__form") // Get your modal element
        modal.style.display = "block" // Show the modal (assuming display: none by default)
      })
      // show task list
      const tasksEl = document.createElement("ul")
      // show each task
      project.tasks.forEach((task) => {
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
    if (task.completed) li.classList.add("completed")

    const content = createElementWithClass("div", "", "task__content")
    const priorityIndicator = document.createElement("div")
    priorityIndicator.className = "priority-indicator"
    priorityIndicator.dataset.priority = task.priority
    const header = createElementWithClass("div", "", "task__header")
    const divLeft = createElementWithClass("label", "", "task__left")

    const checkbox = createElementWithClass("input", "", "checkbox")
    checkbox.type = "checkbox"
    checkbox.checked = task.completed
    checkbox.addEventListener("change", () => {
      task.completed = !task.completed
      li.classList.toggle("completed", task.completed)
      projectManager.save()
    })

    const title = createElementWithClass("span", `${task.title}`, "task__title")
    const description = createElementWithClass("p", task.desc, "task__desc")
    const date = document.createElement("span")
    description.textContent = task.desc
    date.textContent = `${format(new Date(task.dueDate), "MMM do yyyy")}`

    const options = createElementWithClass("div", "", "task__options")

    const edit = createElementWithClass("button", "edit", "task__btn--edit")
    edit.addEventListener("click", (event) => {
      event.stopPropagation() // Prevent triggering parent element events
      //handleEditTask(task.id); // Pass task ID or object to your handler
      openEditModal(task)
    })

    const del = createElementWithClass("button", "delete", "task__btn--del")
    
    // Delete button functionality
    del.addEventListener("click", () => {
      projectManager.removeTask(task.id)
      renderProject() // Re-render the list
    })

    divLeft.append(checkbox, title)
    options.append(edit, del)
    header.append(divLeft, date, options)

    content.append(header, description)
    li.append(priorityIndicator, content)
    return li
  }

  // const openEditModal = (task) => {

  //   form.style.display='block'
  //     // Populate modal form fields
  //     document.querySelector('#task-title').value = task.title;
  //     document.querySelector('#task-desc').value = task.desc;
  //     document.querySelector('#task-priority').value = task.priority;
  //     document.querySelector('#task-date').value = task.dueDate;

  //     const updateBtn = document.querySelector('#task__btn')
  //     updateBtn.textContent = "Edit Task"
  //     // Save changes on form submission
  //     //const saveButton = document.querySelector('#save-edit');
  //     form.addEventListener("submit", (event) => {
  //       task.title = document.querySelector('#task-title').value;
  //       task.description = document.querySelector('#task-desc').value;
  //       task.priority = document.querySelector('#task-priority').value;
  //       task.dueDate = document.querySelector('#task-date').value;
  //       projectManager.updateTask(task); // Ensure this function updates local storage
  //       renderProject(); // Re-render tasks after update
  //       form.style.display='none'
  //       form.reset()

  //     })};

  function handleTaskCompletion(task, taskElement) {
    //task.completed = !task.completed
    task.toggleComplete()

    // Save the updated project data
    projectManager.save()

    // Update task display
    if (task.completed) {
      taskElement.classList.add("completed")
    } else {
      taskElement.classList.remove("completed")
    }
  }

  function createElementWithClass(tagName, text = "", className, ...classList) {
    const element = document.createElement(tagName)
    element.classList.add(className, ...classList)
    if (text) element.textContent = text
    return element
  }

  function renderAll() {
    clearElements(projectsEl)
    renderProjects()
  }

  const renderContent = () => {
    clearElements(projectsEl)
    renderProjects()
    clearElements(projectEl)
    const greeting = `${getGreeting()} ${today}`
    const greetingEl = createElementWithClass("p", greeting, "greeting")
    projectEl.append(greetingEl)
    renderProject()
    logger("rendering content")
  }

  return { renderProjects, renderProject, renderContent }
})()

const closeBtn = document.querySelector(".close-btn")
closeBtn.addEventListener("click", () => {
  form.style.display = "none"
})

form.addEventListener("submit", (event) => {
  event.preventDefault() // Prevent form from refreshing the page

  // Get form values
  const name = document.getElementById("task-title").value
  const description = document.getElementById("task-desc").value
  const dueDate = document.getElementById("task-date").value
  const priority = document.getElementById("task-priority").value

  // Create a new to-do using the factory
  const newTask = new Task(name, description, dueDate, priority)

  projectManager.addTaskToProject(newTask)
  // Add the new to-do to the array
  // todos.push(newTodo);

  // Update the display
  render.renderContent()

  // Clear the form
  form.reset()
  form.style.display = "none"
})

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

export { render }

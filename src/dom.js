import { projectManager, createProject } from "./projects"
import logger, { getGreeting } from "./utils"
import { deleteSVG } from "./assets/icons"
import addBtn from "./assets/icons8-add-64.png"
import listIcon from "./assets/icons8-list-64.png"
const { format, parseISO, formatISO } = require("date-fns")
const projectsEl = document.querySelector("[data-projects]")
const newProjectForm = document.querySelector("[data-new-project-form]")
const newProjectInput = document.querySelector("[data-new-project-input]")
const dateEl = document.getElementById("date")
const projectEl = document.querySelector(".main__project")
const today = format(new Date(), "EEEE, MMM do")
dateEl.textContent = `Today, ${today}`
const projects = projectManager.getProjects()
const form = document.getElementById("task__form")
const closeBtn = document.querySelector(".close-btn")
const main = document.querySelector(".main")
const render = (() => {
  let project = projectManager.getActiveProject()
  const greeting = `${getGreeting()} Today is ${today}`
    const greetingEl = createElementWithClass("p", greeting, "greeting")
    main.prepend(greetingEl)

  
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

    const text = document.createTextNode(` ${project.title} `)
    // Highlight active project
    if (project.id === activeProjectId) {
      li.classList.add("active-project")
    } else {
      li.classList.remove("active-project")
    }
    const del = createElementWithClass("button", "", "project__btn--del", "btn")

    del.innerHTML = deleteSVG
    // Delete button functionality
    del.addEventListener("click", (event) => {
      event.stopPropagation() // Prevent triggering the project change event when deleting

      if (project) {
        projectManager.deleteProject(project.id)

        if (activeProjectId == project.id) {
          projectManager.setActiveProjectId(projects[0].id)
        }
        projectManager.save()
        renderContent()
      }
    })

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
      const divLeft = createElementWithClass("div", "", "main__title--left")
      const title = createElementWithClass(
        "div",
        // `${project.title} Tasks`,
        "",
        "main__title"
      )

      const icon = document.createElement("img")
      const btn = createElementWithClass("button", "", "btn")
      const img = document.createElement("img")
      const name = `${project.title} Tasks`
      img.src = addBtn
      img.alt = "add new task"
      icon.src = listIcon
      divLeft.append(icon, name)
      btn.append(img)
      title.append(divLeft, btn)
      projectEl.append(title)
      btn.addEventListener("click", () => {
        form.style.display = "block" // Show the modal (assuming display: none by default)
        form.reset()
        form.dataset.taskId = ""
      })
      // show task list
      const tasksEl = document.createElement("ul")

      const sortedTasks = sortTasks(project.tasks)

      // show each task
      sortedTasks.forEach((task) => {
        const li = renderTask(task)
        tasksEl.append(li)
      })

      // add task
      projectEl.append(tasksEl)
    } else {
      title.textContent = "No projects found. Add a project!"
    }
  }

  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      if (a.completed === b.completed) return 0; // Keep original order for tasks with the same status
      return a.completed ? 1 : -1; // Move completed tasks to the bottom
    });
  };

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
      renderProject()
    })

    const title = createElementWithClass("span", `${task.title}`, "task__title")
    const description = createElementWithClass("p", task.desc, "task__desc")
    const date = document.createElement("span")
    description.textContent = task.desc

    date.textContent = `${format(parseISO(task.dueDate), "MMM do, yyyy")}`

    const options = createElementWithClass("div", "", "task__options")

    const edit = createElementWithClass("button", "edit", "task__btn--edit")
    edit.addEventListener("click", (event) => {
      event.stopPropagation() // Prevent triggering parent element events
      openEditModal(task)
    })

    const del = createElementWithClass("button", "delete", "task__btn--del")

    // Delete button functionality
    del.addEventListener("click", () => {
      projectManager.removeTask(task.id)
      projectManager.save()
      renderProject() // Re-render the list
    })

    divLeft.append(checkbox, title)
    options.append(edit, del)
    header.append(divLeft, date, options)

    content.append(header, description)
    li.append(priorityIndicator, content)
    return li
  }

  const openEditModal = (task) => {
    form.style.display = "block"

    // change form to edit modal with id
    form.dataset.taskId = task.id

    // Populate modal form fields
    document.querySelector("#task-title").value = task.title
    document.querySelector("#task-desc").value = task.desc || ""
    document.querySelector("#task-priority").value = task.priority

    // Handle the due date format
    if (task.dueDate) {
      // Ensure dueDate is in YYYY-MM-DD format
      const dueDate = task.dueDate.includes("T")
        ? task.dueDate.split("T")[0]
        : task.dueDate
      document.querySelector("#task-date").value = dueDate
      logger(`Due date is valid: ${dueDate}`)
    } else {
      console.error("Due date is missing or invalid:", task.dueDate)
    }

    // Update button text to indicate editing
    const updateBtn = document.querySelector("#task__btn")
    updateBtn.textContent = "Update Task"
  }

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

 

  const renderContent = () => {

    

    clearElements(projectsEl)
    renderProjects()
    clearElements(projectEl)
    renderProject()
    logger("rendering content")
  }

  const closeModal = () => {
    form.style.display = "none"
    form.reset()
  }

  closeBtn.addEventListener("click", () => {
    console.log("Close button clicked")
    form.style.display = "none"
    form.reset()
  })

  return { renderProjects, renderProject, renderContent, closeModal }
})()

/* Event Listeners */

form.addEventListener("submit", (event) => {
  event.preventDefault() // Prevent form from refreshing the page

  const taskId = form.dataset.taskId // Retrieve the task ID (if any)

  // Get form values

  const newTaskData = {
    id: taskId ? Number(taskId) : Date.now(), // Use existing ID for edits, or create new ID
    title: document.querySelector("#task-title").value,
    desc: document.querySelector("#task-desc").value,
    priority: document.querySelector("#task-priority").value,
    dueDate: document.querySelector("#task-date").value,
  }

  if (taskId) {
    // Edit task
    projectManager.updateTask(newTaskData)
    console.log("Task Edited:", newTaskData)
    // Add task
  } else {
    projectManager.addTaskToProject(newTaskData)
    console.log("Task Added:", newTaskData)
  }
  projectManager.save()

  // Update the display
  render.renderContent()

  // Clear the form
  render.closeModal()
})

const clearElements = (element) => (element.innerHTML = "")

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

export { render }

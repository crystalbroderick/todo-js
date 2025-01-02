import { projectManager, createProject } from "./projects"
import trash from "./assets/trash.png"
import logger from "./utils";
import demo from "./demo.js"
import { clearStorage } from "./storage.js";
const projectsEl = document.querySelector('[data-projects]')
const newProjectForm = document.querySelector('[data-new-project-form]')
const newProjectInput = document.querySelector('[data-new-project-input]')
const deleteProjects = document.getElementById('delete-projects')
const tasksEl = document.querySelector('[data-tasks]')
const dateEl = document.getElementById('date')
const container = document.querySelector('.container')
const { format } = require("date-fns");
import init from "./index"
//const { format } = require("date-fns");
const today = format(new Date(), 'EEE do MMM yyyy')
dateEl.textContent= `Today, ${today}`
const projects = projectManager.getProjects();


const render = (() => {

  const renderProjects = () => {
    let activeProjectId = projectManager.getActiveProjectId()

    clearElements(projectsEl);
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
    const text = document.createTextNode(` ${project.title} `);
    // Highlight active project
    if (project.id === activeProjectId) {
      li.classList.add('active-project');
    } else {
      li.classList.remove('active-project');
    }

    li.addEventListener('click', () => handleProjectChange(project.id))
    li.append(img)
    li.append(text)
    return li
  }

  const handleProjectChange = (projectId) => {
    projectManager.setActiveProjectId(projectId)
    renderContent()
  }

  const renderProject = () => {
    let project = projectManager.getActiveProject()
    // add current project tile
    const title = document.createElement('h1')
    clearElements(container)
    logger(project)
    if (project) {
   title.textContent = `${project.title} Tasks`
    container.append(title)
    renderTasks(project)} else { title.textContent = "No projects found. Add a project!"}
  }

  const renderTasks = (project) => {
    project.tasks.forEach(task => {
      const li = document.createElement("li")
      li.setAttribute("class", "task__item")
     // li.dataset.taskId = project.id // Store project id for click events
      const title = document.createTextNode(`${task.title}`)
      li.appendChild(title)
      container.append(li)
    })
  }

  const renderContent =()=> {
    renderProjects()
    renderProject()
  }


  return {renderProjects, renderProject, renderContent}
})();



const clearElements = (element) => element.innerHTML = ""

/* Event Listeners */


newProjectForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate
    const inputEl = newProjectInput.value
    if (inputEl == null || inputEl === '') return

    // Create and add project to local storage
    const project = createProject(inputEl)
    projectManager.addProject(project)
    // Reset input field
    newProjectInput.value = null

    // Update the UI
    render.renderContent()
})

deleteProjects.addEventListener("click",function() {
  projectManager.deleteProjects()
  projectManager.initializeProjects()
  render.renderContent()
})



export {render}
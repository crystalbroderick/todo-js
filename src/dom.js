import { projectManager, createProject } from "./projects"
import trash from "./assets/trash.png"
import logger from "./utils";
const projectsEl = document.querySelector('[data-projects]')
const projects = projectManager.getProjects();
const newProjectForm = document.querySelector('[data-new-project-form]')
const newProjectInput = document.querySelector('[data-new-project-input]')
const deleteProject = document.getElementById('delete-projects')
const render = (() => {

  const renderProjects = () => {
    let activeProjectId = projectManager.getActiveProjectId()
    clearElements(projectsEl);
    renderProject()
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
    renderProjects()
  }

  const renderProject = () => {
    let project = projectManager.getActiveProject() 
    // add current project tile
    const container = document.querySelector('.container')
    clearElements(container)
    const title = document.createElement('h1')
    title.textContent = project.title
    container.append(title)

  }


  return {renderProjects, renderProject}
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
    render.renderProjects()
})


export default render;

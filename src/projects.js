import logger from "./utils"
import demo from "./demo"
import dom from "./dom"
const { getStorage, saveStorage } = require("./storage")

const projectManager = (function () {
  let projects = getStorage("projects") || []
  if (projects.length === 0) {
    projects = demo
    saveProjectToStorage()
  }

  let activeProjectId = getStorage('activeProjectId') || saveStorage('activeProjectId', projects[0].id);
  const getProjects= () => projects

  const addProject = (project) => {
    projects.push(project)
    saveProjectToStorage()
    setActiveProjectId(project.id)
    dom.renderProjects()
  }

  function saveProjectToStorage() {
    saveStorage("projects", projects)
  }

  const getActiveProject = () => projects.find(project => project.id === activeProjectId);
  
  const getActiveProjectId = () => activeProjectId

  const setActiveProjectId = projectId => {
    activeProjectId = projectId
    saveStorage('activeProjectId', activeProjectId)
    dom.renderProjects()
  }

  return {getProjects, addProject, setActiveProjectId, getActiveProjectId, getActiveProject}
})()

export function createProject(title) {
  return {
    id: Date.now().toString(),
    title,
    tasks: [],
  }
}

export {projectManager}
import logger, { capitalize } from "./utils"
import demo from "./demo"
import {render} from "./dom"
const { getStorage, saveStorage, clearStorage } = require("./storage")

const projectManager = (function () {
  let projects = getStorage("projects") || []
  let activeProjectId =
    getStorage("activeProjectId")

    if (!activeProjectId && projects[0]) {
      activeProjectId = projects[0].id;
      saveStorage("activeProjectId", activeProjectId);
    }

  const initializeProjects = () => {
    if (projects.length === 0) {
      const defaultProjects = demo
      defaultProjects.forEach(element => {
        addProject(element)
      });
      console.log("First project:", projects[0]);
      setActiveProjectId(projects[0].id); // Set as active
      saveProjectsToStorage();
      saveStorage("activeProjectId", projectManager.getActiveProjectId());
    }

    console.log("initalizing app...")
  }

  const getProjects = () => projects

  function addProject(project) {
    projects.push(project)
    saveProjectsToStorage()
    setActiveProjectId(project.id)
  }

  function saveProjectsToStorage() {
    saveStorage("projects", getProjects())
  }

  const getActiveProject = () =>
    projects.find((project) => project.id === activeProjectId)

  const getActiveProjectId = () => activeProjectId

  const setActiveProjectId = (projectId) => {
    activeProjectId = projectId
    saveStorage("activeProjectId", activeProjectId)
  }

  const addTaskToProject = () => {}

  const deleteProjects = () => {
    clearStorage()
    initializeProjects()
    render.renderContent()
  }

  return {
    initializeProjects,
    getProjects,
    addProject,
    setActiveProjectId,
    getActiveProjectId,
    getActiveProject,
    deleteProjects,
  }
})()

export function createProject(title) {
  return {
    id: Date.now().toString(),
    title,
    tasks: [],
  }
}

export { projectManager }

import logger, { capitalize } from "./utils"
import demo from "./demo"
import { render } from "./dom"
import Task from "./tasks"
const { getStorage, saveStorage, clearStorage } = require("./storage")

const projectManager = (function () {
  let projects = getStorage("projects") || []
  let activeProjectId = getStorage("activeProjectId")

  if (!activeProjectId && projects[0]) {
    activeProjectId = projects[0].id
    saveStorage("activeProjectId", activeProjectId)
  }

  const initializeProjects = () => {
    if (projects.length === 0) {
      const defaultProjects = demo
      defaultProjects.forEach((element) => {
        addProject(element)
      })
      setActiveProjectId(projects[0].id) // Set as active
    }

    console.log("initalizing app...")
  }

  const getProjects = () => projects

  function addProject(project) {
    projects.push(project)
    setActiveProjectId(project.id)
  }

  function save() {
    saveStorage("projects", getProjects())
    saveStorage("activeProjectId", activeProjectId)
  }

  const getActiveProject = () => projects.find((project) => project.id === activeProjectId)

  const getActiveProjectId = () => activeProjectId

  const setActiveProjectId = (projectId) => {
    activeProjectId = projectId
    save()
  }

  const addTaskToProject = (task) => {
    const project = getActiveProject()
    if (project) {
      project.tasks.push(task)
      save()
    } else {
      console.error("Project not found!")
    }
  }

  // const getCompletedTasks = () => activeProject.tasks.filter(task=>task.completed)
  // const getIncompleteTasks = () => activeProject.tasks.filter(task=>!task.completed)
  // console.log("completed: " + getCompletedTasks)

  // addTaskToProject(testTask)


  const removeTodo = (todoId) => {
    this.todos = this.todos.filter(todo => todo.id !== todoId);
  }

  const removeProject = (projectId) => {
    projects = projects.filter(p => p.id !== projectId);
  }

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
    save
  }
})()

export function createProject(title) {
  return {
    id: Date.now().toString(),
    title,
    tasks: [],
    // toggleComplete() {
    //   this.completed = !this.completed;
    // },
  }
}

export { projectManager }

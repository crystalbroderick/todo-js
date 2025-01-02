import "./styles.css"
import logger from "./utils";
import {saveStorage, getStorage} from "./storage.js"
import dom, {render} from './dom.js';

import {projectManager} from "./projects.js"

document.addEventListener("DOMContentLoaded", () => {
 init()
});

export default function init() {
  console.log("DOM fully loaded");
  projectManager.initializeProjects(); // Ensure this initializes projects and activeProjectId
  console.log("Projects initialized:", projectManager.getProjects());
  console.log("Active Project ID:", projectManager.getActiveProjectId());

  render.renderContent()
}
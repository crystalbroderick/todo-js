import logger from "./utils"

function saveStorage(key, value) {
  logger("saving to storage..")
  localStorage.setItem(key, JSON.stringify(value))
}

function getStorage(key) {
  logger("loading from storage..")
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}
function clearStorage() {
  localStorage.clear()
}

export { saveStorage, getStorage, clearStorage }



export default function logger(message) {
  console.log(message);
}

//export const capitalize = word => word.charAt(0).toUpperCase() + word.slice(1)
export const capitalize = (word) => word.toUpperCase
let word = "people"
logger(word)
word = word.charAt(0).toUpperCase() + word.slice(1)

export function getGreeting() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning!";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon!";
  } else {
    return "Good evening!";
  }
}
export const formatDateForInput = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // Converts to "YYYY-MM-DD"
};

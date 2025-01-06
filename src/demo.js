const demo = [
  {
    id: Date.now(),
    title: "Default",
    tasks: [
      {
        id: 1,
        title: "Groceries",
        desc: "Lemon pepper, coffee, milk, eggs",
        priority: 1,
        completed: false,
        dueDate: Date.now()
      },
    ],
  },
  {
    id: 2,
    title: "Coding Project",
    tasks: [
      {
        id: 1,
        title: "add tasks to project",
        desc: "create task button, form, styles..",
        priority: 2,
        completed: false,
        dueDate: Date.now()
      },
      {
        id: 2,
        title: "delete project",
        desc: "add delete functionality with button and remove one project when user clicks.",
        priority: 3,
        completed: false,
        dueDate: Date.now()
      },
    ],
  },
]

export default demo
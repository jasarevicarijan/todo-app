class StorageHandler {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  getTodos(): Todo[] {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : [];
  }

  setTodos(todos: Todo[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(todos));
  }

  findTodoIndexById(todoId: string): number {
    const todos = this.getTodos();
    return todos.findIndex((todo) => todo.id === todoId);
  }
}

class Todo {
  id: string;
  stage: string;
  description: string;
  created_at: string;

  constructor(description: string) {
    this.id = this.generateId();
    this.stage = "pending";
    this.description = description;
    this.created_at = new Date().toLocaleDateString();
  }

  private generateId() {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000); // Adjust the range as needed
    return `${timestamp}-${randomNum}`;
  }
}

const todoStorage = new StorageHandler("todos");

function addTodo(): void {
  const descriptionInput = document.getElementById(
    "todoDescription"
  ) as HTMLInputElement;
  const description = descriptionInput.value;

  if (description.trim() !== "") {
    const newTodo = new Todo(description);
    saveTodoAndRender(newTodo);
    descriptionInput.value = "";
  } else {
    alert("Please enter a description for the todo");
  }
}

function saveTodoAndRender(todo: Todo): void {
  const todos = todoStorage.getTodos();
  todos.push(todo);
  todoStorage.setTodos(todos);
  renderTodos();
}

function renderTodos(): void {
  const todosContainer = document.querySelector(".todos")!;
  todosContainer.innerHTML = "";

  const todos = todoStorage.getTodos();

  todos.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todosContainer.appendChild(todoElement);
  });
}

function createTodoElement(todo: Todo) {
  const todoElement = document.createElement("div");
  todoElement.classList.add("todo");
  todoElement.classList.add(`todo-${todo.stage}`);

  const buttonsHTML =
    todo.stage === "done"
      ? `<button onclick="deleteTodo('${todo.id}')">Delete</button>`
      : "";

  todoElement.innerHTML = `
      <p>Description: ${todo.description}</p>
      <p>Stage: ${todo.stage}</p>
      <p>Created at: ${todo.created_at}</p>
      <button onclick="editTodo('${todo.id}')">Edit</button>
      <button onclick="changeStage('${todo.id}', '${todo.stage}')">Change Stage</button>
      ${buttonsHTML}
    `;

  return todoElement;
}

function editTodo(todoId: string) {
  const newDescription = prompt("Enter the new description:");
  if (newDescription !== null && newDescription.trim() !== "") {
    const todos = todoStorage.getTodos();
    const todoIndex = todoStorage.findTodoIndexById(todoId);
    if (todoIndex !== -1) {
      todos[todoIndex].description = newDescription;
      todoStorage.setTodos(todos);
      renderTodos();
    }
  } else {
    alert("Invalid description. Please try again.");
  }
}

function changeStage(todoId: string, currentStage: string): void {
  const stageMap: Record<string, string> = {
    pending: "in_progress",
    in_progress: "done",
    done: "pending",
  };

  const newStage = stageMap[currentStage];
  if (!newStage) return;

  const todos = todoStorage.getTodos();
  const todoIndex = todoStorage.findTodoIndexById(todoId);
  if (todoIndex !== -1) {
    todos[todoIndex].stage = newStage;
    todoStorage.setTodos(todos);
    renderTodos();
  }
}

function deleteTodo(todoId: string) {
  const todos = todoStorage.getTodos();
  const todoIndex = todoStorage.findTodoIndexById(todoId);
  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
    todoStorage.setTodos(todos);
    renderTodos();
  }
}

// Initial render when the page loads
renderTodos();

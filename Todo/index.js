class Todo {
  constructor() {
    this.todos = [];
    this.initDOM();
    this.addEventListeners();
    this.getTodosByLocalStorage();
    this.renderTodos();
  }

  initDOM() {
    this.todoWarp = document.getElementById("todo_wrap");
    this.addButton = document.getElementById("add_button");
    this.searchInput = document.getElementById("todo_search");
    this.orderSelect = document.getElementById("order_select");
    this.prioritySelect = document.getElementById("priority_select");
    this.taskInputElement = document.getElementById("task-input");
    this.taskFormContainer = document.getElementById("task-form-container");
    this.taskFromCancelButton = document.getElementById("cancel-button");
    this.taskFromCloseButton = document.getElementById("modal-close");
    this.taskFromAddButton = document.getElementById("add-button");
  }

  addEventListeners() {
    this.addButton.addEventListener("click", () => this.showTaskForm());
    this.taskFromAddButton.addEventListener("click", () => this.handleInput());
    this.taskInputElement.addEventListener("keypress", (e) => {
      if (e.key === "Enter") e.preventDefault(), this.handleInput();
    });
    this.taskFromCancelButton.addEventListener("click", () => this.hideTaskForm());
    this.taskFromCloseButton.addEventListener("click", () => this.hideTaskForm());

    this.todoWarp.addEventListener("click", (e) => this.handleTodoClick(e));
    this.todoWarp.addEventListener("change", (e) => this.handleTodoChange(e));
    this.todoWarp.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleTodoChange(e);
    });

    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.updateQuery("q", this.searchInput.value.trim());
    });

    this.orderSelect.addEventListener("change", (e) => this.updateQuery("o", e.target.value));
    this.prioritySelect.addEventListener("change", (e) => this.updateQuery("p", e.target.value));
  }

  showTaskForm() {
    this.taskFormContainer.classList.remove("hidden");
    this.taskInputElement.focus();
  }

  hideTaskForm() {
    this.taskFormContainer.classList.add("hidden");
  }

  handleInput() {
    const value = this.taskInputElement.value.trim();
    if (value) {
      this.addTodo(value);
    }
    this.hideTaskForm();
    this.taskInputElement.value = "";
  }

  updateQuery(param, value) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (value && value !== "all") params.set(param, value);
    else params.delete(param);

    window.location.href = `${url.pathname}?${params.toString()}`;
  }

  handleTodoClick(e) {
    const target = e.target;
    if (target.classList.contains("delete_btn")) {
      const id = this.findTodoId(target);
      this.deleteTodo(id);
    }
  }

  handleTodoChange(e) {
    const target = e.target;
    const id = this.findTodoId(target);

    if (target.classList.contains("complete_checkbox")) {
      this.toggleComplete(id);
    } else if (target.classList.contains("priority_select")) {
      this.togglePriority(id, target.value);
    } else if (target.id.includes("todo_input")) {
      this.editTodo(id, target.value);
    }
  }

  findTodoId(element) {
    return element.closest(".task")?.id;
  }

  addTodo(text, priority = "low") {
    this.todos.push({
      id: Date.now().toString(),
      text,
      isComplete: false,
      priority,
    });
    this.saveByLocalStorage();
    this.renderTodos();
  }

  editTodo(id, newText) {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    this.saveByLocalStorage();
    this.renderTodos();
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveByLocalStorage();
    this.renderTodos();
  }

  toggleComplete(id) {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo
    );
    this.saveByLocalStorage();
    this.renderTodos();
  }

  togglePriority(id, priority) {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, priority } : todo
    );
    this.saveByLocalStorage();
    this.renderTodos();
  }

  saveByLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  getTodosByLocalStorage() {
    const todos = localStorage.getItem("todos");
    if (todos) this.todos = JSON.parse(todos);
  }

  filterTodos(search, order, priority) {
    let filtered = [...this.todos];

    if (search) filtered = filtered.filter(todo => todo.text.includes(search));
    if (order)
      filtered.sort((a, b) =>
        order === "oldest" ? +a.id - +b.id : +b.id - +a.id
      );
    if (priority && priority !== "all")
      filtered = filtered.filter(todo => todo.priority === priority);

    return filtered;
  }

  renderTodos() {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("q");
    const order = params.get("o");
    const priority = params.get("p");

  // ✅ 쿼리 파라미터에 따라 인풋 상태 갱신
  if (search !== null) this.searchInput.value = search;
  if (order !== null) this.orderSelect.value = order;
  if (priority !== null) this.prioritySelect.value = priority;

    const todos = this.filterTodos(search, order, priority);

    this.todoWarp.innerHTML = "";
    todos.forEach((todo) => {
      this.todoWarp.appendChild(this.createTodoElement(todo));
    });
  }

  createTodoElement(todo) {
    const wrapper = document.createElement("div");
    wrapper.id = todo.id;
    wrapper.className = `task border-b pt-3 pb-3 w-full gap-2 flex items-center ${todo.isComplete ? "bg-gray-50" : ""}`;

    wrapper.innerHTML = `
      <div class="flex items-center w-full gap-2">
        <input type="checkbox" class="complete_checkbox flex-shrink-0" ${todo.isComplete ? "checked" : ""} />
        <div class="relative flex-1 sm:flex-none bg-transparent">
          <select class="priority_select appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200">
            ${["low", "medium", "high"]
              .map(
                (level) =>
                  `<option value="${level}" ${level === todo.priority ? "selected" : ""}>${level.toUpperCase()}</option>`
              )
              .join("")}
          </select>
          <span class="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
            <i class="fas fa-sort"></i>
          </span>
        </div>
        <input type="text" id="todo_input" value="${todo.text}" class="flex-1 w-full px-2 py-1 outline-none border-none ${
      todo.isComplete
        ? "line-through text-gray-500 pointer-events-none bg-gray-50"
        : ""
    } cursor-pointer" />
        <button class="delete_btn flex-shrink-0 bg-red-500 text-white px-2 py-1 text-sm font-medium rounded-lg">Remove</button>
      </div>
    `;

    return wrapper;
  }
}

document.addEventListener("DOMContentLoaded", () => new Todo());

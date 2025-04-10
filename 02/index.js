class Todo {
  constructor() {
    this.todos = [];
    this.todoWarp = document.getElementById("todo_wrap");
    this.addButton = document.getElementById("add_button");
    this.searchInput = document.getElementById("todo_search");
    this.orderSelect = document.getElementById("order_select");
    this.prioritySelect = document.getElementById("priority_select");

    this.addButton.addEventListener("click", () => this.handleAddButton());
    this.todoWarp.addEventListener("click", (event) =>
      this.handleTodoWrapClick(event)
    );
    this.todoWarp.addEventListener("change", (event) =>
      this.handleTodoWrapChange(event)
    );

    this.searchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        this.handleTodoSearch();
      }
    });

    this.orderSelect.addEventListener("change", (event) => {
      this.handleTodoOrderValueChange(event);
    });

    this.prioritySelect.addEventListener("change", (event) => {
      this.handleTodoPriority(event);
    });

    this.getTodosByLocalStorage();
    this.renderTodos();
  }

  handleAddButton() {
    const inputWrap = document.createElement("div");
    const inputElement = document.createElement("input");

    inputWrap.classList.add("input");
    inputElement.type = "text";
    inputElement.id = "todo";
    inputElement.classList.add("add_input");
    inputElement.placeholder = "할일을 입력하세요...";

    // 중요도 select box 추가
    const prioritySelect = document.createElement("select");
    prioritySelect.classList.add("priority_select");
    const priorities = ["low", "medium", "high"];

    priorities.forEach((level) => {
      const option = document.createElement("option");
      option.value = level;
      option.innerText = level.toUpperCase();
      prioritySelect.appendChild(option);
    });

    const handleInput = () => {
      const value = inputElement.value.trim();
      const priority = prioritySelect.value;
      if (value) {
        this.addTodo(value, priority);
      }

      inputWrap.remove();
    };

    inputElement.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleInput();
      }
    });

    inputWrap.appendChild(inputElement);
    inputWrap.appendChild(prioritySelect);
    this.todoWarp.appendChild(inputWrap);
    inputElement.focus();
  }

  handleTodoSearch() {
    const searchValue = this.searchInput.value.trim();

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (searchValue) {
      params.set("q", searchValue);
    } else {
      params.delete("q");
    }

    url.search = params.toString();
    window.location.href = url.toString();
  }

  handleTodoPriority() {
    const priority = this.prioritySelect.value.trim();

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (priority !== "all") {
      params.set("p", priority);
    } else {
      params.delete("p");
    }

    url.search = params.toString();
    window.location.href = url.toString();
  }

  handleTodoOrderValueChange(event) {
    const orderValue = event.target.value;

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (orderValue) {
      params.set("o", orderValue);
    }

    url.search = params.toString();
    window.location.href = url.toString();
  }

  handleTodoWrapClick(event) {
    const todoElement = event.target.parentElement.parentElement;
    const target = event.target;

    const classList = Array.from(target.classList);

    const todoId = todoElement.id;
    const todo = this.todos.find((todo) => todo.id === todoId);

    if (classList.includes("delete_btn")) {
      this.deleteTodo(todoId);
    } else if (classList.includes("edit_btn")) {
      this.editMode(todoElement, todo);
    }
  }

  handleTodoWrapChange(event) {
    const target = event.target;
    const todoElement = event.target.parentElement;
    const todoId = todoElement.id;

    const classList = Array.from(target.classList);
    if (classList.includes("checkbox")) {
      this.toggleComplete(todoId);
    } else if (classList.includes("priority_select")) {
      this.togglePriority(todoId, target.value);
    }
  }

  addTodo(text, priority = "row") {
    const todo = {
      id: Date.now().toString(),
      text,
      isComplete: false,
      priority,
    };

    this.todos = [...this.todos, todo];
    this.saveByLocalStorage();
    this.renderTodos();
  }

  editTodo(id, newText) {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, text: newText };
      }
      return todo;
    });

    this.saveByLocalStorage();
    this.renderTodos();
  }

  saveByLocalStorage() {
    try {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    } catch (e) {
      console.error("localStorage에 저장 도중 오류가 발생하였습니다.", e);
    }
  }
  getTodosByLocalStorage() {
    const todos = localStorage.getItem("todos");

    if (todos) {
      this.todos = JSON.parse(todos);
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(({ id: todoId }) => todoId !== id);

    this.saveByLocalStorage();
    this.renderTodos();
  }

  editMode(todoItemElement, todo) {
    const inputDiv = document.createElement("div");
    const inputElement = document.createElement("input");
    inputDiv.classList.add("input");
    inputElement.type = "text";
    inputElement.id = "todo";
    inputElement.classList.add("add_input");
    inputElement.value = todo.text;

    inputDiv.style.padding = 0;

    const buttons = todoItemElement.querySelector(".buttons");
    const strongTag = todoItemElement.querySelector("strong");
    const prioritySelect = todoItemElement.querySelector(".priority_select");
    const checkbox = todoItemElement.querySelector(".checkbox");

    const handleInput = () => {
      const value = inputElement.value.trim();
      if (value) {
        this.editTodo(todoItemElement.id, value);
      }

      inputDiv.remove();
    };

    inputElement.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleInput();
      }
    });

    buttons.style.display = "none";
    strongTag.style.display = "none";
    prioritySelect.style.display = "none";
    checkbox.style.display = "none";

    inputDiv.appendChild(inputElement);

    todoItemElement.appendChild(inputDiv);
    inputElement.focus();
  }

  toggleComplete(id) {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isComplete: !todo.isComplete };
      }
      return todo;
    });

    this.saveByLocalStorage();
    this.renderTodos();
  }

  togglePriority(id, priority) {
    console.log(id, priority);
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, priority };
      }
      return todo;
    });

    this.saveByLocalStorage();
    this.renderTodos();
  }

  filterTodos(searchValue, orderValue, priorityValue) {
    let todos = this.todos;
    if (searchValue) {
      todos = todos.filter(({ text }) => text.includes(searchValue));
      this.searchInput.focus();
      this.searchInput.value = searchValue;
    }

    if (orderValue) {
      this.orderSelect.value = orderValue;
      todos.sort((a, b) => {
        return orderValue === "oldest" ? +a.id - +b.id : b.id - a.id;
      });
    }

    if (priorityValue) {
      this.prioritySelect.value = priorityValue;
      todos = todos.filter(
        ({ priority = "low" }) => priority === priorityValue
      );
      console.log(todos, priorityValue);
    }

    return todos;
  }

  renderPriority(selected) {
    const prioritySelect = document.createElement("select");
    const priorities = ["low", "medium", "high"];

    priorities.forEach((level) => {
      const option = document.createElement("option");
      option.value = level;
      option.innerText = level.toUpperCase();
      if (level === selected) {
        option.selected = true;
      }
      prioritySelect.appendChild(option);
    });

    return prioritySelect;
  }

  renderTodos() {
    this.todoWarp.innerHTML = "";
    let todos = this.todos;
    const params = new URLSearchParams(window.location.search);

    const searchValue = params.get("q");
    const orderValue = params.get("o");
    const priorityValue = params.get("p");

    todos = this.filterTodos(searchValue, orderValue, priorityValue);

    todos.forEach((todo) => {
      const todoElement = document.createElement("div");
      todoElement.classList.add("todo_item");
      todoElement.id = todo.id;

      // 텍스트
      const todoTextElement = document.createElement("strong");
      todoTextElement.innerText = todo.text;

      // 체크 박스
      const checkboxElement = document.createElement("input");
      checkboxElement.type = "checkbox";
      checkboxElement.checked = todo.isComplete;
      checkboxElement.classList.add("checkbox");

      // 중요도 박스
      const prioritySelect = this.renderPriority(todo.priority);

      if (todo.isComplete) {
        todoTextElement.classList.add("checked");
        todoElement.classList.add("checked");
      }

      todoElement.appendChild(checkboxElement);
      todoElement.appendChild(prioritySelect);
      todoElement.appendChild(todoTextElement);
      this.todoWarp.appendChild(todoElement);

      // 버튼들
      const buttons = document.createElement("div");
      buttons.classList.add("buttons");

      //수정정 버튼
      const editButtonElement = document.createElement("button");
      editButtonElement.classList.add("edit_btn");
      editButtonElement.innerText = "수정";
      buttons.appendChild(editButtonElement);

      //삭제 버튼
      const deleteButtonElement = document.createElement("button");
      deleteButtonElement.classList.add("delete_btn");
      deleteButtonElement.innerText = "삭제";
      buttons.appendChild(deleteButtonElement);

      todoElement.appendChild(buttons);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const todoApp = new Todo();
});

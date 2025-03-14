class Todo {
  constructor() {
    this.todos = [];
    this.todoWarp = document.getElementById("todo_wrap");
    this.addButton = document.getElementById("add_button");

    this.addButton.addEventListener("click", () => this.handleAddButton());
    this.todoWarp.addEventListener("click", (event) =>
      this.handleTodoWrapClick(event)
    );
    this.getTodosByLocalStorage();
    this.renderTodos();
  }

  handleAddButton() {
    const inputDiv = document.createElement("div");
    const inputElement = document.createElement("input");

    inputDiv.classList.add("input");
    inputElement.type = "text";
    inputElement.id = "todo";
    inputElement.classList.add("add_input");
    inputElement.placeholder = "할일을 입력하세요...";

    const handleInput = () => {
      const value = inputElement.value.trim();
      if (value) {
        this.addTodo(value);
      }

      inputDiv.remove();
    };

    inputElement.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleInput();
      }
    });

    inputDiv.appendChild(inputElement);
    this.todoWarp.appendChild(inputDiv);
    inputElement.focus();
  }

  handleTodoWrapClick(event) {
    const todoElement = event.target.parentElement.parentElement;
    const target = event.target;

    const classList = Array.from(target.classList);

    const todoId = todoElement.id;
    const todo = this.todos.find((todo) => todo.id === todoId);

    if (classList.includes("delete_btn")) {
      console.log(todoElement, todoId);
      this.deleteTodo(todoId);
    } else if (classList.includes("edit_btn")) {
      this.editMode(todoElement, todo);
    }
  }

  addTodo(text) {
    const todo = {
      id: Date.now().toString(),
      text,
      isComplate: false,
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

    inputDiv.appendChild(inputElement);
    this.todoWarp.appendChild(inputDiv);
    inputElement.focus();
  }

  renderTodos() {
    this.todoWarp.innerHTML = "";
    this.todos.forEach((todo) => {
      const todoElement = document.createElement("div");
      todoElement.classList.add("todo_item");
      todoElement.id = todo.id;

      // 텍스트
      const todoText = document.createElement("strong");
      todoText.innerText = todo.text;

      todoElement.appendChild(todoText);
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

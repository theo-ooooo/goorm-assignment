class Todo {
  constructor() {
    this.todos = [];
    this.todoWarp = document.getElementById("todo_wrap");
    this.addButton = document.getElementById("add_button");

    this.addButton.addEventListener("click", () => this.handleAddButton());
  }

  handleAddButton() {
    const inputDiv = document.createElement("div");
    const inputElement = document.createElement("input");

    inputDiv.classList.add("input");
    inputElement.type = "text";
    inputElement.id = "todo";
    inputElement.classList.add("add_input");

    inputDiv.appendChild(inputElement);

    this.todoWarp.appendChild(inputDiv);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const todoApp = new Todo();
});

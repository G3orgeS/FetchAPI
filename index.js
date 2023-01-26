const BASE_URL = "https://fnd22-shared.azurewebsites.net/api/cases/";
const FAKE_URL = "https://jsonplaceholder.typicode.com/todos";

let todos = [];
const output = document.querySelector("#output");
const addForm = document.querySelector("#addForm");

const fetchTodos = () => {
  fetch(BASE_URL)
    // fetch(FAKE_URL)
    .then((Response) => {
      if (Response.ok) {
        console.log("ok");
      } else {
        console.log("error");
      }
      return Response;
    })
    .then((Response) => Response.json())
    .then((data) => {
      todos = data;
      renderTodos();
    })
    .catch((error) => console.log(error));
};

const renderTodos = () => {
  // En funktion skriver ut alla todos på sidan
  output.innerHTML = "";
  todos
    .sort(function (a, b) {
      return a.created.localeCompare(b.created);
    })
    .reverse()
    .forEach((todo) => output.appendChild(createTodo(todo)));
};

const createTodo = (todoData) => {
  const todo = document.createElement("div");
  todo.className = "todo";

  const todoContent = document.createElement("div");
  todoContent.className = "todo-content";

  const todoInfo = document.createElement("div");
  todoInfo.className = "todo-info";

  const div1 = document.createElement("div");

  const todoSubject = document.createElement("p");
  todoSubject.className = "todo-subject";
  todoSubject.textContent = todoData.subject;

  const todoEmail = document.createElement("p");
  todoEmail.className = "todo-email";
  todoEmail.textContent = todoData.email;

  div1.append(todoSubject, todoEmail);

  const div2 = document.createElement("div");

  const todoTime = document.createElement("p");
  todoTime.className = "todo-time";
  todoTime.textContent = convertTime(todoData.created);

  // id för länk kopplat till case      ----------------------------------------------
  const detailsLink = document.createElement("a");
  detailsLink.className = "details-link";
  detailsLink.textContent = "Details";
  detailsLink.href = `details.html?id=${todoData.id}`;

  div2.append(todoTime, detailsLink);

  todoInfo.append(div1, div2);

  const status = document.createElement("p");
  status.className = "todo-status";
  status.textContent = todoData.status.statusName;

  todoContent.append(todoInfo, status);

  const statusBar = document.createElement("div");
  statusBar.className = `statusbar status-${todoData.statusId}`;

  todo.append(todoContent, statusBar);

  return todo;
};

const convertTime = (time) => {
  let newTime = time.slice(0, 16);
  newTime = newTime.replace("T", " ");

  return newTime;
};

addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let newCase = {
    email: document.querySelector("#email").value,
    subject: document.querySelector("#subject").value,
    message: document.querySelector("#message").value,
  };
  fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(newCase),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      fetch(BASE_URL + data)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data)
          todos.unshift(data);
          addForm.reset();
          renderTodos();
        });
    });
});

fetchTodos();

// Get the button:
let mybutton = document.getElementById("myBtn");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// scrollknapp
function topFunction() {
  document.documentElement.scrollTop = 0;
}

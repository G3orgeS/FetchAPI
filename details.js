const BASE_URL = "https://fnd22-shared.azurewebsites.net/api/";

const id = new URLSearchParams(window.location.search).get("id");

const changeStatusForm = document.querySelector("#changeStatus");
const addCommentForm = document.querySelector("#addComment");

let todo = {};

const radionbtn1 = document.querySelector("#status1");
const radionbtn2 = document.querySelector("#status2");
const radionbtn3 = document.querySelector("#status3");

const fetchTodo = () => {
  fetch(BASE_URL + `cases/${id}`)
    .then((res) => res.json())
    .then((data) => {
      todo = data;
      renderTodo(todo);
    });
};

const renderTodo = (data) => {
  const statusBar = document.querySelector(".statusbar");
  statusBar.className = `statusbar status-${data.statusId}`;

  const subject = document.querySelector(".details-subject");
  subject.textContent = data.subject;

  const email = document.querySelector(".details-email");
  email.textContent = data.email;

  const time = document.querySelector(".details-time");
  time.textContent = convertTime(data.created);

  const message = document.querySelector(".details-message");
  message.textContent = data.message;

  changeStatusForm[data.statusId - 1].checked = true;

  const commentsContainer = document.querySelector(".comments-container");
  commentsContainer.innerHTML = "";

  data.comments
    .sort((a, b) => {
      return a.created.localeCompare(b.created);
    })
    .forEach((comment) => {
      commentsContainer.append(createComment(comment));
    });
};

const createComment = (data) => {
  const comment = document.createElement("div");
  comment.className = "comment";

  const email = document.createElement("p");
  email.className = "comment-email";
  email.textContent = data.email;

  const time = document.createElement("p");
  time.className = "comment-time";
  time.textContent = convertTime(data.created);

  const message = document.createElement("p");
  message.className = "comment-message";
  message.textContent = data.message;

  comment.append(email, time, message);

  return comment;
};

const convertTime = (time) => {
  let newTime = time.slice(0, 16);
  newTime = newTime.replace("T", " ");

  return newTime;
};

fetchTodo();
const statusBar = document.querySelector(".statusbar");

function checkButton() {
  if (radionbtn1.checked) {
    statusBar.className = "statusbar status-1";
    statusBar.id = 1;
  } else if (radionbtn2.checked) {
    statusBar.className = "statusbar status-2";
    statusBar.id = 2;
  } else if (radionbtn3.checked) {
    statusBar.className = "statusbar status-3";
    statusBar.id = 3;
  }
}
radionbtn1.addEventListener("click", checkButton);
radionbtn2.addEventListener("click", checkButton);
radionbtn3.addEventListener("click", checkButton);

changeStatusForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const statusId = changeStatusForm.querySelector("input:checked").value;

  fetch(BASE_URL + `cases/${id}`, {
    method: "PUT",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({
      id: id,
      statusId: statusId,
    }),
  }).then((res) => console.log(res));
});

addCommentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  fetch(BASE_URL + "comments", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({
      caseId: id,
      email: addCommentForm[0].value,
      message: addCommentForm[1].value,
    }),
  })
    .then((res) => console.log(res))
    .then((data) => fetchTodo(id));
});

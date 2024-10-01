window.onload = function () {
  loadtarefas();
};

document
  .getElementById("tarefa-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    addtarefa();
  });

function addtarefa() {
  const tarefaName = document.getElementById("tarefa").value.trim();
  const tarefaDate = document.getElementById("data").value;

  if (!tarefaName || !tarefaDate) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  const tarefa = {
    name: tarefaName,
    date: formatDate(tarefaDate),
    completed: false,
  };
  savetarefa(tarefa);
  document.getElementById("tarefa").value = "";
  document.getElementById("data").value = "";
}

function savetarefa(tarefa) {
  let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefas.push(tarefa);
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  rendertarefas();
}

function rendertarefas() {
  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  const pendingList = document.querySelector("#tarefa-pendente .lista-tarefa");
  const completedList = document.querySelector(
    "#tarefa-completa .lista-tarefa"
  );
  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  tarefas.forEach((tarefa, index) => {
    const tarefaItem = document.createElement("li");

    tarefaItem.innerHTML = `
      <span>${tarefa.name} (${tarefa.date})</span>
      ${
        !tarefa.completed
          ? `<button class="complete-btn" onclick="completetarefa(${index})">Concluir</button>`
          : ""
      }
      <button onclick="deletetarefa(${index})">Excluir</button>
    `;

    if (tarefa.completed) {
      completedList.appendChild(tarefaItem);
    } else {
      pendingList.appendChild(tarefaItem);
    }
  });
}

function completetarefa(index) {
  let tarefas = JSON.parse(localStorage.getItem("tarefas"));
  tarefas[index].completed = true;
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  rendertarefas();
}

function deletetarefa(index) {
  let tarefas = JSON.parse(localStorage.getItem("tarefas"));
  tarefas.splice(index, 1);
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  rendertarefas();
}

function loadtarefas() {
  rendertarefas();
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

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
  const today = new Date();
  const tarefaDateObj = new Date(tarefaDate);

  if (!tarefaName || !tarefaDate) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  if (tarefaDateObj < today) {
    alert("Por favor, insira uma data válida");
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
      <span id="tarefaSpan${index}">${tarefa.name} (${tarefa.date})</span>
      ${
        !tarefa.completed
          ? `<button class="complete-btn" onclick="completetarefa(${index})">Concluir</button>`
          : ""
      }
      <button onclick="deletetarefa(${index})">Excluir</button>
      ${
        !tarefa.completed
        ? `<button class="edit-btn" onclick="editartarefa(${index})">Editar</button>`
          : ""
      }
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

function editartarefa(index) {
  const tarefaSpan = document.getElementById(`tarefaSpan${index}`);
  const [nome, data] = tarefaSpan.innerText.split(" (");
  const dataFormatada = data.replace(")", "");

  tarefaSpan.innerHTML = `
    <input type="text" value="${nome}" id="tarefaInput${index}">
    <input type="date" value="${dataFormatada}" id="dataInput${index}">
  `;

  const editButton = tarefaSpan.nextElementSibling; // Seleciona o botão de editar
  editButton.innerText = "Salvar";
  editButton.setAttribute("onclick", `salvarTarefa(${index})`);
}

function deletetarefa(index) {
  let tarefas = JSON.parse(localStorage.getItem("tarefas"));
  tarefas.splice(index, 1);
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  rendertarefas();
}

function salvarTarefa(index) {
  const tarefaInput = document.getElementById(`tarefaInput${index}`).value;
  const dataInput = document.getElementById(`dataInput${index}`).value;

  tarefas[index].name = tarefaInput;
  tarefas[index].date = dataInput;


  const tarefaSpan = document.getElementById(`tarefaSpan${index}`);
  tarefaSpan.innerHTML = `${tarefaInput} (${dataInput})`;


  const editButton = tarefaSpan.nextElementSibling;
  editButton.innerText = "Editar";
  editButton.setAttribute("onclick", `editartarefa(${index})`);

  savetarefa(tarefa);
}

function loadtarefas() {
  rendertarefas();
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

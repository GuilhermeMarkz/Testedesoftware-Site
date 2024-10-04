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
  const completedList = document.querySelector("#tarefa-completa .lista-tarefa");
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
    <input type="text" value="${nome}" id="tarefaInput${index}" class="tarefaInput">
    <input type="date" value="${dataFormatada}" id="dataInput${index}" class="dataInput">
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
  const today = new Date();
  const tarefaDateObj = new Date(dataInput);

  // Verificação de campos vazios
  if (!tarefaInput || !dataInput) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // Verificação de data válida
  if (tarefaDateObj < today) {
    alert("Por favor, insira uma data válida");
    return;
  }

  let tarefas = JSON.parse(localStorage.getItem("tarefas")); // Certifique-se de obter a lista de tarefas
  tarefas[index].name = tarefaInput;
  tarefas[index].date = formatDate(dataInput); // Mantenha o formato de data consistente

  const tarefaSpan = document.getElementById(`tarefaSpan${index}`);
  tarefaSpan.innerHTML = `${tarefaInput} (${formatDate(dataInput)})`; // Atualiza a exibição

  const editButton = tarefaSpan.nextElementSibling;
  editButton.innerText = "Editar";
  editButton.setAttribute("onclick", `editartarefa(${index})`);

  localStorage.setItem("tarefas", JSON.stringify(tarefas)); // Salva as tarefas atualizadas
  rendertarefas(); // Atualiza a lista renderizada
}

function deletarTodasConcluidas() {
  if (confirm("Você tem certeza que deseja excluir todas as tarefas concluídas?")) {
    let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    // Filtra as tarefas para manter apenas as não concluídas
    tarefas = tarefas.filter(tarefa => !tarefa.completed);
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    rendertarefas(); // Atualiza a lista renderizada
  }
}

function loadtarefas() {
  rendertarefas();
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

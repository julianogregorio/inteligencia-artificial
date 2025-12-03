const topics = [
  "Bebês com deficiência",
  "Compartilhamento de custos de projetos hídricos",
  "Adoção da resolução orçamentária",
  "Congelamento da taxa dos médicos",
  "Ajuda a El Salvador",
  "Grupos religiosos nas escolas",
  "Proibição de testes de satélite",
  "Ajuda aos contras da Nicarágua",
  "Míssil MX",
  "Imigração",
  "Redução da corporação de combustíveis sintéticos",
  "Gastos com educação",
  "Direito de processar (Superfund)",
  "Crime",
  "Exportações livres de impostos",
  "Lei de administração de exportações (África do Sul)"
];

const inputsDiv = document.getElementById("inputs");
topics.forEach((topic, i) => {
  const wrapper = document.createElement("div");
  wrapper.className = "vote-input";

  const label = document.createElement("label");
  label.innerText = topic + ": ";

  const select = document.createElement("select");
  select.id = "vote" + i;
  select.innerHTML = `
    <option value="0">Não (0)</option>
    <option value="1">Sim (1)</option>
  `;

  wrapper.appendChild(label);
  wrapper.appendChild(select);
  inputsDiv.appendChild(wrapper);
});

// Submeter os votos para a API Flask
document.getElementById("voteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const votes = [];
  for (let i = 0; i < topics.length; i++) {
    votes.push(Number(document.getElementById("vote" + i).value));
  }

  const response = await fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ votes })
  });

  const data = await response.json();
  document.getElementById("result").innerText = "Previsão: " + data.party;
});
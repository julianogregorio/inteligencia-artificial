import React, { useState } from "react";
import topics from "./topics";

function VoteForm() {
  const [votes, setVotes] = useState(Array(16).fill(0));
  const [result, setResult] = useState("");

  const handleChange = (index, value) => {
    const newVotes = [...votes];
    newVotes[index] = Number(value);
    setVotes(newVotes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes })
      });
      const data = await response.json();
      setResult("Previsão: " + data.party);
    } catch {
      setResult("Erro ao conectar com a API");
    }
  };

  return (
    <div className="container">
      <h1>Classificação de Partido</h1>
      <form onSubmit={handleSubmit}>
        {topics.map((topic, i) => (
          <div className="vote-input" key={i}>
            <label>{topic}: </label>
            <select value={votes[i]} onChange={(e) => handleChange(i, e.target.value)}>
              <option value={0}>Não (0)</option>
              <option value={1}>Sim (1)</option>
            </select>
          </div>
        ))}
        <button type="submit">Enviar</button>
      </form>
      <h2>{result}</h2>
    </div>
  );
}

export default VoteForm;
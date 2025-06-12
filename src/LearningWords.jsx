import { useState } from "react";
import { words as initialWords } from "./word.js";
export default function LearningWords() {
 const [entries, setEntries] = useState(initialWords);
 const [flippedCardId, setFlippedCardId] = useState(null);
 function toggleFlip(id) {
  setFlippedCardId((prev) => (prev === id ? null : id));
 }

  function toggleLearned(id) {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, learned: !entry.learned } : entry // добавляем тип данных к id
      )
    );
  }

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    const preferredVoice = voices.find(
      (voice) =>
        voice.lang.startsWith("en") &&
        /female|woman|Google UK English Female|Samantha/i.test(voice.name)
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }

// Обеспечить загрузку голосов
window.speechSynthesis.onvoiceschanged = () => {};

  const [filter, setFilter] = useState("all");
  function handleFilterChange(e) {
    setFilter(e.target.value);
  }
  const filters = [
    { label: "Все", value: "all" },
    { label: "Выученные", value: "learned" },
    { label: "Невыученные", value: "unlearned" },
  ];
  const filteredEntries = entries.filter((entry) => {
    if (filter === "all") return true;
    if (filter === "learned") return entry.learned;
    if (filter === "unlearned") return !entry.learned;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    return a.learned === b.learned ? 0 : a.learned ? 1 : -1;
  });

  return (
    <div>
     
      <div className="cards-container">
        {sortedEntries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => {
              speak(entry.word);
              toggleFlip(entry.id);
            }}
            onDoubleClick={() => toggleLearned(entry.id)}
            className={`card ${entry.learned ? "learned" : ""}`}
          >
            <div className="card-inner">
              {flippedCardId === entry.id ? (
                <div>
                  <div><strong>{entry.translation}</strong></div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <strong>
                      {entry.word} {entry.learned && <span style={{ fontSize: "16px", color: "green" }}>✅</span>}
                    </strong>
                  </div>
                  <div className="transcription">{entry.transcription}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="hint">
        💡 Двойной клик по карточке — отметить как выученное или вернуть обратно
      </p>
      <div className="filters">
        {filters.map((f) => (
          <label key={f.value}>
            <input
              type="radio"
              value={f.value}
              checked={filter === f.value}
              onChange={handleFilterChange}
            />
            <span>{f.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
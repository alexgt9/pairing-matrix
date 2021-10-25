import "./App.css";
import { useState } from "react";
import Matrix from "./Matrix";

const App = () => {
  const [names, setNames] = useState("Alejandro\nPaco\nJavi\nPepe");

  function updateNames(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setNames(event.target.value);
  }

  return (
    <div className="App">
      <h1>Pairing Matrix</h1>
      <label>
        Introduce the names:
        <textarea value={names} onChange={updateNames}></textarea>
      </label>
      <Matrix names={names.split("\n")} />
    </div>
  );
};

export default App;

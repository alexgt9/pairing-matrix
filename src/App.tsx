import "./App.css";
import { Outlet } from "react-router-dom";
import ApiKey from "./components/ApiKey";
import { createContext, useState } from "react";
import NavBar from "./components/NavBar";

export const ApiKeyContext = createContext<string | null>(null);

const App = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  return (
    <ApiKeyContext.Provider value={apiKey}>
      <div className="flex flex-col h-screen">
        <NavBar onApiKeyChange={setApiKey}/>
        <div className="flex-1 overflow-y-auto p-5">
          <section id="detail" className="w-full">
            <Outlet />
          </section>
        </div>
      </div>
    </ApiKeyContext.Provider>
  );
};

export default App;

import "./App.css";
import { Outlet } from "react-router-dom";
import ApiKey from "./components/ApiKey";
import { createContext, useState } from "react";
import NavBar from "./components/NavBar";

export const ApiKeyContext = createContext(null);

const App = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  return (
    <ApiKeyContext.Provider value={apiKey}>
      <div className="flex">
        <NavBar/>
        <div className="w-full flex flex-col">
          <header className="self-end p-4">
            <ApiKey onApiKeyChange={setApiKey}/>
          </header>
          <section id="detail" className="w-full">
            <Outlet />
          </section>
        </div>
      </div>
    </ApiKeyContext.Provider>
  );
};

export default App;

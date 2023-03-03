import "./App.css";
import { Outlet } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import { DEFAULT_CALENDAR_VALUES, fetchCalendarInfo, OnlyCalendarInfo } from "./model/Storage";

export const ApiKeyContext = createContext<string | null>(null);
export const SelectedPersonContext = createContext<string | null>(null);

const App = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [names, setNames] = useState<string[]>(DEFAULT_CALENDAR_VALUES.names);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  useEffect(() => {
    if (apiKey) {
      fetchCalendarInfo(apiKey)
        .then((result: OnlyCalendarInfo) => {
          setNames(result.names);
        })
        .catch((error) => console.log("error", error));
    }
  }, [apiKey, selectedPerson]);

  return (
    <ApiKeyContext.Provider value={apiKey}>
      <SelectedPersonContext.Provider value={selectedPerson}>
        <div className="flex flex-col h-screen">
          <NavBar onApiKeyChange={setApiKey} names={names} onSelectedPersonChange={setSelectedPerson} />
          <div className="flex-1 overflow-y-auto dark:bg-gray-300">
            <section id="detail" className="w-full">
              <Outlet />
            </section>
          </div>
        </div>
      </SelectedPersonContext.Provider>
    </ApiKeyContext.Provider>
  );
};

export default App;

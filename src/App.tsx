import "./App.css";
import { useState } from "react";
import PairingApp from "./PairingApp";

const DEFAULT_ROTATION_FREQUENCY = 1;

const App = () => {
  const [rotationFrequency, setRotationFrequency] = useState("1");
  const [names, setNames] = useState("Alejandro\nJavi\nLaura\nElna");
  const [description, setDescription] = useState("");
  const [untilDate, setUntilDate] = useState<string>();

  function updateNames(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setNames(event.target.value);
  }

  const onChangeRotationFrequency = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRotationFrequency(event.target.value);
  };

  const onChangeDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const onChangeUntilDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUntilDate(event.target.value);
  };

  const isValidRotationFrequency = (value: string): boolean => {
    const almostNumber = parseInt(value);

    return !!almostNumber && almostNumber > 0;
  };

  const parseIntOrDefault = (value: string): number => {
    return isValidRotationFrequency(value) ? parseInt(value) : DEFAULT_ROTATION_FREQUENCY;
  };

  return (
    <div className="list-none text-center flex items-center flex-col">
      <a className="absolute right-2 top-2" href="https://github.com/alexgt9/pairing-matrix" target="_blank" rel="noreferrer">
        <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true">
            <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
      </a>
      <nav className={"flex items-center justify-center flex-wrap p-6"}>
        <div className={"flex items-center flex-shrink-0 text-white mr-6"}>
          <img className="w-1/4" src="/pairing.png" alt="Pairing logo" />
          <span
            className={"font-semibold text-xl tracking-tight text-gray-900"}
          >
            Pairing days calendar
          </span>
        </div>
      </nav>
      <form className={"w-full max-w-4xl"}>
        <div className={"flex grid-cols-2 flex-wrap -mx-3 mb-6"}>
          <div className={"row-span-1 px-3 mb-6 md:mb-0"}>
            <label
              className={
                "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              }
              htmlFor="participants"
            >
              Participants
            </label>
            <textarea
              value={names}
              onChange={updateNames}
              className={
                "h-40 appearance-none block w-full text-gray-700 rounded border-gray-200 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              }
              id="participants"
            />
            <p className={"text-xs italic"}>One participant per line.</p>
            <label
              className={
                "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-2"
              }
              htmlFor="rotation-frequency"
            >
              Rotation frequency (in days)
            </label>
            <input
              value={rotationFrequency}
              onChange={onChangeRotationFrequency}
              className={
                "appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              }
              id="rotation-frequency"
              type="text"
            />
            { !isValidRotationFrequency(rotationFrequency) && <p className={"text-red-600 text-xs italic mt-2"}>Wrong value! Using default (1).</p>}
          </div>
          <div className={"w-full md:w-1/2"}>
            <label
              className={
                "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              }
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={onChangeDescription}
              className={
                "h-40 appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              }
              id="description"
              placeholder="Introduce extra text for description &#10;Room 1: https://thoughtworks.zoom.us/j/calendarGenerator"
            />
            <label
              className={
                "mt-9 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              }
              htmlFor="until-date"
            >
              Create events until date?
            </label>
            <input
              onChange={onChangeUntilDate}
              className={
                "appearance-none block w-full text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              }
              id="until-date"
              type="date"
            />
            <p className={"text-xs italic mt-2"}>Leave empty for non ending.</p>
          </div>
        </div>
      </form>
      <PairingApp
        names={names.trim().split("\n")}
        rotationFrequency={parseIntOrDefault(rotationFrequency)}
        description={description}
        untilDate={untilDate ? new Date(untilDate) : undefined}
      />
      <div className="mt-2">Made with <span className="text-red-400" style={{display: "contents"}}>&#9829;</span> by <a className="text-blue-500" href="https://github.com/alexgt9" target="_blank" rel="noreferrer">Alejandro Batanero</a></div>
    </div>
  );
};

export default App;

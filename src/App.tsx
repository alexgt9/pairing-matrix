import "./App.css";
import { useState } from "react";
import Matrix from "./Matrix";

const App = () => {
  const [rotationFrequency, setRotationFrequency] = useState("1");
  const [names, setNames] = useState("Alejandro\nPaco\nJavi\nPepe");
  const [description, setDescription] = useState("");

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

  return (
    <div className="App flex items-center flex-col">
      <nav className={"flex items-center justify-center flex-wrap bg-teal-500 p-6"}>
        <div className={"flex items-center flex-shrink-0 text-white mr-6"}>
        <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 2"><g data-name="people"><rect width="24" height="24" opacity="0"/><path d="M9 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4z"/><path d="M17 13a3 3 0 1 0-3-3 3 3 0 0 0 3 3z"/><path d="M21 20a1 1 0 0 0 1-1 5 5 0 0 0-8.06-3.95A7 7 0 0 0 2 20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1"/></g></g></svg>
          <span className={"font-semibold text-xl tracking-tight"}>Pairing Matrix</span>
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
                "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              }
              id="participants"
            />
            <p className={"text-red-500 text-xs italic"}>
              One participant per line.
            </p>
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
                "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              }
              id="rotation-frequency"
              type="text"
            />
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
                "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              }
              id="description"
              placeholder="Introduce extra text for description &#10;Room 1: https://thoughtworks.zoom.us/j/calendarGenerator"
            />
          </div>
        </div>
      </form>
      <Matrix names={names.split("\n")} rotationFrequency={parseInt(rotationFrequency)}/>
    </div>
  );
};

export default App;

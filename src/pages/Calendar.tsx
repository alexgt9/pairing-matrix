import { useState, useEffect } from 'react';
import PairingApp from "../components/PairingApp";
import pairingUrl from "../assets/pairing.png";
import { fetchNames, storeNames, fetchDescription, storeDescription, fetchRotationFrequency, storeRotationFrequency, fetchUntilDate, storeUntilDate } from "../model/Storage";

const DEFAULT_ROTATION_FREQUENCY = 1;

export default () => {
  const [rotationFrequency, setRotationFrequency] = useState(DEFAULT_ROTATION_FREQUENCY.toString());
  const [names, setNames] = useState("");
  const [description, setDescription] = useState("");
  const [untilDate, setUntilDate] = useState<string>("");

  const dateIsInThePast = untilDate && new Date(untilDate) < new Date();

  useEffect(() => {
    setNames(fetchNames());
    setDescription(fetchDescription());
    setRotationFrequency(fetchRotationFrequency());
    setUntilDate(fetchUntilDate());
  });

  function updateNames(event: React.ChangeEvent<HTMLTextAreaElement>) {
    storeNames(event.target.value);
    setNames(event.target.value);
  }

  const onChangeRotationFrequency = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRotationFrequency(event.target.value);
    storeRotationFrequency(event.target.value);
  };

  const onChangeDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
    storeDescription(event.target.value)
  };

  const onChangeUntilDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUntilDate(event.target.value);
    storeUntilDate(event.target.value);
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
      <nav className={"flex items-center justify-center flex-wrap p-6"}>
        <div className={"flex items-center flex-shrink-0 text-white mr-6"}>
          <img className="w-1/4" src={pairingUrl} alt="Pairing logo" />
          <span
            className={"font-semibold text-xl tracking-tight text-gray-900"}
          >
            Pairing calendar
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
                "h-40 appearance-none block w-full text-gray-700 rounded border-2 border-gray-200 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
              value={untilDate}
              className={
                "appearance-none block w-full text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              }
              id="until-date"
              type="date"
            />

            { dateIsInThePast && <p className={"text-red-600 text-xs italic mt-2"}>The selected date is in the past...</p>}
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
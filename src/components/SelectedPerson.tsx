import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { v4 } from "uuid";
import { SelectedPersonContext } from "../App";
import {
  LinkIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";

const SELECTED_PERSON_LOCALSTORAGE = "selected_person";

export type SelectedPersonProps = {
  names: string[];
  onSelectedPersonChange: (selectedPerson: string) => void;
};

export default function ({ names, onSelectedPersonChange }: SelectedPersonProps) {
  const selectedPerson = useContext(SelectedPersonContext);

  const selectedPersonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectedPersonChange(event.target.value);
    localStorage.setItem(SELECTED_PERSON_LOCALSTORAGE, event.target.value);
  };

  useEffect(() => {
    if (localStorage.getItem(SELECTED_PERSON_LOCALSTORAGE)) {
      onSelectedPersonChange(localStorage.getItem(SELECTED_PERSON_LOCALSTORAGE)!);
    }
  }, [localStorage]);

  return (
    <select className="outline-none dark:bg-transparent dark:text-gray-300" onChange={selectedPersonChange}>
      {!selectedPerson && <option value="" disabled selected hidden>Who?</option>}
      {names.map(name => <option key={name} value={name} selected={selectedPerson === name}>{name}</option>) }
    </select>
  );
}

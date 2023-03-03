import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { v4 } from "uuid";
import { ApiKeyContext } from "../App";
import {
  LinkIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";

const API_KEY_LOCALSTORAGE = "api_key";

export type ApiKeyProps = {
  onApiKeyChange: (apiKey: string) => void;
};

export default function ({ onApiKeyChange }: ApiKeyProps) {
  const apiKey = useContext(ApiKeyContext);
  const [searchParams] = useSearchParams();
  const [openModal, setOpenModal] = useState(false);

  const apiKeyUrl = searchParams.get("team");
  const shareLink = `${window.location.origin}${window.location.pathname}?team=${apiKey}`;

  const shareLinkToClipBoard = (event: React.MouseEvent) => {
    event.preventDefault();
    navigator.clipboard.writeText(shareLink);
    setOpenModal(true);
    setTimeout(() => setOpenModal(false), 2000);
  };

  useEffect(() => {
    if (apiKeyUrl) {
      localStorage.setItem(API_KEY_LOCALSTORAGE, apiKeyUrl);
      onApiKeyChange(apiKeyUrl);
    } else if (localStorage.getItem(API_KEY_LOCALSTORAGE)) {
      onApiKeyChange(localStorage.getItem(API_KEY_LOCALSTORAGE)!);
    } else {
      const newApiKey = v4();
      localStorage.setItem(API_KEY_LOCALSTORAGE, newApiKey);
      onApiKeyChange(newApiKey);
    }
  }, [localStorage]);

  return (
    <div>
      <div className="flex flex-col">
        <a
          className="mt-2 flex shadow border-1 p-2 px-3 m-2 rounded-lg bg-blue-100 font-bold hover:bg-sky-200"
          href={shareLink}
          target={"_blank"}
          onClick={shareLinkToClipBoard}
        >
          Share team link<LinkIcon className=" ml-2 h-6 w-6" />
        </a>
      </div>
      {openModal && (
        <div
          className="animate-bounce absolute flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
            <ClipboardDocumentCheckIcon className="h-6 w-6" />
            <span className="sr-only">Fire icon</span>
          </div>
          <div className="ml-3 text-sm font-normal">Copied to clipboard</div>
        </div>
      )}
    </div>
  );
}

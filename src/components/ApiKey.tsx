import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { v4 } from "uuid";
import { ApiKeyContext } from "../App";

const API_KEY_LOCALSTORAGE = "api_key";

export type ApiKeyProps = {
  onApiKeyChange: (apiKey: string) => void;
};

export default function ({ onApiKeyChange }: ApiKeyProps) {
  const apiKey = useContext(ApiKeyContext);
  const [searchParams] = useSearchParams();

  const apiKeyUrl = searchParams.get("team");

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

  return <span>Team Cenote {apiKey}</span>;
}

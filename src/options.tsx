import React from "react";
import ReactDOM from "react-dom/client";
import { OptionsPage } from "./components/OptionsPage";
import { storageService } from "./storage/storageService";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <OptionsPage
    onLoad={async () => ({
      url: await storageService.getProviderUrl(),
      apiKey: await storageService.getProviderApiKey(),
    })}
    onSave={async (url, apiKey) => {
      await storageService.setProviderUrl(url);
      await storageService.setProviderApiKey(apiKey);
    }}
  />
);

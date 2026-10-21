import React from "react";
import ReactDOM from "react-dom/client";
import { verifyLinearApiKey } from "./api/linearApi";
import { OptionsPage } from "./components/OptionsPage";
import { detectProvider } from "./shared.helpers";
import { storageService } from "./storage/storageService";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <OptionsPage
    onLoad={async () => ({
      url: await storageService.getProviderUrl(),
      apiKey: await storageService.getProviderApiKey(),
    })}
    onSave={async (url, apiKey) => {
      if (detectProvider(url) === "linear") {
        await verifyLinearApiKey(apiKey);
      }
      await storageService.setProviderUrl(url);
      await storageService.setProviderApiKey(apiKey);
    }}
  />
);

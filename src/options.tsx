import React from "react";
import ReactDOM from "react-dom/client";
import { OptionsPage } from "./components/OptionsPage";
import { storageService } from "./storage/storageService";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <OptionsPage
    onLoad={() => storageService.getJiraUrl()}
    onSave={(url) => storageService.setJiraUrl(url)}
  />
);

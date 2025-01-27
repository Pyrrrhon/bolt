"use client";

import { Step } from "@/lib/parser/xmlParser";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

export const TestSandPack = ({ files }: { files: Step[] }) => {
  const parsedFiles = (files: Step[]) => {
    const jsonFiles: { [key: string]: string } = {};
    files.forEach((file) => {
      if (file.title === "Create package.json") return;
      if (file.title === "Create tsconfig.node.json") return;
      if (file.title === "Create vite.config.ts") return;
      if (file.title === "Create tsconfig.json") return;
      if (file.title === "Create tailwind.config.js") return;
      if (file.title === "Create eslint.config.js") return;
      if (file.title === "Create index.tsx") return;
      if (file.type === 1) {
        const fileName = file.title.split(" ")[1]; 
        //console.log(file.code);
        jsonFiles[fileName] = file.code; 
      }
    });
    return jsonFiles;
  };
  console.log(parsedFiles(files));
  return (
    <SandpackProvider
      options={{
        externalResources: ["https://cdn.tailwindcss.com"],
        classes: {
          "sp-wrapper": "custom-wrapper",
          "sp-layout": "custom-layout",
          "sp-tab-button": "custom-tab",
        },
        //showTabs: true,
        showNavigator: true,
        closableTabs: true,
      }}
      files={{"index.tsx":`import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./src/App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,...parsedFiles(files)}}
      template="react-ts"

      customSetup={{
        dependencies: {
          "react-markdown": "latest",
          "lucide-react": "latest",
          'react-router-dom': "latest"
        },
      }}
    >
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor 
        closableTabs={true} 
        showLineNumbers={true}/>
        <SandpackPreview /> {/* Added Preview Component */}
      </SandpackLayout>
    </SandpackProvider>
  );
};

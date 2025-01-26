"use client";

import { Step } from "@/lib/parser/xmlParser";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import { useState } from "react";
const dependencies = {
  "lucide-react": "latest",
  // recharts: "2.9.0",
  // "react-router-dom": "latest",
  // "@radix-ui/react-accordion": "^1.2.0",
  // "@radix-ui/react-alert-dialog": "^1.1.1",
  // "@radix-ui/react-aspect-ratio": "^1.1.0",
  // "@radix-ui/react-avatar": "^1.1.0",
  // "@radix-ui/react-checkbox": "^1.1.1",
  // "@radix-ui/react-collapsible": "^1.1.0",
  // "@radix-ui/react-dialog": "^1.1.1",
  // "@radix-ui/react-dropdown-menu": "^2.1.1",
  // "@radix-ui/react-hover-card": "^1.1.1",
  // "@radix-ui/react-label": "^2.1.0",
  // "@radix-ui/react-menubar": "^1.1.1",
  // "@radix-ui/react-navigation-menu": "^1.2.0",
  // "@radix-ui/react-popover": "^1.1.1",
  // "@radix-ui/react-progress": "^1.1.0",
  // "@radix-ui/react-radio-group": "^1.2.0",
  // "@radix-ui/react-select": "^2.1.1",
  // "@radix-ui/react-separator": "^1.1.0",
  // "@radix-ui/react-slider": "^1.2.0",
  // "@radix-ui/react-slot": "^1.1.0",
  // "@radix-ui/react-switch": "^1.1.0",
  // "@radix-ui/react-tabs": "^1.1.0",
  // "@radix-ui/react-toast": "^1.2.1",
  // "@radix-ui/react-toggle": "^1.1.0",
  // "@radix-ui/react-toggle-group": "^1.1.0",
  // "@radix-ui/react-tooltip": "^1.1.2",
  // "class-variance-authority": "^0.7.0",
  // clsx: "^2.1.1",
  // "date-fns": "^3.6.0",
  // "embla-carousel-react": "^8.1.8",
  // "react-day-picker": "^8.10.1",
  // "tailwind-merge": "^2.4.0",
  // "tailwindcss-animate": "^1.0.7",
  // "framer-motion": "^11.15.0",
  // vaul: "^0.9.1",
};

export const TestSandPack = ({ files }: { files: Step[] }) => {
  const [preview, setPreview] = useState<boolean>(true);
  const parsedFiles = (files: Step[]) => {
    const jsonFiles: { [key: string]: string } = {};
    files.forEach((file) => {
      if (file.title === "Create package.json") return;
      if (file.type === "CreateFile") {
        const fileName = file.title.split(" ")[1]; // Extract file name
        jsonFiles[fileName] = file.code; // Add to the result object
      }
    });
    return jsonFiles;
  };

  return (
    <>
      <div className="flex flex-col shadow">
        <div className="w-full h-8 border  border-slate-200 bg-white border-b-0 ">
          <button
            onClick={(e) =>
              setPreview((value) => {
                return !value;
              })
            }
          >
            {" "}
            {preview ? "code" : "Preview"}
          </button>
        </div>
        <SandpackProvider
          files={parsedFiles(files)}
          template="react-ts"
          options={{
            externalResources: [
              "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
            ],
            activeFile: "/App.js",
          }}
          customSetup={{
            dependencies,
          }}
        >
          <SandpackLayout className="h-[90vh]">
            {preview ? (
              <SandpackPreview
                showRestartButton={true}
                style={{ height: "90vh", width: "600px" }}
                showNavigator={true}
                showOpenInCodeSandbox={false}
                showRefreshButton={true}
              />
            ) : (
              <>
                <SandpackFileExplorer style={{ height: "90vh" }} />
                <SandpackCodeEditor
                  showLineNumbers={true}
                  readOnly={false}
                  style={{ height: "90vh", width: "600px" }}
                  showTabs={true}
                  showInlineErrors={true}
                  closableTabs={true}
                  wrapContent={true}
                />
                <SandpackPreview
                  style={{ height: "90vh", width: "600px" }}
                  showNavigator={true}
                  showOpenInCodeSandbox={false}
                  showRefreshButton={true}
                />
                {/* <SandpackConsole /> */}
              </>
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </>
  );
};

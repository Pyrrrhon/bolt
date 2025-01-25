"use client";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

export const TestSandPack = ({ files }: any) => {
  return (
    <SandpackProvider
      options={{
        externalResources: ["https://cdn.tailwindcss.com"],
        classes: {
          "sp-wrapper": "custom-wrapper",
          "sp-layout": "custom-layout",
          "sp-tab-button": "custom-tab",
        },
        // showTabs: true,
        showNavigator: true,
        closableTabs: true,
      }}
      files={files}
      template="react"
      customSetup={{
        dependencies: {
          "react-markdown": "latest",
        },
      }}
    >
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor />
        <SandpackPreview /> {/* Added Preview Component */}
      </SandpackLayout>
    </SandpackProvider>
  );
};

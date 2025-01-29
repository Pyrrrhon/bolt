// const ARTIFACT_TAG_OPEN = "<boltArtifact";
// const ARTIFACT_TAG_CLOSE = "</boltArtifact>";
// const ARTIFACT_ACTION_TAG_OPEN = "<boltAction";
// const ARTIFACT_ACTION_TAG_CLOSE = "</boltAction>";

enum StepType {
  CreateFolder = "CreateFolder",
  CreateFile = "CreateFile",
  ModifyFile = "ModifyFile",
  DeleteFile = "DeleteFile",
  ShellCommand = "ShellCommand",
}

export interface Step {
  id: number;
  title: string;
  description: string;
  type: StepType;
  code: string;
  filePath: string;
}

// interface MessageState {
//   insideAction?: boolean;
//   currentAction?: string;
//   buffer?: string;
// }
interface State {
  MessageState?: {
    insideAction?: boolean;
    currentAction?: string;
    filePath?: string | null;
    content: string;
  };
  buffer: string;
}
// const messageState: MessageState = {};

const state: State = {
  MessageState: undefined,
  buffer: "",
};
export const step: Step[] = [];
let id = 1;
// <boltArtifact id="blog-site" title="Blog Site with
// React, Tailwind CSS, and Lucide Icons">


// <boltAction type="file" filePath="package.json">{
//   "name": "snake",
//   "scripts": {
//     "dev": "vite"
//   }
//   ...
// }</boltAction>
export const parseXml = (chunk: string) => {
  console.log("Raw chunk:", chunk)
  state.buffer += chunk;
  const artifactTitle = state.buffer.match(/``+\s*html\s*<boltArtifact\s+[^\>]*>/)

  if (artifactTitle) {
    state.buffer = state.buffer.replace(artifactTitle[0], "")
  }
  const endArtifact = state.buffer.match(/<\/boltArtifact>\s*``+/)
  if (endArtifact) {
    state.buffer = state.buffer.replace(endArtifact[0], "")
  }

  const artifactOpen = state.buffer.match(
    /<boltAction\s+type\s*="([^"]+)"(?:\s+filePath\s*="([^"]+)")?>/
  );
  if (artifactOpen) {
    const [, type, filePath] = artifactOpen;

    state.MessageState = {
      insideAction: true,
      currentAction: type,
      filePath: filePath,
      content: "",
    };
    step.push({
      id: id++,
      title: state.MessageState.filePath
        ? `Create ${state.MessageState.filePath}`
        : "Run shell command",
      description: "",
      type: state.MessageState.filePath
        ? StepType.CreateFile
        : StepType.ShellCommand,
      code: "",
      filePath,
    });
    state.buffer = state.buffer.replace(artifactOpen[0], "");
  }
  const actionCloseMatch = state.buffer.match(/<\/boltAction>/);
  if (actionCloseMatch && state.MessageState) {
    const contentBeforeClose = state.buffer.split(/<\/boltAction>/)[0];
    state.MessageState.content += contentBeforeClose;


    const currentStepIndex = step.length - 1;
    if (currentStepIndex >= 0) {
      step[currentStepIndex].code = state.MessageState.content;
    }

    state.MessageState = undefined;
    state.buffer = state.buffer.replace(/.*?<\/boltAction>/, "");
  }

  if (state.MessageState) {
    const currentStepIndex = step.length - 1;
    if (currentStepIndex >= 0) {
      step[currentStepIndex].code += state.buffer;
    }
    state.MessageState.content += state.buffer;
    state.buffer = "";
  }
  console.log("xmlParser Step return:", step)
  return step;
};

// function extractAttributes(tag: string): Record<string, string> {
//   const attributeRegex = /(\w+)="([^"]*)"/g;
//   const attributes: Record<string, string> = {};
//   let match;
//   while ((match = attributeRegex.exec(tag)) !== null) {
//     attributes[match[1]] = match[2];
//   }
//   return attributes;
// }

//batch update each file
// export const parseXml = (chunk: string) => {
//   state.buffer += chunk;

//   const artifactOpen = state.buffer.match(
//     /<boltAction\s+type="([^"]+)"(?:\s+filePath="([^"]+)")?>/
//   );
//   if (artifactOpen) {
//     const [, type, filePath] = artifactOpen;
//     state.MessageState = {
//       insideAction: true,
//       currentAction: type,
//       filePath,
//       content: "",
//     };
//     state.buffer = state.buffer.replace(artifactOpen[0], "");
//   }
//   const actionCloseMatch = state.buffer.match(/<\/boltAction>/);
//   if (actionCloseMatch && state.MessageState) {
//     const contentBeforeClose = state.buffer.split(/<\/boltAction>/)[0];
//     state.MessageState.content += contentBeforeClose;

//     step.push({
//       id: id++,
//       title: state.MessageState.filePath
//         ? `Create ${state.MessageState.filePath}`
//         : "Run shell command",
//       description: "",
//       type: state.MessageState.filePath
//         ? StepType.CreateFile
//         : StepType.ShellCommand,
//       code: state.MessageState.content.trim(),
//     });
//     state.MessageState = undefined;
//     state.buffer = state.buffer.replace(/.*?<\/boltAction>/, "");
//   }

//   if (state.MessageState) {
//     state.MessageState.content += state.buffer;
//     state.buffer = "";
//   }
//   return step;
// };

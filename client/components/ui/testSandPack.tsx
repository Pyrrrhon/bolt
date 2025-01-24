"use client"

import { Sandpack } from "@codesandbox/sandpack-react";

export const TestSandPack =()=> {
  return (
    <Sandpack
      files={{
        '/Wrapper.js': `export default () => "";`,
      
        '/Button.js': {
          code: `export default () => {
  return <button>Hello</button>
};`,
          readOnly: true, // Set as non-editable, defaults to `false`
          active: true, // Set as main file, defaults to `false`
          hidden: false // Tab visibility, defaults to `false`
        }
      }}
      template="react"
    />
  )
};

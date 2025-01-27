"use client"
import { Dispatch, SetStateAction, useState } from "react";
import { FileNode, FileStore } from "../lib/files/files";
import { Step } from "@/lib/parser/xmlParser";

export default function FileExplorer({ streamedData, setFiles }: {streamedData: Step[], setFiles:Dispatch<SetStateAction<Map<string,FileNode>>> }) {
  const [files, setFiles] = useState<Map<string, FileNode>>(new Map());
  streamedData.map((data: Step)=>{
      let [action, path] = data.title.split(' ')
      if(action === 'Create') {
          path = path[1]
          let part = path.split('/')
          if(part.length > 0) {
              fileStore.createDir(part.slice(0, -1).join('/'))
              fileStore.createFile(path, data.code)                              
          }
          setFiles(fileStore.files)
          console.log(fileStore.files)
      }
  })  

  
  return(<>Hello World</>);
}

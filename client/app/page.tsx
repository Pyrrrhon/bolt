"use client";

import { useEffect, useState } from "react";
import { TestSandPack } from "../components/ui/testSandPack";
import { sendPrompt } from "../lib/actions/sendPrompt";
import { Step } from "@/lib/parser/xmlParser";
import { useRecoilValue } from "recoil";
import { serverResponseAtom } from "@/lib/atoms/serverResponseAtom";
import { useParser } from "@/lib/hooks/useparser";
import FileExplorer from "@/components/FileExplorer";
import { FileNode, FileStore } from "@/lib/files/files";
import { useFileExplorer } from "@/lib/hooks/useFileExplorer";

export default function Home() {
  const fileStore = new FileStore();
  const [userPrompt, setUserPrompt] = useState("");
  const { streamedData, isLoading, fetchStreamedData } = useParser(userPrompt);
  //const { files } = useFileExplorer(streamedData, fileStore)
  console.log("Streamed Data:",streamedData)
 

  async function handleClick() {
    await fetchStreamedData();
  }

  //console.log(files)
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          className="text-sm border border-gray-400 p-2 rounded-lg shadow-xl w-[40%] h-[30%]"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="bg-slate-950 text-white font-bold py-2 px-4 rounded"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* <FileExplorer streamedData={streamedData} setFiles={setFiles} /> */}

        <TestSandPack files={streamedData} />  
      </div>
    </>
  );
}

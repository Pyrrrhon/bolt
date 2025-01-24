"use client"

import { sendPrompt } from "@/lib/actions/sendPrompt";
import Image from "next/image";
import { useState } from "react";
import { TestSandPack } from "../components/ui/testSandPack"

export default function Home() {
  const [userPrompt, setUserPrompt] = useState("")
  return (
    <>
  <div className="flex flex-col items-center justify-center h-screen">
    <textarea value={userPrompt} onChange={e=>{
      setUserPrompt(e.target.value)
    }} className="text-sm border border-gray-400 p-2 rounded-lg shadow-xl w-[40%] h-[30%]" />
    <div className="flex justify-end mt-4">
      <button onClick={async () => await sendPrompt(userPrompt)} className="bg-slate-950 text-white font-bold py-2 px-4 rounded">
        Generate
      </button>
    </div>
    
  </div>
  <TestSandPack />
  </>
);
}


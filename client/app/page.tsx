"use client";

import { useEffect, useState } from "react";
import { TestSandPack } from "../components/ui/testSandPack";
import { sendPrompt } from "../lib/actions/sendPrompt";
import { Step } from "@/lib/parser/xmlParser";
import { useRecoilValue } from "recoil";
import { serverResponseAtom } from "@/lib/atoms/serverResponseAtom";
import { useParser } from "@/lib/hooks/useparser";

export default function Home() {
  const [userPrompt, setUserPrompt] = useState("");
  const { streamedData, isLoading, fetchStreamedData } = useParser(userPrompt);

  async function handleClick() {
    await fetchStreamedData();
  }

  return (
    <>
      <div className="flex flex-row items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center h-screen md:w-[50%]">
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="text-sm border border-gray-400 p-2 rounded-lg shadow-xl md:w-[70%] h-[30%]"
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
        </div>
        {/* <div className="flex flex-col items-center justify-center mt-6">
          <div className="w-[80%] max-w-4xl bg-gray-50 border-2 border-gray-200 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Generated Steps
            </h2>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <pre className="bg-white p-4 rounded-md text-sm text-gray-700 whitespace-pre-wrap break-words">
                {streamedData.length > 0 ? (
                  streamedData.map((step, index) => (
                    <div
                      key={Math.random() * 100000000000}
                      className="mb-4 pb-4 border-b border-gray-200"
                    >
                      <h3 className="font-semibold text-gray-900">
                        Step {index + 1}: {step.title}
                      </h3>
                      <code className="block mt-2 bg-gray-100 p-2 rounded">
                        {step.code}
                      </code>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">
                    No steps generated yet
                  </div>
                )}
              </pre>
            </div>
          </div>
        </div> */}

        <TestSandPack files={streamedData} />
      </div>
    </>
  );
}

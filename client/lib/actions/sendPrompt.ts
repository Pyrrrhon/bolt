"use server";
import axios from "axios";

export const sendPrompt = async (userPrompt: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/chat`,
      {
        userprompt: userPrompt,
      },
      {
        responseType: "stream",
      }
    );
    const stream = response.data as NodeJS.ReadableStream;

    const decoder = new TextDecoder("utf-8");
    let accumulatedData = "";

    stream.on("data", (chunk: Buffer) => {
      const chunkString = decoder.decode(chunk);
      accumulatedData += chunkString;

      const lines = accumulatedData.split("\n");
      accumulatedData = lines.pop() || "";

      // Process each complete line
      for (const line of lines) {
        if (line.startsWith("data:")) {
          const jsonString = line.slice(5).trim();

          try {
            console.log("Received data:", jsonString);
          } catch (err) {
            console.error("Failed to parse JSON:", jsonString);
          }
        }
      }
    });

    stream.on("end", () => {
      console.log("Stream ended.");
    });

    stream.on("error", (err: Error) => {
      console.error("Stream error:", err);
    });
  } catch (error) {
    console.error("Error sending prompt:", error);
  }
};

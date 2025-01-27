"use client"
import { useState } from "react";
import { parseXml, Step } from "../parser/xmlParser";

export const useParser = (userPrompt: string) => {
    const [streamedData, setStreamedData] = useState<Step[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    const fetchStreamedData = async () => {
        setIsLoading(true);
        setStreamedData([]);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userprompt: userPrompt }),
            });

            if (!response.body) {
                throw new Error('No response body');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedData = "";

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedData += chunk;

                const lines = accumulatedData.split(/\r?\n/);
                accumulatedData = lines.pop() || "";


                for (const line of lines) {
                    if (line.startsWith("data:")) {
                        const jsonString = line.slice(5).trim() + "\n";
                        try {
                            let cleanedJsonString = jsonString.replace(/<\/boltArtifact>.*?<boltArtifact[^>]*>/, '');
                            console.log("cleaned Json",cleanedJsonString)
                            cleanedJsonString = cleanedJsonString + '\n'

                            const parsedData = parseXml(cleanedJsonString);
                            
                            console.log(parsedData)



                            setStreamedData(prev => {
                                // Create a Set of existing IDs //for removing duplaictes
                                return [...prev, ...parsedData];
                            });
                        } catch (err) {
                            console.error("Failed to parse JSON:", jsonString);
                            console.error(err);
                        }
                    }
                }
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Error sending prompt:", error);
            setIsLoading(false);
        }
    };

    return {

        streamedData,
        isLoading,
        fetchStreamedData
    };
};

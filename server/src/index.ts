import { Hono } from "hono";
import {
  getSystemPrompt,
  STARTER_TEMPLATES,
  staterTemplateSelectionPrompt,
} from "@zicor/prompts";
import { reactPrompt } from "./test_prompt";
import { streamSSE } from "hono/streaming";
import { Candidate, Part } from "./types/llmResponse";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: CloudflareBindings }>();
app.use(cors())
app.post("/chat", async (c) => {
  try {
    const body = await c.req.json();
    const userprompt = body.userprompt;
    const messages = [
      { role: "model", parts: [{ text: `${getSystemPrompt()} ` }] },
      { role: "user", parts: [{ text: reactPrompt }] },
      {
        role: "user",
        parts: [
          {
            text: "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: userprompt }],
      },
    ];
    //const answer = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    //    messages,
    //    max_tokens: 120000,
    //    stream: false,
    //});

    console.log("messges", { contents: messages });

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?alt=sse&key=" +
      c.env.API_KEY;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [messages] }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response?.body?.getReader();
    let accumulatedData = "";

    return streamSSE(c, async (stream) => {
      while (true) {
        const { done, value } =
          (await reader?.read()) as ReadableStreamReadResult;
        if (done) {
          break;
        }
        const chunk = new TextDecoder().decode(value);
        accumulatedData += chunk.replace(/^data:\s*/, "");
        try {
          if (isCompleteJSON(accumulatedData)) {
            const parsedChunk = JSON.parse(accumulatedData);
            const text = parsedChunk.candidates
              .map((candidate: Candidate) =>
                candidate.content.parts.map((part: Part) => part.text).join("")
              )
              .join("");
            console.log(text);
            await stream.writeSSE({
              data: text,
            });
            accumulatedData = "";
          }
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
        }
      }
    });

    //return stream(c, stream => stream.pipe(response.body));
  } catch (err) {
    console.log("ERROR:", err);
    return Response.json({ err });
  }
  //return new Response(answer as BodyInit, {
  //    headers: { "content-type": "text/event-stream" }
  //})
});

app.post("/template", async (c) => {
  const body = await c.req.json();
  const prompt = body.prompt;
  console.log("Prompt:", prompt);
  const messages = [
    {
      role: "system",
      content: staterTemplateSelectionPrompt(STARTER_TEMPLATES),
    },
    {
      role: "user",
      content: prompt,
    },
  ];
  const answer = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages,
    stream: false,
  });

  return Response.json(answer);
});

export default app;

function isCompleteJSON(data: string): boolean {
  return data.trim().startsWith("{") && data.trim().endsWith("}");
}

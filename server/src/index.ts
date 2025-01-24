import { Hono } from 'hono'
import { getSystemPrompt, STARTER_TEMPLATES, staterTemplateSelectionPrompt } from "@zicor/prompts"
import { reactPrompt } from "./test_prompt"

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get('/', async (c) => {
    try {
        const messages = [
            { role: "model", parts: [{  "text": getSystemPrompt() }]},
            { role: "user", parts: [{  "text": reactPrompt }] },
            { role: "user", parts: [{'text': 'For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.'}]},
                {
                    role: "user",
                    parts: [{"text":"Create todo application"}],
                },
        ];
        //const answer = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        //    messages,
        //    max_tokens: 120000,
        //    stream: false,
        //});

        console.log("messges", { contents: messages })

        const url =      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=" + c.env.API_KEY

         const response = await fetch(
             "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=",
                 {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ contents: [messages] }),
             }
         );


        // const reader = response.body.getReader();
        // while (true) {
        // const { done, value } = await reader.read();
        // if (done) {
        //     break;
        // }
        // const chunk = new TextDecoder("utf-8").decode(value);

        // console.log("Chunk:", chunk.slice(6))      
        // console.log(JSON.parse(chunk.slice(6)));
        // } 
        const reader = response.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            const chunk = new TextDecoder("utf-8").decode(value);

            const parsedChunk = JSON.parse(chunk.slice(6));
            const text = parsedChunk.candidates
            .map(candidate => candidate.content.parts.map(part => part.text).join('')) // Join parts into a single string
            .join(''); // Join all candidates into a single string
            console.log("Text:", text);

        }
        console.log("Response:",response)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

            return new Response(response, {
                headers: { "content-type": "text/event-stream" }
            })

            //return Response.json(answer)
        } catch (err){
            console.log("ERROR:", err)
            return Response.json({err})
        }
        //return new Response(answer as BodyInit, {
        //    headers: { "content-type": "text/event-stream" }
        //})
    });

    app.post('/template', async (c) => {
        const body = await c.req.json()
        const prompt = body.prompt
        console.log("Prompt:", prompt)
        const messages = [
            { role: "system", content: staterTemplateSelectionPrompt(STARTER_TEMPLATES) },
            {
                role: "user",
                content: prompt, 
            },
        ];
        const answer = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            messages,
            stream: false,
        })

        return Response.json(answer)
    })

    export default app;


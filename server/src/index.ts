import { Hono } from 'hono'
import { getSystemPrompt, STARTER_TEMPLATES, staterTemplateSelectionPrompt } from "@zicor/prompts"
import { reactPrompt } from "./test_prompt"

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get('/', async (c) => {
    try {
        const messages = [
            { role: "system", content: getSystemPrompt() },
            { role: "user", content: reactPrompt },
            { role: "user", content: 'For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.'},
                {
                    role: "user",
                    content: "Create todo application",
                },
        ];
        const answer = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            messages,
            stream: false
        });

        return Response.json(answer)
    } catch (err){
        console.log("ERROR:", err)
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


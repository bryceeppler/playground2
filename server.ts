import { loadData } from "./data.ts";
import { styles } from "./styles.ts";
import { createHtmlTemplate } from "./template.ts";

async function createHtml(): Promise<string> {
    const data = await loadData();
    return createHtmlTemplate(JSON.stringify(data));
}

async function handler(_req: Request): Promise<Response> {
    const html = await createHtml();
    return new Response(html, {
        headers: {
            "content-type": "text/html",
        },
    });
}

console.log("Server running on http://localhost:8000");
Deno.serve(handler, { port: 8000 });
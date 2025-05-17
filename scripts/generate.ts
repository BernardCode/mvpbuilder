import { writeFileSync, mkdirSync } from "fs";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

async function main() {
  const prompt = process.argv.slice(2).join(" ");
  if (!prompt) throw new Error("Pass a description in quotes");

  const system = `
You are a full-stack web app generator using the Next.js + Supabase stack.
Return a JSON array of objects like { filename, content }.
Include:
- pages/index.tsx
- any components needed
- supabase setup
- realistic mock data if needed
  `;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.2,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
  });

  const json = JSON.parse(res.choices[0].message.content!);
  for (const file of json) {
    mkdirSync(require("path").dirname(file.filename), { recursive: true });
    writeFileSync(file.filename, file.content);
  }

  console.log("✅ Files generated!");
}

main();

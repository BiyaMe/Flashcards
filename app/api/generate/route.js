import { NextResponse } from "next/server";
import OpenAI from "openai";
//const { GoogleGenerativeAI } = require("@google/generative-ai");
// import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `
You are a flashcard creator

1. Create clear and concise questions for the front of the flashcard.
2. Create detailed answers for the back of the flashcard.
3. Use bullet points to list out key information.
4. Use headings to organize information into sections.
5. Use bold text to emphasize important information.
6. Use italics to indicate examples.
7. Use underline to indicate definitions.
8. Use a question and answer format to reinforce learning.
9. Include variety of question types, such as definitions, examples, comparisons, and explanations.
10. Only generate 10 Flashcards

Remember, the goal is to facilitate learning and retention of information through these flashcards.


Return in the following JSON format:
{
    "flashcards":[
        "front": "str",
        "back": "str"
    ]
}
`

export async function POST(req){
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            {role: 'user', content: data}
        ],
        model: 'gpt-4o-mini',
        response_format:{type: 'json_object'}
    })

    const flashcards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcards)
}

// Access your API key as an environment variable (see "Set up your API key" above)


// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// export async function POST(req) {
//     try {
//         const data = await req.text();

// const completion = await genAI.chat.completions.create({
//     messages: [
//         { role: 'system', content: systemPrompt },
//         { role: 'user', content: data }
//     ],
//     model: 'gemini-1.5-flash',
//     response_format: { type: 'json_object' }
// });

//         const completion = await genAI.flashcards.create({
//             prompt: data,
//             max_tokens: 100,
//             temperature: 0.5,
//             top_p: 1,
//             frequency_penalty: 0,
//             presence_penalty: 0,
//             stop: ['\n']
//         });


//         if (completion && completion.choices && completion.choices[0].message) {
//             const flashcards = JSON.parse(completion.choices[0].message.content);
//             return NextResponse.json(flashcards.flashcards);
//         } else {
//             return NextResponse.error("Completion data is invalid or missing.");
//         }
//     } catch (error) {
//         console.error("An error occurred:", error);
//         return NextResponse.error("An error occurred. Please check the server logs for more details.");
//     }
// }
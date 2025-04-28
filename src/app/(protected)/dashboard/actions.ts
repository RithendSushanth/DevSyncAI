// 'use server'
// import { streamText } from 'ai'
// import { createStreamableValue } from 'ai/rsc'
// import { createGoogleGenerativeAI } from '@ai-sdk/google'
// import { generateEmbedding } from '@/lib/gemini'
// import { db } from '@/server/db'

// const google = createGoogleGenerativeAI({
//     apiKey: process.env.GEMINI_API_KEY,
// })

// export async function askQuestion(question: string, projectId: string) {
//     const stream = createStreamableValue()
//     const queryVector = await generateEmbedding(question)
//     // console.log("Generated Query Vector:", queryVector);
//     const vectorQuery = `[${queryVector.join(',')}]`



//     const result = await db.$queryRaw`
//     SELECT "fileName", "sourceCode", "summary",
//     1 - ("summaryEmbeddings" <=> ${vectorQuery}::vector) AS similarity
//     FROM "SourceCodeEmbeddings"
//     WHERE 1 - ("summaryEmbeddings" <=> ${vectorQuery}::vector) > .5
//     AND "projectId" = ${projectId}
//     ORDER BY similarity DESC
//     LIMIT 10
//     ` as { fileName: string, sourceCode: string, summary: string }[]

//     let context = ""
//     for (const doc of result) {
//         context += `source: ${doc.fileName}\n code content: ${doc.sourceCode}\n summary of the file: ${doc.summary}\n\n`
//     }

//     // console.log("Database Query Result:", result);
//     // console.log("Generated Context for AI Model:\n", context);

//     (async () => {
//         const { textStream } = await streamText({
//             model: google('gemini-1.5-flash'),
//             prompt: `
// You are an AI code assistant who answers questions about the codebase. Your target audience is a technical intern who needs clear, concise guidance.

// AI assistant is a brand new, powerful, human-like artificial intelligence designed to provide coding help.
// The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
// AI is a well-behaved and well-mannered individual who communicates professionally.
// AI is always friendly, kind, and inspiring, and it is eager to provide vivid and thoughtful responses to the user.
// AI has extensive programming knowledge in its memory, and is able to accurately answer nearly any question about any topic in software development, algorithms, and coding practices.
// If the question is asking about code or a specific file, AI will provide the detailed answer, giving step by step instructions when needed and including code examples that clearly demonstrate the solution.

// START CONTEXT BLOCK
// ${context}
// END OF CONTEXT BLOCK

// START QUESTION
// ${question}
// END OF QUESTION

// AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
// If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer based on the provided context. I can help you look for this information elsewhere in the codebase if you provide additional details."
// AI assistant will not apologize for previous responses, but instead will indicate when new information was gained that changes its understanding.
// AI assistant will not invent anything that is not drawn directly from the context.
// Answer in markdown syntax, with code snippets properly formatted. Be as detailed as possible when answering, highlighting important concepts for the intern to understand.
// When showing code examples, AI will explain what the code does line by line when beneficial for learning.
// AI will prioritize clarity over brevity, ensuring the technical intern fully understands both the solution and the underlying principles.
// For complex topics, AI will break down information into manageable sections with clear headings.
// AI will suggest additional resources or documentation when appropriate to help deepen the intern's understanding.

// Remember that your goal is to both solve the immediate problem and build the intern's capabilities for future challenges.
//             `
//         });

//         for await (const delta of textStream) {
//             stream.update(delta);
//         }

//         stream.done();
//     })()

//     return {
//         output: stream.value,
//         filesReferences: result
//     }
// }






'use server'

import { streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateEmbedding } from '@/lib/gemini'
import { db } from '@/server/db'

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
})

export async function askQuestion(question: string, projectId: string) {
    const stream = createStreamableValue()
    const queryVector = await generateEmbedding(question)

    const vectorQuery = `[${queryVector.join(',')}]`

    const result = await db.$queryRaw`
        SELECT "fileName", "sourceCode", "summary",
        1 - ("summaryEmbeddings" <=> ${vectorQuery}::vector) AS similarity
        FROM "SourceCodeEmbeddings"
        WHERE 1 - ("summaryEmbeddings" <=> ${vectorQuery}::vector) > .5
        AND "projectId" = ${projectId}
        ORDER BY similarity DESC
        LIMIT 20
    ` as { fileName: string, sourceCode: string, summary: string }[]

    let context = ""
    for (const doc of result) {
        context += `\nFile: ${doc.fileName}\n\nImportant Code Content:\n${doc.sourceCode}\n\n---\nSummary:\n${doc.summary}\n\n`
    }

    (async () => {
        const { textStream } = await streamText({
            model: google('gemini-1.5-flash'),
            prompt: `
You are an expert AI assistant answering questions about a codebase.
You have access to the following project context:

START CONTEXT
${context}
END CONTEXT

START QUESTION
${question}
END QUESTION

Instructions:
- Base your answers only on the context.
- If the answer isn't in the provided context, reply: "I'm sorry, I cannot find enough information in the code context."
- Explain code snippets line by line if complex.
- Use markdown formatting for clear code examples.
- Be very detailed and easy to follow for junior developers.
            `
        });

        for await (const delta of textStream) {
            stream.update(delta);
        }

        stream.done();
    })()

    return {
        output: stream.value,
        filesReferences: result
    }
}

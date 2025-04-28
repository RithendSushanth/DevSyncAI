// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Document } from "langchain/document";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
// });

// export const aiSummariseCommit = async (diff: string) => {
//     // Fetch AI-generated summary
//     const response = await model.generateContent([
//         `You are an expert programmer, and you are trying to summarize a git diff.

//         Reminders about the git diff format:
//         For every file, there are a few metadata lines, like (for example):
//         \`\`\`
//         diff --git a/lib/index.js b/lib/index.js  
//         index aadf691..bfef603 100644  
//         --- a/lib/index.js  
//         +++ b/lib/index.js  
//         \`\`\`
//         This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.  
//         Then there is a specifier of the lines that were modified.  
//         A line starting with \`+\` means it was added.  
//         A line that starts with \`-\` means that line was deleted.  
//         A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.  
//         It is not part of the diff.  
//         [...]

//         EXAMPLE SUMMARY COMMENTS:
//         \`\`\`
//         * Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]  
//         * Fixed a typo in the GitHub action name [.github/workflows/gpt-commit-summarizer.yml]  
//         * Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]  
//         * Added an OpenAI API for completions [packages/utils/apis/openai.ts]  
//         * Lowered numeric tolerance for test files  
//         \`\`\`

//         Most commits will have fewer comments than this example list.  
//         The last comment does not include the file names,  
//         because there were more than two relevant files in the hypothetical commit.  
//         Do not include parts of the example in your summary.
//         It is given only as an example of appropriate comments.`,
//         `Please summarise the following diff file: \n\n${diff}`,
//     ]);

//     // Ensuring the function returns the summary
//     return response.response.text();
// };


// export async function summariseCode(doc: Document) {
//     // console.log("getting summary for: ", doc.metadata.source);

//     try {
//         const code = doc.pageContent.slice(0, 10000);
//         const response = await model.generateContent([
//             `you are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects`,
//             `you are onboarding a junior software engineer and exploring to them the purpose of the ${doc.metadata.source} file
//     Here is the code:
//     -------
//     ${code}
//     -------
//         Please give a summary no more than 100 words of the code above`
//         ]);
//         return response.response.text();
//     } catch (error) {
//         return "";
//     }
// }

// export async function generateEmbedding(summary: string) {
//     const model = genAI.getGenerativeModel({
//         model: "text-embedding-004"
//     })
//     const result = await model.embedContent(summary)
//     const embedding = result.embedding
//     return embedding.values
// }



// // console.log(await aiSummariseCommit(''));



import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "langchain/document";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const flashModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

export async function summariseCode(doc: Document) {
    try {
        const code = doc.pageContent.slice(0, 10000);
        const response = await flashModel.generateContent([
            `You are onboarding a junior developer to this project.`,
            `Here is the code file: ${doc.metadata.source}\n
            \n---\n
            ${code}
            \n---\n
            Please provide a clear short description (50-100 words) of what this file mainly does.`
        ]);
        return response.response.text();
    } catch (error) {
        return "";
    }
}

export async function generateEmbedding(content: string) {
    const embedModel = genAI.getGenerativeModel({
        model: "text-embedding-004"
    })
    const result = await embedModel.embedContent(content)
    const embedding = result.embedding
    return embedding.values
}

// NEW: Summarize Git Diff commits
export const aiSummariseCommit = async (diff: string) => {
    const response = await flashModel.generateContent([
        `You are an expert programmer, and you are trying to summarize a git diff.

        Reminders about the git diff format:
        For every file, there are metadata lines, like:
        \`\`\`
        diff --git a/lib/index.js b/lib/index.js  
        index aadf691..bfef603 100644  
        --- a/lib/index.js  
        +++ b/lib/index.js  
        \`\`\`
        Meaning that 'lib/index.js' was modified.

        A line starting with '+' means it was added.
        A line starting with '-' means it was deleted.
        Lines starting with neither '+' nor '-' are context only.

        EXAMPLE SUMMARY COMMENTS:
        \`\`\`
        * Increased returned recordings from 10 to 100 [packages/server/recordings_api.ts], [packages/server/constants.ts]
        * Fixed typo in GitHub Action [.github/workflows/gpt-commit-summarizer.yml]
        * Moved octokit initialization to separate file [src/octokit.ts], [src/index.ts]
        * Added OpenAI completions API [packages/utils/apis/openai.ts]
        * Lowered numeric tolerance for tests
        \`\`\`

        Notes:
        - Most commits will have fewer comments than this list.
        - Do not copy parts from this example.
        - Focus on what really changed.`,
        `Please summarise the following diff file:\n\n${diff}`
    ]);

    return response.response.text();
}

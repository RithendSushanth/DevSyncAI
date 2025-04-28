// import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github"
// import { Document } from "langchain/document"
// import { generateEmbedding, summariseCode } from "./gemini"
// import { db } from "@/server/db"



// const fetchDefaultBranch = async (githubUrl: string, githubToken?: string) => {
//     const urlParts = githubUrl.replace("https://github.com/", "").split("/");
//     const [owner, repo] = urlParts;
//     if (!owner || !repo) throw new Error("Invalid GitHub URL");

//     const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
//         headers: {
//             Authorization: `Bearer ${githubToken || process.env.GITHUB_TOKEN}`,
//             Accept: "application/vnd.github.v3+json",
//         },
//     });

//     if (!res.ok) {
//         throw new Error(`Failed to fetch repo info: ${res.statusText}`);
//     }

//     const repoInfo = await res.json();
//     return repoInfo.default_branch || "main"; // fallback to 'main' if missing
// };

// export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
//     const defaultBranch = await fetchDefaultBranch(githubUrl, githubToken);
//     const loader = new GithubRepoLoader(githubUrl, {
//         accessToken: githubToken || process.env.GITHUB_TOKEN,
//         branch: defaultBranch,
//         ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
//         recursive: true,
//         unknown: 'warn',
//         maxConcurrency: 5,
//     })
//     const docs = await loader.load()
//     return docs
// }


// export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
//     const docs = await loadGithubRepo(githubUrl, githubToken)
//     const allEmbeddings = await generateEmbeddings(docs)
//     await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
//         // console.log(`processing ${index} of ${allEmbeddings.length}`)
//         if (!embedding) {
//             return
//         }

//         const sourceCodeEmbedding = await db.sourceCodeEmbeddings.create({
//             data: {
//                 summary: embedding.summary,
//                 sourceCode: embedding.sourceCode,
//                 fileName: embedding.fileName,
//                 projectId,
//             }
//         })

//         await db.$executeRaw`
//             UPDATE "SourceCodeEmbeddings"
//             SET "summaryEmbeddings" = ${embedding.embedding}::vector
//             WHERE "id" = ${sourceCodeEmbedding.id};
//         `

//     }))
// }

// const generateEmbeddings = async (docs: Document[]) => {
//     return await Promise.all(docs.map(async (doc) => {
//         const summary = await summariseCode(doc)
//         const embedding = await generateEmbedding(summary)

//         return {
//             summary,
//             embedding,
//             sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
//             fileName: doc.metadata.source,
//         }
//     }))
// }

// // console.log(await loadGithubRepo(' https://github.com/docker/genai-stack'));



import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github"
import { Document } from "langchain/document"
import { generateEmbedding } from "./gemini"
import { db } from "@/server/db"

const fetchDefaultBranch = async (githubUrl: string, githubToken?: string) => {
    const urlParts = githubUrl.replace("https://github.com/", "").split("/");
    const [owner, repo] = urlParts;
    if (!owner || !repo) throw new Error("Invalid GitHub URL");

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
            Authorization: `Bearer ${githubToken || process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch repo info: ${res.statusText}`);
    }

    const repoInfo = await res.json();
    return repoInfo.default_branch || "main";
};

export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const defaultBranch = await fetchDefaultBranch(githubUrl, githubToken);
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || process.env.GITHUB_TOKEN,
        branch: defaultBranch,
        ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
        recursive: true,
        unknown: 'warn',
        maxConcurrency: 5,
    })
    const docs = await loader.load()
    return docs
}

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken)
    const allEmbeddings = await generateEmbeddings(docs)
    await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
        if (!embedding) {
            return
        }

        const sourceCodeEmbedding = await db.sourceCodeEmbeddings.create({
            data: {
                summary: embedding.summary,
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName,
                projectId,
            }
        })

        await db.$executeRaw`
            UPDATE "SourceCodeEmbeddings"
            SET "summaryEmbeddings" = ${embedding.embedding}::vector
            WHERE "id" = ${sourceCodeEmbedding.id};
        `
    }))
}

const generateEmbeddings = async (docs: Document[]) => {
    return await Promise.all(docs.map(async (doc) => {
        const codeChunk = doc.pageContent.slice(0, 5000) // Use first 5000 characters safely
        const embedding = await generateEmbedding(codeChunk)

        return {
            summary: "", // no need to summarise for embeddings anymore
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source,
        }
    }))
}

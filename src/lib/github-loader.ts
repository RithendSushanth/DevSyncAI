import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github"
import { Document } from "langchain/document"
import { generateEmbedding, summariseCode } from "./gemini"
import { db } from "@/server/db"

export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || process.env.GITHUB_TOKEN,
        branch: 'main',
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
        // console.log(`processing ${index} of ${allEmbeddings.length}`)
        if (!embedding) {
            return
        }

        const sourceCodeEmbedding = await db.sourceCodeEmbeddings.create({
            data:{
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
        const summary = await summariseCode(doc)
        const embedding = await generateEmbedding(summary)

        return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source,
        }
    }))
}

// console.log(await loadGithubRepo(' https://github.com/docker/genai-stack'));

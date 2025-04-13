import { db } from "@/server/db";
import { Octokit } from "@octokit/rest";
import { string } from "zod";
import axios from "axios";
import { aiSummariseCommit } from "./gemini";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});


const githubUrl = 'https://github.com/RithendSushanth/Cal-Ease';

type Response = {
    commitMessage: string
    commitHash: string
    commitAuthorName: string
    commitAuthorAvatar: string
    commitDate: string
}

//@ts-ignore
export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const [owner, repo] = githubUrl.split('/').slice(-2);
    if (!owner || !repo) {
        throw new Error('Invalid GitHub URL')
    }
    const { data } = await octokit.repos.listCommits({
        owner,
        repo,
    })

    const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[];

    return sortedCommits.slice(0, 10).map((commit) => ({
        commitHash: commit.sha as string,
        commitMessage: commit.commit?.message ?? "",
        commitAuthorName: commit.commit?.author?.name ?? commit.author?.login ?? "",
        commitAuthorAvatar: commit.author?.avatar_url ?? "",
        commitDate: commit.commit?.author?.date ?? "",
    }));

};


// console.log(await getCommitHashes(githubUrl));


// getCommitHashes(githubUrl);


export const pollCommits = async (projectId: string) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
    if (!githubUrl) {
        throw new Error(`No GitHub URL found for project ID: ${projectId}`);
    }

    const commitHashes = await getCommitHashes(githubUrl);
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);

    const summaryResponses = await Promise.allSettled(unprocessedCommits.map((commit) => {
       return  summariseCommit(githubUrl, commit.commitHash)
    }))

    const summaries = summaryResponses.map((response) => {
        if (response.status === 'fulfilled') {
            return response.value as string
        }
        return ''
    })

    const commits = await db.commit.createMany({
        data: summaries.map((summary, index) => {
            if (!unprocessedCommits || !unprocessedCommits[index]) {
                throw new Error('Unprocessed commit not found');
            }
            return {
                projectId,
                commitHash: unprocessedCommits[index]!.commitHash,
                commitMessage: unprocessedCommits[index]!.commitMessage,
                commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                commitDate: unprocessedCommits[index]!.commitDate,
                summary,
            };
        }),
    });

    // console.log("Unprocessed commits:", unprocessedCommits);
    return commits;
};

async function summariseCommit(githubUrl: string, commitHash: string) {
    //get the diff, then pass the diff to the ai
    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers: {
            Accept: "application/vnd.github.v3.diff"
        }
    })
    return await aiSummariseCommit(data) || ""
}


async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: {
            id: projectId
        },
        select: {
            githubUrl: true
        }
    })
    if (!project?.githubUrl) {
        throw new Error('Project not found')
    }

    return { project, githubUrl: project?.githubUrl }
}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany({
        where: {
            projectId: projectId
        }
    });

    const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash))
    return unprocessedCommits

}


// pollCommits()
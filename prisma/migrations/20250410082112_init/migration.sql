-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "emailAddress" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 150,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "githubUrl" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToProject" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "UserToProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceCodeEmbeddings" (
    "id" TEXT NOT NULL,
    "summaryEmbeddings" vector(768),
    "sourceCode" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "SourceCodeEmbeddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "commitMessage" TEXT NOT NULL,
    "commitHash" TEXT NOT NULL,
    "commitAuthorName" TEXT NOT NULL,
    "commitAuthorAvatar" TEXT NOT NULL,
    "commitDate" TEXT NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "Commit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_emailAddress_key" ON "User"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "UserToProject_userId_projectId_key" ON "UserToProject"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "UserToProject" ADD CONSTRAINT "UserToProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToProject" ADD CONSTRAINT "UserToProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceCodeEmbeddings" ADD CONSTRAINT "SourceCodeEmbeddings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

"use client"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Github } from 'lucide-react'

type FormInput = {
  repoUrl: string
  projectName: string
  githubToken?: string
}

const CreatePage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInput>()
  const createProject = api.project.createProject.useMutation()
  const refetch = useRefetch()
  const [isPrivateRepo, setIsPrivateRepo] = useState(false)

  function onSubmit(data: FormInput) {
    createProject.mutate({
      githubUrl: data.repoUrl,
      name: data.projectName,
      githubToken: data.githubToken
    }, {
      onSuccess: () => {
        toast.success('Project created successfully')
        refetch()
        reset()
      },
      onError: (error) => {
        toast.error(`Error creating project: ${error.message || 'Please try again'}`)
      }
    })
    return true
  }

  // Handle URL input change to detect if a token might be needed
  const handleRepoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simple check if URL contains 'private' or other indicators
    const url = e.target.value.toLowerCase()
    if (url.includes('private')) {
      setIsPrivateRepo(true)
    } else {
      setIsPrivateRepo(false)
    }
  }

  return (
    <div className="container mx-auto py-12 flex flex-col md:flex-row items-center justify-center gap-8">
      <div className="w-full md:w-1/2 flex justify-center">
        <img src="/undraw_code-review.svg" alt="Code Review" className="max-w-full h-64 md:h-96" />
      </div>
      
      <Card className="w-full md:w-1/2 max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" /> Link GitHub Repository
          </CardTitle>
          <CardDescription>
            Connect your GitHub repository to enhance it with AI capabilities
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form id="create-project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="projectName" className="text-sm font-medium block mb-1">
                Project Name
              </label>
              <Input
                id="projectName"
                {...register('projectName', {
                  required: 'Project name is required'
                })}
                placeholder="My Awesome Project"
                className={errors.projectName ? "border-red-500" : ""}
              />
              {errors.projectName && (
                <p className="text-red-500 text-xs mt-1">{errors.projectName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="repoUrl" className="text-sm font-medium block mb-1">
                GitHub Repository URL
              </label>
              <Input
                id="repoUrl"
                {...register('repoUrl', {
                  required: 'Repository URL is required',
                  pattern: {
                    value: /^https?:\/\/github\.com\/[^\/]+\/[^\/]+/,
                    message: 'Enter a valid GitHub repository URL'
                  }
                })}
                placeholder="https://github.com/username/repo"
                type="url"
                className={errors.repoUrl ? "border-red-500" : ""}
                onChange={handleRepoUrlChange}
              />
              {errors.repoUrl && (
                <p className="text-red-500 text-xs mt-1">{errors.repoUrl.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="githubToken" className="text-sm font-medium block mb-1">
                GitHub Token {isPrivateRepo && <span className="text-red-500">*</span>}
              </label>
              <Input
                id="githubToken"
                {...register('githubToken', {
                  required: isPrivateRepo ? 'Token required for private repositories' : false
                })}
                placeholder="ghp_123456789abcdef"
                type="password"
                className={errors.githubToken ? "border-red-500" : ""}
              />
              {errors.githubToken && (
                <p className="text-red-500 text-xs mt-1">{errors.githubToken.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {isPrivateRepo 
                  ? "A GitHub token with repo scope is required for private repositories" 
                  : "Optional for public repositories"}
              </p>
            </div>
          </form>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            form="create-project-form"
            className="w-full" 
            disabled={createProject.isPending}
          >
            {createProject.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Project"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CreatePage
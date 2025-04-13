"use client"
import { Input } from '@/components/ui/input'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormInput = {
    repoUrl: string
    projectName: string
    githubToken?: string
}

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>()
    const createProject = api.project.createProject.useMutation()
    const refetch = useRefetch()

    function onSubmit(data: FormInput) {
        // window.alert(JSON.stringify(data))
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
            onError: () => {
                toast.error('Error creating project')
            }
        })
        return true
    }
    return (
        <div className='flex items-center gap-12 h-full justify-center'>
            <img src='/undraw_code-review.svg' className='h-56 w-auto' />
            <div>
                <div>
                    <h1 className='font-semibold text-2xl'>
                        Link your Github Repository
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Enter the URL to your Github repository to link it to github-ai
                    </p>
                </div>
                <div className='h-4'></div>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            {...register('projectName', {
                                required: true
                            })}
                            placeholder='Project Name'
                            required
                        />
                        <div className='h-4'></div>
                        <Input
                            {...register('repoUrl')}
                            placeholder='https://github.com/username/repo'
                            required
                            type='url'
                        />
                        <div className='h-4'></div>
                        <Input
                            {...register('githubToken')}
                            placeholder='Github Token'
                        />
                        <div className='h-4'></div>
                        <button type='submit' className='btn btn-primary' disabled={createProject.isPending}>
                            Create Project
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
} 

export default CreatePage

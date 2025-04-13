"use client"
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import { MenubarMenu } from '@radix-ui/react-menubar'
import React from 'react'

const TeamMembers = () => {
    const { projectId } = useProject()
    const { data: members } = api.project.getTeamMembers.useQuery({ projectId })
    return (
        <div className='flex items-center gap-2'>
            {members?.map((member) => {
                return <img key={member.id} className='rounded-full' src={member.user.imageUrl ?? ""} alt={member.user.firstName ?? ""} height={30} width={30} />
            })}
        </div>
    )
}

export default TeamMembers

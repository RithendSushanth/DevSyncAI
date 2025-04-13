"use client"
import useProject from '@/hooks/use-project';
import { useUser } from '@clerk/nextjs';
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import CommitLog from './commit-log';
import AskQuestionCard from './ask-question-card';
import ArchiveButton from './archive-button';
// import InviteButton from './invite-button';
const InviteButton = dynamic(() => import('./invite-button'), { ssr: false })
import TeamMembers from './team-members';
import dynamic from 'next/dynamic';
// import MeetingCard from './meeting-card';

const DashboardPage = () => {
  const { project } = useProject()
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap y-4">
        {/* github link  */}
        <div className='w-fit rounded-md bg-primary px-4 py-3'>
          <div className="flex items-center">
            <Github className='size-5 text-white' />
            <div className='ml-2'>
              <p className='text-sm font-medium text-white'>
                This project is linked to {' '}
                <Link href={project?.githubUrl ?? ""} className='inline-flex text-white/80 hover:underline '>
                  {project?.githubUrl}
                  <ExternalLink className='ml-2 size-4' />
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/*  */}
        <div className="h-4"></div>
        <div className="flex items-center gap-4 ">
          <TeamMembers />
          <InviteButton />
          <ArchiveButton />
        </div>


      </div>

      {/*  */}
      <div className="mt-4"></div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-5'>
        <div className="sm:col-span-5">
          <AskQuestionCard />
          {/* <MeetingCard /> */}
        </div>
      </div>


      {/* commit */}
      <div className="mt-8"></div>
      <CommitLog />
    </div>

  )
}

export default DashboardPage

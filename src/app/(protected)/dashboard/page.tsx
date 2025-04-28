"use client"
import useProject from '@/hooks/use-project';
import { useUser } from '@clerk/nextjs';
import { ExternalLink, Github, GitCommit, MessageSquare, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import CommitLog from './commit-log';
import AskQuestionCard from './ask-question-card';
import ArchiveButton from './archive-button';
import TeamMembers from './team-members';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dynamic import for the invite button
const InviteButton = dynamic(() => import('./invite-button'), { ssr: false })

const DashboardPage = () => {
  const { project } = useProject();
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{project?.name || "Project Dashboard"}</h1>
          <p className="text-gray-500">Get insights into your project and collaborate with your team</p>
        </div>

        <div className="flex items-center gap-3">
          <TeamMembers />
          <InviteButton />
          <ArchiveButton />
        </div>
      </div>

      {/* GitHub Link Card */}
      <Card className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Github className="size-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-white">GitHub Repository</h3>
                <Link 
                  href={project?.githubUrl ?? ""} 
                  className="flex items-center text-white/80 hover:text-white transition-colors mt-1 text-sm"
                >
                  {project?.githubUrl}
                  <ExternalLink className="ml-2 size-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm py-2 px-4 rounded-lg text-white/90 text-sm">
              Last synced: Today at 10:45 AM
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full mb-8">
        <TabsList className="grid grid-cols-3 lg:w-[400px] mb-6">
          <TabsTrigger value="overview" className="text-base py-3">Overview</TabsTrigger>
          <TabsTrigger value="activity" className="text-base py-3">Activity</TabsTrigger>
          <TabsTrigger value="settings" className="text-base py-3">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-8">
          {/* AI Assistant Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="size-5 text-indigo-600" />
              <h2 className="text-2xl font-semibold">Ask AI Assistant</h2>
            </div>
            <AskQuestionCard />
          </section>
          
          {/* Commit Log Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <GitCommit className="size-5 text-indigo-600" />
                <h2 className="text-2xl font-semibold">Recent Commits</h2>
              </div>
              <Link href="/commits" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View all commits →
              </Link>
            </div>
            <Card>
              <CardContent className="p-6">
                <CommitLog />
              </CardContent>
            </Card>
          </section>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>View all recent activities in this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                Activity timeline will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>Manage your project configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                Project settings will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Team Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Users className="size-5 text-indigo-600" />
          <h2 className="text-2xl font-semibold">Team Activity</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People with access to this project</CardDescription>
            </CardHeader>
            <CardContent>
              {/* @ts-ignore */}
              <TeamMembers expanded={true} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Contributions</CardTitle>
              <CardDescription>Activity from team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                Team activity will appear here
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
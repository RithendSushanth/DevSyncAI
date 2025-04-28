"use client"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area" // ✅ Added scroll-area
import useProject from "@/hooks/use-project"
import { cn } from "@/lib/utils"
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation, ChevronRight, Code } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Q&A", url: "/qa", icon: Bot },
  { title: "Meetings", url: "/meetings", icon: Presentation },
  { title: "Billing", url: "/billing", icon: CreditCard },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { open } = useSidebar()
  const { projects, setProjectId, projectId } = useProject()

  return (
    <Sidebar collapsible="icon" variant="floating" className="border-r bg-white/80 backdrop-blur-sm z-20 h-full">
      <SidebarHeader className="pb-4 pt-4 md:pb-6">
        <Link href="/dashboard" className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2">
          <Image src="/logo.png" alt="logo" width={40} height={40} className="w-8 h-8 md:w-10 md:h-10" />
          {open && (
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold tracking-tight">
                <span className="text-black">Dev</span>
                <span className="text-indigo-600">Sync</span>
              </span>
              <span className="text-[10px] md:text-xs font-medium text-indigo-400 -mt-1">AI ASSISTANT</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 overflow-hidden">
        {/* ✅ Wrap Sidebar content inside ScrollArea */}
        <ScrollArea className="h-[calc(100vh-120px)] pr-2">
          {/* Application Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 px-3 mb-2">
              NAVIGATION
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-all",
                          pathname === item.url
                            ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md"
                            : "hover:bg-indigo-50 text-gray-700",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-4 h-4 md:w-5 md:h-5",
                            pathname === item.url ? "text-white" : "text-indigo-500",
                          )}
                        />
                        <span className="font-medium text-sm md:text-base">{item.title}</span>
                        {pathname === item.url && open && (
                          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-auto text-white/70" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Projects Section */}
          <SidebarGroup className="mt-4 md:mt-6">
            <SidebarGroupLabel className="flex justify-between items-center px-2 md:px-3 mb-1 md:mb-2">
              <span className="text-xs font-semibold text-gray-500">PROJECTS</span>
              {open && (
                <span className="text-[10px] md:text-xs font-medium bg-indigo-100 text-indigo-600 px-1.5 md:px-2 py-0.5 rounded-full">
                  {projects?.length || 0}
                </span>
              )}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {/* ✅ Limit the height of the projects list */}
              <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
                <SidebarMenu>
                  {projects?.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        <div
                          onClick={() => setProjectId(item.id)}
                          className={cn(
                            "flex items-center gap-2 md:gap-3 cursor-pointer px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all",
                            item.id === projectId ? "bg-indigo-50" : "hover:bg-gray-50",
                          )}
                        >
                          <div
                            className={cn(
                              "rounded-lg size-6 md:size-8 flex items-center justify-center text-xs md:text-sm font-medium shadow-sm shrink-0",
                              item.id === projectId
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-indigo-600 border border-indigo-100",
                            )}
                          >
                            {/* @ts-ignore */}
                            {item.name[0]?.toUpperCase() || "?"}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span
                              className={cn(
                                "font-medium text-sm md:text-base truncate max-w-[140px] md:max-w-[200px]",
                                item.id === projectId ? "text-indigo-900" : "text-gray-700",
                              )}
                            >
                              {item.name}
                            </span>
                            {open && (
                              <span className="text-[10px] md:text-xs text-gray-500 truncate">
                              </span>
                            )}
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>

              {/* New Project Button */}
              {open && (
                <SidebarMenuItem className="px-2 md:px-3 mt-2">
                  <Link href="/create" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-all flex items-center justify-center gap-1 md:gap-2 py-2 md:py-5 text-xs md:text-sm"
                    >
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                      New Project
                    </Button>
                  </Link>
                </SidebarMenuItem>
              )}
              {!open && (
                <SidebarMenuItem className="mt-2">
                  <Link href="/create" className="w-full flex justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </Link>
                </SidebarMenuItem>
              )}
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Footer Section */}
          {open && (
            <div className="mt-6 md:mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg md:rounded-xl p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-white bg-opacity-70 rounded-md md:rounded-lg">
                  <Code className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-xs md:text-sm text-indigo-900">Need help?</h4>
                  <p className="text-[10px] md:text-xs text-gray-600 mt-0.5 md:mt-1 truncate">Access documentation</p>
                </div>
              </div>
              <Button
                variant="link"
                className="text-indigo-600 text-[10px] md:text-xs font-medium mt-1 md:mt-2 px-0 hover:text-indigo-800 hover:underline"
              >
                View Documentation →
              </Button>
            </div>
          )}
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}

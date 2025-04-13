"use client";

import { Button } from "@/components/ui/button";
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
} from "@/components/ui/sidebar";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Q&A", url: "/qa", icon: Bot },
    { title: "Meetings", url: "/meetings", icon: Presentation },
    { title: "Billing", url: "/billing", icon: CreditCard },
];

export function AppSidebar() {
    const pathname = usePathname();
    const { open } = useSidebar();
    const { projects, setProjectId, projectId } = useProject();

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <Link href="/dashboard" className="flex items-center gap-3 px-2 py-1">
                    <Image
                        src="/logo.png" 
                        alt="DevSync Logo"
                        width={32}
                        height={32}
                        className="rounded-md"
                    />
                    {open && (
                        <span className="text-xl font-bold text-primary tracking-tight">
                            <span className="text-black">Dev</span><span className="text-primary">Sync</span> <span className="text-muted-foreground text-md">AI</span>
                        </span>
                    )}
                </Link>
            </SidebarHeader>


            <SidebarContent>
                {/* Application Section */}
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.url}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-2 rounded-md transition",
                                                pathname === item.url
                                                    ? "bg-primary text-white"
                                                    : "hover:bg-gray-100"
                                            )}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Projects Section */}
                <SidebarGroup>
                    <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects?.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton asChild>
                                        <div
                                            onClick={() => setProjectId(item.id)}
                                            className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md hover:bg-gray-100"
                                        >
                                            <div
                                                className={cn(
                                                    "rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary",
                                                    {
                                                        "bg-primary text-white": item.id === projectId,
                                                    }
                                                )}
                                            >
                                                {item.name[0]}
                                            </div>
                                            <span>{item.name}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                            {open && (
                                <SidebarMenuItem>
                                    <Link href={"/create"}>
                                        <Button size={"sm"} variant={"outline"} className="w-fit flex items-center gap-2">
                                            <Plus className="w-4 h-4" />
                                            Create Project
                                        </Button>
                                    </Link>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

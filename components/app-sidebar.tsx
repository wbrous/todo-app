"use client";

import * as React from "react";
import {
  Calendar,
  Home,
  Inbox,
  Moon,
  Search,
  Settings,
  Sun,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useTheme } from "next-themes";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/app",
    icon: Home,
  },
  {
    title: "Todo",
    url: "/app/todo",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/app/calendar",
    icon: Calendar,
  },
];

export function AppSidebar() {
  const { openUserProfile } = useClerk();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === "light" || theme === "system") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Todo App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            type="button"
            onClick={cycleTheme}
            tooltip="Toggle theme"
          >
            {!mounted ? (
              <>
                <Sun className="h-[1.2rem] w-[1.2rem]" />
                <span>Theme</span>
              </>
            ) : (
              <>
                {theme === "light" && (
                  <>
                    <Sun className="h-[1.2rem] w-[1.2rem]" />
                    <span>Light Mode</span>
                  </>
                )}
                {theme === "dark" && (
                  <>
                    <Moon className="h-[1.2rem] w-[1.2rem]" />
                    <span>Dark Mode</span>
                  </>
                )}
              </>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            type="button"
            onClick={() => openUserProfile()}
            tooltip="Account settings"
          >
            <Settings />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}

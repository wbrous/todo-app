"use client";

import { IconRoad } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function WelcomeEmptyState() {
  const router = useRouter();

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconRoad />
        </EmptyMedia>
        <EmptyTitle>Welcome</EmptyTitle>
        <EmptyDescription>
          Start your journey by creating your first task or adding an event to
          your calendar.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              router.push("/app/todo");
            }}
          >
            Create Task
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              router.push("/app/calendar");
            }}
          >
            Add Calendar Event
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}

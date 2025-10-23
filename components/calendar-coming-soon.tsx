"use client";

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
import { ConstructionIcon } from "lucide-react";

export function CalendarComingSoon() {
  const router = useRouter();

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ConstructionIcon />
        </EmptyMedia>
        <EmptyTitle>Under Construction</EmptyTitle>
        <EmptyDescription>
          We are working hard to bring you the best features and functionality.
          Stay tuned for updates!
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              router.push("javascript:history.back()");
            }}
          >
            Go Back
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}

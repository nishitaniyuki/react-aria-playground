"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  OverlayArrow,
  Popover,
} from "react-aria-components";

function Comment() {
  const {
    data: { text },
  } = useSuspenseQuery({
    queryKey: ["comments", "1"],
    queryFn: () =>
      fetch("http://localhost:3001/comments/1").then((res) => res.json()),
  });

  return <p>{text}</p>;
}

export default function PopoverAndSuspense() {
  return (
    <DialogTrigger>
      <Button>Read Comment</Button>
      <Popover>
        <OverlayArrow>
          <svg width={12} height={12} viewBox="0 0 12 12">
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
        <Dialog>
          <Suspense fallback="loading">
            <Comment />
          </Suspense>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

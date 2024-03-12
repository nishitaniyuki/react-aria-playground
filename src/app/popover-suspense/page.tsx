"use client";

import { Suspense, use, useReducer } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  OverlayArrow,
  Popover,
} from "react-aria-components";

function Comment() {
  const { text } = use(
    fetch("http://localhost:3001/comments/1").then((res) => res.json())
  );

  return <p>{text}</p>;
}

export default function PopoverAndSuspense() {
  const [hasOnceOpen, setHasOnceOpen] = useReducer(() => true, false);

  const comment = hasOnceOpen ? (
    <Suspense fallback="loading">
      <Comment />
    </Suspense>
  ) : null;

  const handleOpenChange = () => {
    if (!hasOnceOpen) {
      setHasOnceOpen();
    }
  };

  return (
    <DialogTrigger onOpenChange={handleOpenChange}>
      <Button>Read Comment</Button>
      <Popover>
        <OverlayArrow>
          <svg width={12} height={12} viewBox="0 0 12 12">
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
        <Dialog>{comment}</Dialog>
      </Popover>
    </DialogTrigger>
  );
}

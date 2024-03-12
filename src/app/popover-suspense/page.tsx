"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, cloneElement, useState } from "react";
import { useMove } from "react-aria";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
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

function MovablePopoverTrigger({ label, heading, body }) {
  const initialPosition = { x: 0, y: 0 } as const;
  const [position, setPosition] = useState<{ x: number; y: number }>(
    initialPosition
  );

  const { moveProps } = useMove({
    onMove({ deltaX, deltaY }) {
      setPosition(({ x, y }) => ({
        x: x + deltaX,
        y: y + deltaY,
      }));
    },
  });

  const handleOpenChange = () => setPosition(initialPosition);

  return (
    <DialogTrigger onOpenChange={handleOpenChange}>
      <Button>{label}</Button>
      <Popover
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <OverlayArrow>
          <svg width={12} height={12} viewBox="0 0 12 12">
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
        <Dialog>
          {cloneElement(heading, moveProps)}
          {body}
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

export default function PopoverAndSuspense() {
  return (
    <MovablePopoverTrigger
      label="read comment"
      heading={<Heading>drag me</Heading>}
      body={
        <Suspense fallback="loading">
          <Comment />
        </Suspense>
      }
    ></MovablePopoverTrigger>
  );
}

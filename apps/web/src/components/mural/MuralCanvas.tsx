"use client";

import { useEffect, useRef } from "react";
import { renderMural } from "@/lib/mural/engine";
import type { MuralInput, MuralRenderResult } from "@/lib/mural/types";

type Props = {
  input: MuralInput;
  contributingMemoryIds: string[];
  epochLabel: string;
  width?: number;
  height?: number;
  onRendered?: (result: MuralRenderResult) => void;
  className?: string;
};

export function MuralCanvas({
  input,
  contributingMemoryIds,
  epochLabel,
  width = 640,
  height = 480,
  onRendered,
  className,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const result = renderMural(
      canvas,
      input,
      contributingMemoryIds,
      epochLabel,
    );
    onRendered?.(result);
  }, [input, contributingMemoryIds, epochLabel, width, height, onRendered]);

  return (
    <canvas
      ref={ref}
      className={className ?? "h-full w-full object-cover"}
      aria-label={`Neighborhood mural: ${epochLabel}`}
    />
  );
}

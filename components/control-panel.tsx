"use client"

import {
  FlipHorizontal2,
  FlipVertical2,
  RotateCcw,
  RotateCw,
  RefreshCw,
} from "lucide-react"
import { SliderControl } from "./slider-control"
import {
  DEFAULT_ADJUSTMENTS,
  PRESETS,
  type Adjustments,
  type Transform,
} from "@/lib/editor"

type ControlPanelProps = {
  adjustments: Adjustments
  transform: Transform
  onAdjust: (key: keyof Adjustments, value: number) => void
  onApplyPreset: (adjustments: Partial<Adjustments>) => void
  onTransform: (t: Partial<Transform>) => void
  onRotate: (dir: "cw" | "ccw") => void
  onReset: () => void
}

function TransformButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`flex h-10 flex-1 items-center justify-center rounded-lg border transition-colors ${
        active
          ? "border-accent bg-accent/10 text-accent"
          : "border-border bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}

export function ControlPanel({
  adjustments,
  transform,
  onAdjust,
  onApplyPreset,
  onTransform,
  onRotate,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="flex flex-col gap-7">
      <section className="flex flex-col gap-3">
        <SectionTitle>Filters</SectionTitle>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => onApplyPreset(preset.adjustments)}
              className="rounded-lg border border-border bg-muted px-1.5 py-2 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Transform</SectionTitle>
        <div className="flex gap-2">
          <TransformButton label="Rotate left" onClick={() => onRotate("ccw")}>
            <RotateCcw className="h-4 w-4" />
          </TransformButton>
          <TransformButton label="Rotate right" onClick={() => onRotate("cw")}>
            <RotateCw className="h-4 w-4" />
          </TransformButton>
          <TransformButton
            label="Flip horizontal"
            active={transform.flipH}
            onClick={() => onTransform({ flipH: !transform.flipH })}
          >
            <FlipHorizontal2 className="h-4 w-4" />
          </TransformButton>
          <TransformButton
            label="Flip vertical"
            active={transform.flipV}
            onClick={() => onTransform({ flipV: !transform.flipV })}
          >
            <FlipVertical2 className="h-4 w-4" />
          </TransformButton>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>Adjust</SectionTitle>
        <SliderControl
          label="Brightness"
          value={adjustments.brightness}
          min={0}
          max={200}
          unit="%"
          defaultValue={DEFAULT_ADJUSTMENTS.brightness}
          onChange={(v) => onAdjust("brightness", v)}
        />
        <SliderControl
          label="Contrast"
          value={adjustments.contrast}
          min={0}
          max={200}
          unit="%"
          defaultValue={DEFAULT_ADJUSTMENTS.contrast}
          onChange={(v) => onAdjust("contrast", v)}
        />
        <SliderControl
          label="Saturation"
          value={adjustments.saturation}
          min={0}
          max={200}
          unit="%"
          defaultValue={DEFAULT_ADJUSTMENTS.saturation}
          onChange={(v) => onAdjust("saturation", v)}
        />
        <SliderControl
          label="Hue"
          value={adjustments.hue}
          min={0}
          max={360}
          unit="°"
          defaultValue={DEFAULT_ADJUSTMENTS.hue}
          onChange={(v) => onAdjust("hue", v)}
        />
        <SliderControl
          label="Grayscale"
          value={adjustments.grayscale}
          min={0}
          max={100}
          unit="%"
          defaultValue={DEFAULT_ADJUSTMENTS.grayscale}
          onChange={(v) => onAdjust("grayscale", v)}
        />
        <SliderControl
          label="Sepia"
          value={adjustments.sepia}
          min={0}
          max={100}
          unit="%"
          defaultValue={DEFAULT_ADJUSTMENTS.sepia}
          onChange={(v) => onAdjust("sepia", v)}
        />
        <SliderControl
          label="Blur"
          value={adjustments.blur}
          min={0}
          max={20}
          unit="px"
          defaultValue={DEFAULT_ADJUSTMENTS.blur}
          onChange={(v) => onAdjust("blur", v)}
        />
        <SliderControl
          label="Invert"
          value={adjustments.invert}
          min={0}
          max={100}
          unit="%"
          defaultValue={DEFAULT_ADJUSTMENTS.invert}
          onChange={(v) => onAdjust("invert", v)}
        />
      </section>

      <button
        type="button"
        onClick={onReset}
        className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <RefreshCw className="h-4 w-4" />
        Reset all edits
      </button>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{children}</h3>
  )
}

"use client"

type SliderControlProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  defaultValue: number
  onChange: (value: number) => void
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  defaultValue,
  onChange,
}: SliderControlProps) {
  const isModified = value !== defaultValue

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-muted-foreground">{label}</label>
        <button
          type="button"
          onClick={() => onChange(defaultValue)}
          className={`font-mono text-xs tabular-nums transition-colors ${
            isModified ? "text-accent hover:text-foreground" : "text-muted-foreground"
          }`}
          title={isModified ? "Reset to default" : undefined}
        >
          {value}
          {unit}
        </button>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  )
}

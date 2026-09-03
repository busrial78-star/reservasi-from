"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Aperture, Download, ImagePlus } from "lucide-react"
import { UploadZone } from "./upload-zone"
import { ControlPanel } from "./control-panel"
import {
  DEFAULT_ADJUSTMENTS,
  DEFAULT_TRANSFORM,
  renderToCanvas,
  type Adjustments,
  type Transform,
} from "@/lib/editor"

export function ImageEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [adjustments, setAdjustments] = useState<Adjustments>(DEFAULT_ADJUSTMENTS)
  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM)

  const loadFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setImage(img)
      setAdjustments(DEFAULT_ADJUSTMENTS)
      setTransform(DEFAULT_TRANSFORM)
      URL.revokeObjectURL(url)
    }
    img.src = url
    setFileName(file.name.replace(/\.[^.]+$/, ""))
  }, [])

  // Re-render the canvas whenever inputs change.
  useEffect(() => {
    if (!image || !canvasRef.current) return
    renderToCanvas(canvasRef.current, image, adjustments, transform)
  }, [image, adjustments, transform])

  const handleAdjust = useCallback((key: keyof Adjustments, value: number) => {
    setAdjustments((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleApplyPreset = useCallback((preset: Partial<Adjustments>) => {
    setAdjustments({ ...DEFAULT_ADJUSTMENTS, ...preset })
  }, [])

  const handleTransform = useCallback((t: Partial<Transform>) => {
    setTransform((prev) => ({ ...prev, ...t }))
  }, [])

  const handleRotate = useCallback((dir: "cw" | "ccw") => {
    setTransform((prev) => ({
      ...prev,
      rotation: (prev.rotation + (dir === "cw" ? 90 : 270)) % 360,
    }))
  }, [])

  const handleReset = useCallback(() => {
    setAdjustments(DEFAULT_ADJUSTMENTS)
    setTransform(DEFAULT_TRANSFORM)
  }, [])

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${fileName || "edited"}-studio.png`
      a.click()
      URL.revokeObjectURL(url)
    }, "image/png")
  }, [fileName])

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Aperture className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">Studio</span>
            <span className="font-mono text-[11px] text-muted-foreground">image editor</span>
          </div>
        </div>

        {image && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ImagePlus className="h-4 w-4" />
              <span className="hidden sm:inline">New image</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) loadFile(file)
            e.target.value = ""
          }}
        />
      </header>

      {!image ? (
        <UploadZone onFile={loadFile} />
      ) : (
        <div className="flex flex-1 flex-col lg:flex-row">
          <main className="flex flex-1 items-center justify-center overflow-hidden bg-background p-4 sm:p-8">
            <div className="checkerboard flex max-h-full max-w-full items-center justify-center overflow-hidden rounded-xl border border-border">
              <canvas
                ref={canvasRef}
                className="max-h-[68dvh] max-w-full object-contain"
                aria-label="Editable image preview"
              />
            </div>
          </main>

          <aside className="w-full shrink-0 overflow-y-auto border-t border-border bg-panel p-5 lg:w-80 lg:border-l lg:border-t-0">
            <ControlPanel
              adjustments={adjustments}
              transform={transform}
              onAdjust={handleAdjust}
              onApplyPreset={handleApplyPreset}
              onTransform={handleTransform}
              onRotate={handleRotate}
              onReset={handleReset}
            />
          </aside>
        </div>
      )}
    </div>
  )
}

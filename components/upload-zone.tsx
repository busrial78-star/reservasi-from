"use client"

import { useRef, useState, type DragEvent } from "react"
import { ImagePlus, UploadCloud } from "lucide-react"

export function UploadZone({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (file && file.type.startsWith("image/")) {
      onFile(file)
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center p-6">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
        className={`group flex w-full max-w-xl cursor-pointer flex-col items-center gap-5 rounded-2xl border border-dashed p-12 text-center transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-border bg-panel hover:border-muted-foreground"
        }`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-accent transition-transform group-hover:scale-105">
          {dragging ? <UploadCloud className="h-7 w-7" /> : <ImagePlus className="h-7 w-7" />}
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-medium text-balance">Drop a photo to start editing</h2>
          <p className="text-sm text-muted-foreground text-pretty">
            Drag &amp; drop an image here, or click to browse. Everything is processed locally in your browser.
          </p>
        </div>
        <span className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
          Choose a photo
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  )
}

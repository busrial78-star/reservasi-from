export type Adjustments = {
  brightness: number
  contrast: number
  saturation: number
  grayscale: number
  sepia: number
  hue: number
  blur: number
  invert: number
}

export type Transform = {
  rotation: number // degrees: 0, 90, 180, 270
  flipH: boolean
  flipV: boolean
}

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  hue: 0,
  blur: 0,
  invert: 0,
}

export const DEFAULT_TRANSFORM: Transform = {
  rotation: 0,
  flipH: false,
  flipV: false,
}

export function buildFilter(a: Adjustments): string {
  return [
    `brightness(${a.brightness}%)`,
    `contrast(${a.contrast}%)`,
    `saturate(${a.saturation}%)`,
    `grayscale(${a.grayscale}%)`,
    `sepia(${a.sepia}%)`,
    `hue-rotate(${a.hue}deg)`,
    `blur(${a.blur}px)`,
    `invert(${a.invert}%)`,
  ].join(" ")
}

export type Preset = {
  name: string
  adjustments: Partial<Adjustments>
}

export const PRESETS: Preset[] = [
  { name: "Original", adjustments: {} },
  { name: "Mono", adjustments: { grayscale: 100, contrast: 110 } },
  { name: "Vintage", adjustments: { sepia: 55, saturation: 85, contrast: 95, brightness: 105 } },
  { name: "Cool", adjustments: { hue: 200, saturation: 120, brightness: 102 } },
  { name: "Warm", adjustments: { sepia: 25, saturation: 130, brightness: 104 } },
  { name: "Vivid", adjustments: { saturation: 165, contrast: 115 } },
  { name: "Fade", adjustments: { contrast: 82, brightness: 108, saturation: 78 } },
  { name: "Invert", adjustments: { invert: 100 } },
]

export function renderToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  adjustments: Adjustments,
  transform: Transform,
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const rotated = transform.rotation === 90 || transform.rotation === 270
  const w = image.naturalWidth
  const h = image.naturalHeight

  canvas.width = rotated ? h : w
  canvas.height = rotated ? w : h

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.filter = buildFilter(adjustments)
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((transform.rotation * Math.PI) / 180)
  ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1)
  ctx.drawImage(image, -w / 2, -h / 2, w, h)
  ctx.restore()
}

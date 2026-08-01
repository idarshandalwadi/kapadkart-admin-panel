/**
 * Crop + rotate helper aligned with react-easy-crop's recommended canvas approach.
 */
export async function getCroppedImageDataUrl(
  imageSrc,
  croppedAreaPixels,
  rotation = 0,
  {
    mimeType = 'image/jpeg',
    quality = 0.92,
    maxEdge = 800,
  } = {},
) {
  const image = await loadImage(imageSrc)
  const radian = (rotation * Math.PI) / 180

  const sin = Math.abs(Math.sin(radian))
  const cos = Math.abs(Math.cos(radian))
  const boundingWidth = Math.ceil(image.width * cos + image.height * sin)
  const boundingHeight = Math.ceil(image.width * sin + image.height * cos)

  const canvas = document.createElement('canvas')
  canvas.width = boundingWidth
  canvas.height = boundingHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not create canvas context')

  ctx.translate(boundingWidth / 2, boundingHeight / 2)
  ctx.rotate(radian)
  ctx.translate(-image.width / 2, -image.height / 2)
  ctx.drawImage(image, 0, 0)

  const { width: cropW, height: cropH, x: cropX, y: cropY } = croppedAreaPixels

  let outW = Math.round(cropW)
  let outH = Math.round(cropH)
  if (maxEdge && Math.max(outW, outH) > maxEdge) {
    const scale = maxEdge / Math.max(outW, outH)
    outW = Math.round(outW * scale)
    outH = Math.round(outH * scale)
  }

  const croppedCanvas = document.createElement('canvas')
  croppedCanvas.width = outW
  croppedCanvas.height = outH
  const croppedCtx = croppedCanvas.getContext('2d')
  if (!croppedCtx) throw new Error('Could not create crop canvas')

  croppedCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, outW, outH)

  return croppedCanvas.toDataURL(mimeType, quality)
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () => reject(new Error('Failed to load image')))
    image.src = src
  })
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result))
    reader.addEventListener('error', () => reject(new Error('Failed to read file')))
    reader.readAsDataURL(file)
  })
}

export function isImageFile(file) {
  return Boolean(file && file.type && file.type.startsWith('image/'))
}

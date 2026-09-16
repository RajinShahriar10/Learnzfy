import { v2 as cloudinary, type UploadApiOptions, type UploadApiResponse } from "cloudinary"

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || ""
const apiKey = process.env.CLOUDINARY_API_KEY || ""
const apiSecret = process.env.CLOUDINARY_API_SECRET || ""

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
})

export const CLOUDINARY_UPLOAD_FOLDER =
  process.env.CLOUDINARY_UPLOAD_FOLDER || "Learnzfy"

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret)
}

function streamUpload(buffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error)
      else resolve(result as UploadApiResponse)
    })
    stream.end(buffer)
  })
}

export async function uploadImage(
  buffer: Buffer,
  options?: { folder?: string; publicId?: string }
): Promise<{ url: string; publicId: string }> {
  const result = await streamUpload(buffer, {
    folder: options?.folder || CLOUDINARY_UPLOAD_FOLDER,
    public_id: options?.publicId,
    resource_type: "image",
    transformation: [{ width: 1280, crop: "limit", quality: "auto", fetch_format: "auto" }],
  })
  return { url: result.secure_url, publicId: result.public_id }
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}
import { v2 as cloudinary } from "cloudinary";

function configure() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured");
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
}

export async function uploadToCloudinary(
  buffer: Buffer,
  contentType: string
): Promise<{ url: string; key: string }> {
  configure();

  const dataUri = `data:${contentType};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "cars",
    resource_type: "image",
  });

  return { url: result.secure_url, key: result.public_id };
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  configure();
  await cloudinary.uploader.destroy(publicId);
}

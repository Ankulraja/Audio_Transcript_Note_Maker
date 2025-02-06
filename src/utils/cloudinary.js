export async function uploadToCloudinary(file, folder, resourceType = "auto") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );
  formData.append("folder", folder);
  console.log(
    "ENV File ................",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    "   .... ",
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  );
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Cloudinary Error: ${data.error.message}`);
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Failed:", error);
    return null;
  }
}

export const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDNAME;
  const uploadPreset = import.meta.env.VITE_UPLOADPRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (data.secure_url) {
    return data.secure_url;
  } else {
    throw new Error("Image upload failed");
  }
};

import toast from "react-hot-toast";

export async function uploadFilesToServer(files) {
  if (!files || files.length === 0) return [];

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file.file);
  });

  console.log("File for upload", formData);

  try {
    const res = await fetch("http://localhost:3000/api/v1/upload-file/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    console.log("upload data", data);

    if (!data.success) throw new Error(data.message || "Upload failed");

    // data.urls = [{ url, public_id }]
    return data.urls;
  } catch (err) {
    console.error("File upload error:", err);
    toast.error("Failed to upload files");
    return [];
  }
}

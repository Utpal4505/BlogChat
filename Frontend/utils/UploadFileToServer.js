import toast from "react-hot-toast";

export async function uploadFilesToServer(files) {
  if (!files || files.length === 0) return [];

  const formData = new FormData();
  files.forEach(({ file }) => {
    if (file && !file.error) {
      formData.append("files", file);
    }
  });

  try {
    const res = await fetch("http://localhost:8000/api/v1/upload-file/", {
      method: "POST",
      body: formData,
    });

    console.log("Uploading...");
    const data = await res.json();
    console.log("Response:", data);

    if (!data.success) throw new Error(data.message || "Upload failed");

    return data.urls;
  } catch (err) {
    console.error("File upload error:", err);
    toast.error("Failed to upload files");
    return [];
  }
}

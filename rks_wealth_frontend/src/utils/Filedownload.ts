import axios from "axios";
/**
 * 
 * @param url api url
 * @param token auth token
 * @param searchParams filter parameters
 * @returns void
 */
const DownloadFile = async (
  url: string,
  token: string,
  searchParams: Record<string, string | number | boolean>
): Promise<void> => {
  try {
    const response = await axios.get<Blob>(url, {
      params: searchParams,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", // Ensures binary data is received correctly
    });

    // Extract filename from content-disposition header
    const contentDisposition = response.headers["content-disposition"];
    let fileName = "downloaded_file.xlsx";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename\s*=\s*(?:"([^"]+)"|([^;]+))/);
      if (match) {
        fileName = match[1] || match[2];
      }
    }

    // Create a Blob URL
    const blobUrl = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", fileName.trim()); // Use extracted file name
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

export default DownloadFile;

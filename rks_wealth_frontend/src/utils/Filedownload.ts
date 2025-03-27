import axios from "axios";
/**
 * 
 * @param url api url
 * @param token auth token
 * @param searchParams filte parameters
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

    // Create a Blob URL
    const blobUrl = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", "folio_master_records.xlsx"); // File name
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

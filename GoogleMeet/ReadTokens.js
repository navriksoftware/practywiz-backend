import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
dotenv.config();
// Azure Blob Storage configuration
const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
// Replace with your Azure Storage account name and the container name
const AZURE_STORAGE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;
const CLIENT_SECRET_BLOB_NAME = process.env.CLIENT_SECRET_BLOB_NAME; // The name of the file you want to read
const TOKEN_BLOB_NAME = process.env.TOKEN_BLOB_NAME;

// Using DefaultAzureCredential, you can authenticate with Azure AD (this is the recommended way)
export async function readClientSecretBlobFromAzure() {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    // Get a container client
    const containerClient = blobServiceClient.getContainerClient(
      AZURE_STORAGE_CONTAINER_NAME
    );

    // Get a blob client to interact with the specific blob
    const blobClient = containerClient.getBlobClient(CLIENT_SECRET_BLOB_NAME);

    // Download the blob's content to a buffer
    const downloadBlockBlobResponse = await blobClient.download(0);
    const downloadedContent = await streamToBuffer(
      downloadBlockBlobResponse.readableStreamBody
    );

    // Convert the buffer to a string (assuming it's a text file)
    //console.log("Downloaded blob content:", downloadedContent.toString());
    return downloadedContent.toString();
  } catch (error) {
    console.error("Error reading blob from Azure:", error.message);
  }
}

// Using DefaultAzureCredential, you can authenticate with Azure AD (this is the recommended way)
export async function readClientTokenBlobFromAzure() {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    // Get a container client
    const containerClient = blobServiceClient.getContainerClient(
      AZURE_STORAGE_CONTAINER_NAME
    );

    // Get a blob client to interact with the specific blob
    const blobClient = containerClient.getBlobClient(TOKEN_BLOB_NAME);

    // Download the blob's content to a buffer
    const downloadBlockBlobResponse = await blobClient.download(0);
    const downloadedContent = await streamToBuffer(
      downloadBlockBlobResponse.readableStreamBody
    );

    // Convert the buffer to a string (assuming it's a text file)
    //console.log("Downloaded blob content:", downloadedContent.toString());
    return downloadedContent.toString();
  } catch (error) {
    console.error("Error reading blob from Azure:", error.message);
  }
}
// A helper function used to convert the readable stream to a buffer
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}

import { BlobServiceClient } from "@azure/storage-blob";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
// Azure Blob Storage configuration
const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
export async function uploadFileToAzure(filePath, containerName) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist at path: ${filePath}`);
  }
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();
  const blobName = path.basename(filePath);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  try {
    const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
    console.log(
      `Upload block blob ${blobName} successfully`,
      uploadBlobResponse.requestId
    );
    return blockBlobClient.url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function uploadFileToAzureStorage(filePath, containerName) {
  console.log(filePath, containerName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist at path: ${filePath}`);
  }
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();
  const blobName = path.basename(filePath);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  try {
    const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
    console.log(
      `Upload block blob ${blobName} successfully`,
      uploadBlobResponse.requestId
    );
    return blockBlobClient.url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// types/imagekit.ts
export interface IKUploadResponse {
  fileId: string;
  name: string;
  url: string;
  filePath: string;
  thumbnailUrl?: string;
}

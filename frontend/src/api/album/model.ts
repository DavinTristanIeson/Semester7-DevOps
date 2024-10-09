import { Type } from "class-transformer";

// Model
export class AlbumModel {
  name: string;
  thumbnails: string[];
}

// Input
export interface AlbumMutationInput {
  name: string;
}

export interface AlbumUploadFilesInput {
  id: string;
  files: File[];
}

export interface AlbumDeleteFilesInput {
  id: string;
  ids: string[];
}
import { Expose, Type } from "class-transformer";

// Model
export class FileModel {
  id: string;
  name: string;

  @Expose({name: 'created_at'})
  @Type(() => Date)
  createdAt: Date;
}
export class AlbumModel {
  id: string;
  name: string;

  @Expose({name: 'created_at'})
  createdAt?: Date;

  thumbnails: string[];
  files?: FileModel[];
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
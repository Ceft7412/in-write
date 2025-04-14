export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  backgroundColor: string;
  isFavorite: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  folderId: number | null;
}

export interface Folder {
  id: number;
  name: string;
  folderColor: string;
  parentFolderId: number | null;
}


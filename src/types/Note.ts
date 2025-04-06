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
}
export type BoardModel = {
  id: number;
  name: string;
  columns: ColumnModel[];
};

export type ColumnModel = {
  id: number;
  name: string;
  position: number;
  cards: CardModel[];
};

export type CardModel = {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  position: number;
  labels?: LabelModel[];
  comments?: CommentModel[];
};

export type LabelModel = {
  id: number;
  name: string;
  color: string;
};

export type CommentModel = {
  id: number;
  content: string;
};

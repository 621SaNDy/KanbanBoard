export type BoardModel = {
  id: number;
  name: string;
};

export type BoardWithColumnsModel = {
  id: number;
  name: string;
  columns: ColumnWithCardsModel[];
};

export type ColumnModel = {
  id: number;
  name: string;
  position: number;
};

export type ColumnWithCardsModel = {
  id: number;
  name: string;
  position: number;
  cards: CardModel[];
};

export type CardModel = {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
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

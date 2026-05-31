export type BoardRequest = {
  name: string;
};

export type ColumnRequest = {
  name: string;
};

export type CardRequest = {
  title: string;
  description?: string;
  due_date?: string;
};

export type CardUpdateRequest = {
  title?: string;
  description?: string;
  due_date?: string;
};

export type CardMoveRequest = {
  columnId: number;
  position: number;
}

export type LabelRequest = {
  name: string;
  color: string;
};

export type LabelBindRequest = {
  labelId: number;
};

export type CommentRequest = {
  content: string;
};
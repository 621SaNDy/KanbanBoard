import type { LabelModel } from "./models";

export const CARD_DND_TYPE = "CARD";
export const COLUMN_DND_TYPE = "COLUMN";

export type DragCardItem = {
  type: typeof CARD_DND_TYPE;
  cardId: number;
  fromColumnId: number;
  fromPosition: number;
  title: string;
  description?: string;
  dueDate?: string;
  labels: LabelModel[];
  width?: number;
  height?: number;
};

export type DragColumnItem = {
  type: typeof COLUMN_DND_TYPE;
  columnId: number;
  fromIndex: number;
  name: string;
  width?: number;
  height?: number;
};
import type { LabelModel } from "./models";

export const CARD_DND_TYPE = "CARD";

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
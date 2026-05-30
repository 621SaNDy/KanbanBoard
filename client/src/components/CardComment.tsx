import type { CommentModel } from "../types/models";

type CardCommentProps = CommentModel & {
  remove: (id: number) => void;
};

export function CardComment({ id, content, remove }: CardCommentProps) {
  return (
    <div className="flex">
      <p style={{ flex: 1 }}>{content}</p>
      <button onClick={() => remove(id)}>ziuu</button>
    </div>
  );
}

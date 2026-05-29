import type { CommentModel } from "../types/models";

type CommentProps = CommentModel & {
  remove: (id: number) => void;
};

export function Comment({ id, content, remove }: CommentProps) {
  return (
    <div className="flex">
      <p style={{ flex: 1 }}>{content}</p>
      <button onClick={() => remove(id)}>ziuu</button>
    </div>
  );
}

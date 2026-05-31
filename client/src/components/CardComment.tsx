import type { CommentModel } from "../types/models";

type CardCommentProps = CommentModel & {
  remove: (id: number) => void;
};

export function CardComment({ id, content, remove }: CardCommentProps) {
  return (
    <div className="flex">
      <p style={{ flex: 1 }}>{content}</p>
      <a className="flex items-center" onClick={() => remove(id)}>
        <i className="hn hn-trash-alt" />
      </a>
    </div>
  );
}

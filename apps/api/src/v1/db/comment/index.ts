type AddCommentProps = {
  userId: number;
  threadId: number;
  content: string;
};
export const addComment = async ({
  userId,
  threadId,
  content,
}: AddCommentProps) => {};

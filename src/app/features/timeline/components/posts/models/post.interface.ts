export interface Post {
  _id: string;
  body: string;
  image: string;
  privacy: string;
  user: User;
  sharedPost: Post;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: TopComment;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
  showComments?: boolean;
  isEditing?: boolean;
}

interface TopComment {
  _id: string;
  content: string;
  commentCreator: User;
  post: string;
  parentComment: null;
  likes: any[];
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface Notification {
  _id: string;
  recipient: Recipient;
  actor: Recipient;
  type: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  readAt: string;
  entity: Entity;
}

interface Entity {
  _id: string;
  body: string;
  image: string;
  user: string;
  commentsCount: number;
  topComment: null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
}

interface Recipient {
  _id: string;
  name: string;
  photo: string;
  isFollowing: boolean;
}

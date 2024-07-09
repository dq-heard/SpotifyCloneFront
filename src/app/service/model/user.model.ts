export interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  subscription?: Subscription;
  imageURL?: string;
}

export enum Subscription {
  PREMIUM,
  FREE,
}

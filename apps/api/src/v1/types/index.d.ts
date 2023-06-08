type Identity = {
  email: string;
  handle: string;
};

type VerifiedIdentity = Identity & {
  id: number;
};

type TheatrePreferences = {
  ageRestricted: boolean;
  downvoteEnabled: boolean;
  allowReplies: boolean;
  allowEmojis: boolean;
  allowsImageAttachments: boolean;
  allowsLinks: boolean;
  autoLockDuration?: number;
  theme: {
    primary: string;
    secondary: string;
  };
  approval: "none" | "all" | "new";
};

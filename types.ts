export enum Language {
  EN = 'en',
  AR = 'ar',
  FR = 'fr',
}

export type TranslationKeys = {
  appName: string;
  tagline: string;
  welcome: string;
  startAssessment: string;
  assessmentTitle: string;
  assessmentDescription: string;
  submit: string;
  home: string;
  dashboard: string;
  feed: string;
  chatRooms: string;
  aiCompanion: string;
  therapists: string;
  myDashboard: string;
  assessmentResult: string;
  recommendedRooms: string;
  join: string;
  myFeed: string;
  shareExperience: string;
  whatOnYourMind: string;
  selectImage: string;
  post: string;
  communityChatRooms: string;
  chatWithNafsiBot: string;
  nafsiBotDescription: string;
  typeMessage: string;
  send: string;
  findTherapist: string;
  searchByCity: string;
  search: string;
  viewProfile: string;
  noResults: string;
  loading: string;
  error: string;
  assessmentInProgress: string;
  assessmentComplete: string;
  basedOnAnswers: string;
  yourPost: string;
  postedOn: string;
  profile: string;
  yourProfile: string;
  fullName: string;
  aboutYourself: string;
  saveChanges: string;
  profileUpdated: string;
  changeAvatar: string;
  like: string;
  friends: string;
  findPeople: string;
  requests: string;
  myFriends: string;
  sendRequest: string;
  requestSent: string;
  accept: string;
  decline: string;
  noFriendRequests: string;
  noFriends: string;
  createRoom: string;
  roomName: string;
  inviteFriends: string;
  noFriendsToInvite: string;
  officialRooms: string;
  privateRooms: string;
  createdBy: string;
  completeYourProfile: string;
  completeProfilePrompt: string;
  goToProfile: string;
};

export type Translations = {
  [key in Language]: TranslationKeys;
};

export type Question = {
  question: string;
  options: string[];
};

export type AssessmentResult = {
  primaryConcern: string;
  summary: string;
  recommendedRoomIds: string[];
};

export type User = {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  assessmentResult: AssessmentResult | null;
  posts: Post[];
  friends: string[];
};

export type Post = {
  id: number;
  text: string;
  imageUrl?: string;
  timestamp: string;
  authorId: string;
  likes: string[];
};

export type ChatRoom = {
  id: string;
  name: { [key in Language]: string };
  description: { [key in Language]: string };
  icon: string;
  isPrivate?: boolean;
  ownerId?: string;
  members?: string[];
};

export type Therapist = {
  id: number;
  name: string;
  specialty: { [key in Language]: string };
  city: string;
  avatar: string;
};

export type FriendRequest = {
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
};
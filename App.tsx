import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Language, User, Post, TranslationKeys, AssessmentResult, ChatRoom, FriendRequest } from './types';
import { translations } from './translations';
import { USERS_DATA, CHAT_ROOMS_DATA } from './constants';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed';
import ChatRooms from './pages/ChatRooms';
import Chatbot from './pages/Chatbot';
import Therapists from './pages/Therapists';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import Navbar from './components/Navbar';

export const LanguageContext = React.createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationKeys;
}>({
  language: Language.EN,
  setLanguage: () => {},
  t: translations[Language.EN],
});

export const UserContext = React.createContext<{
  user: User | null;
  allUsers: User[];
  allChatRooms: ChatRoom[];
  friendRequests: FriendRequest[];
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  completeAssessment: (result: AssessmentResult) => void;
  addPost: (postText: string, imageUrl?: string) => void;
  updateProfile: (name: string, bio: string) => void;
  updateAvatar: (avatarUrl: string) => void;
  toggleLikePost: (postId: number) => void;
  createRoom: (name: string, description: string, memberIds: string[]) => void;
  sendFriendRequest: (toUserId: string) => void;
  respondToFriendRequest: (fromUserId: string, response: 'accept' | 'decline') => void;
}>({
  user: null,
  allUsers: [],
  allChatRooms: [],
  friendRequests: [],
  setUser: () => {},
  completeAssessment: () => {},
  addPost: () => {},
  updateProfile: () => {},
  updateAvatar: () => {},
  toggleLikePost: () => {},
  createRoom: () => {},
  sendFriendRequest: () => {},
  respondToFriendRequest: () => {},
});

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.AR);
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(USERS_DATA);
  const [allChatRooms, setAllChatRooms] = useState<ChatRoom[]>(CHAT_ROOMS_DATA);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  const languageContextValue = useMemo(() => ({
    language,
    setLanguage: (lang: Language) => {
        setLanguage(lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    },
    t: translations[language],
  }), [language]);

  const completeAssessment = (result: AssessmentResult) => {
    const newUser: User = { 
        id: `user-${Date.now()}`,
        name: "New User", 
        bio: "", 
        avatar: "", 
        assessmentResult: result, 
        posts: [],
        friends: [],
    };
    setAllUsers(prev => [...prev, newUser]);
    setUser(newUser);
  };
    
  const addPost = (text: string, imageUrl?: string) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const newPost: Post = {
            id: Date.now(),
            text,
            imageUrl,
            timestamp: new Date().toISOString(),
            authorId: prevUser.id,
            likes: [],
        };
        const updatedUser = { ...prevUser, posts: [newPost, ...prevUser.posts] };
        
        setAllUsers(prevAllUsers => 
            prevAllUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
        );

        return updatedUser;
    });
  };

  const updateProfile = (name: string, bio: string) => {
    setUser(prev => {
        if (!prev) return null;
        const updatedUser = { ...prev, name, bio };
        setAllUsers(prevAllUsers => prevAllUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        return updatedUser;
    });
  };

  const updateAvatar = (avatarUrl: string) => {
    setUser(prev => {
        if (!prev) return null;
        const updatedUser = { ...prev, avatar: avatarUrl };
        setAllUsers(prevAllUsers => prevAllUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        return updatedUser;
    });
  };
  
  const toggleLikePost = (postId: number) => {
    if (!user) return;
    const currentUserId = user.id;

    const newAllUsers = allUsers.map(u => ({
        ...u,
        posts: u.posts.map(p => {
            if (p.id === postId) {
                const userHasLiked = p.likes.includes(currentUserId);
                const newLikes = userHasLiked
                    ? p.likes.filter(id => id !== currentUserId)
                    : [...p.likes, currentUserId];
                return { ...p, likes: newLikes };
            }
            return p;
        })
    }));

    setAllUsers(newAllUsers);
    
    const updatedCurrentUser = newAllUsers.find(u => u.id === currentUserId);
    if(updatedCurrentUser) {
        setUser(updatedCurrentUser);
    }
  };

  const createRoom = (name: string, description: string, memberIds: string[]) => {
      if (!user) return;
      const newRoom: ChatRoom = {
          id: `room-${Date.now()}`,
          name: { [Language.EN]: name, [Language.AR]: name, [Language.FR]: name },
          description: { [Language.EN]: description, [Language.AR]: description, [Language.FR]: description },
          icon: '👥',
          isPrivate: true,
          ownerId: user.id,
          members: [user.id, ...memberIds],
      };
      setAllChatRooms(prev => [...prev, newRoom]);
  };

  const sendFriendRequest = (toUserId: string) => {
      if (!user) return;
      const existingRequest = friendRequests.find(req => 
          (req.fromUserId === user.id && req.toUserId === toUserId) ||
          (req.fromUserId === toUserId && req.toUserId === user.id)
      );
      if (existingRequest) return; 

      const newRequest: FriendRequest = {
          fromUserId: user.id,
          toUserId: toUserId,
          status: 'pending',
      };
      setFriendRequests(prev => [...prev, newRequest]);
  };

  const respondToFriendRequest = (fromUserId: string, response: 'accept' | 'decline') => {
      if (!user) return;
      const currentUserId = user.id;

      setFriendRequests(prev => prev.map(req => 
          req.fromUserId === fromUserId && req.toUserId === currentUserId
          ? { ...req, status: response === 'accept' ? 'accepted' : 'declined' }
          : req
      ));

      if (response === 'accept') {
          setAllUsers(prev => prev.map(u => {
              if (u.id === currentUserId) {
                  return { ...u, friends: [...u.friends, fromUserId] };
              }
              if (u.id === fromUserId) {
                  return { ...u, friends: [...u.friends, currentUserId] };
              }
              return u;
          }));
      }
  };

 useEffect(() => {
    if (user) {
      const currentUserInAll = allUsers.find(u => u.id === user.id);
      if (currentUserInAll) {
        setUser(currentUserInAll);
      }
    }
  }, [allUsers, user?.id]);

  const userContextValue = useMemo(() => ({
      user,
      allUsers,
      allChatRooms,
      friendRequests,
      setUser,
      completeAssessment,
      addPost,
      updateProfile,
      updateAvatar,
      toggleLikePost,
      createRoom,
      sendFriendRequest,
      respondToFriendRequest
  }), [user, allUsers, allChatRooms, friendRequests]);

  return (
    <LanguageContext.Provider value={languageContextValue}>
      <UserContext.Provider value={userContextValue}>
        <HashRouter>
          <MainLayout />
        </HashRouter>
      </UserContext.Provider>
    </LanguageContext.Provider>
  );
};


const MainLayout: React.FC = () => {
    const { user } = React.useContext(UserContext);
    
    const showNavbar = !!user;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            {showNavbar && <Navbar />}
            <main className={`transition-all duration-300 ${showNavbar ? 'pt-16' : ''}`}>
                 <Routes>
                    <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/onboarding" />} />
                    <Route path="/onboarding" element={user ? <Navigate to="/home" /> : <Onboarding />} />
                    <Route path="/home" element={user ? <Home /> : <Navigate to="/onboarding" />} />
                    <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/onboarding" />} />
                    <Route path="/feed" element={user ? <Feed /> : <Navigate to="/onboarding" />} />
                    <Route path="/friends" element={user ? <Friends /> : <Navigate to="/onboarding" />} />
                    <Route path="/chat-rooms" element={user ? <ChatRooms /> : <Navigate to="/onboarding" />} />
                    <Route path="/chatbot" element={user ? <Chatbot /> : <Navigate to="/onboarding" />} />
                    <Route path="/therapists" element={user ? <Therapists /> : <Navigate to="/onboarding" />} />
                    <Route path="/profile" element={user ? <Profile /> : <Navigate to="/onboarding" />} />
                 </Routes>
            </main>
        </div>
    );
}

export default App;
import React, { useState, useContext, useMemo } from 'react';
import { UserContext, LanguageContext } from '../App';
import { User as UserIcon, Check, X } from 'lucide-react';

type Tab = 'find' | 'requests' | 'friends';

const Friends: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [activeTab, setActiveTab] = useState<Tab>('find');

    const TabButton: React.FC<{tab: Tab, label: string}> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors ${
                activeTab === tab 
                ? 'bg-white dark:bg-gray-800 border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">{t.friends}</h1>
            
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="flex space-x-2 rtl:space-x-reverse">
                    <TabButton tab="find" label={t.findPeople} />
                    <TabButton tab="requests" label={t.requests} />
                    <TabButton tab="friends" label={t.myFriends} />
                </nav>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                {activeTab === 'find' && <FindPeople />}
                {activeTab === 'requests' && <Requests />}
                {activeTab === 'friends' && <MyFriends />}
            </div>
        </div>
    );
};

const FindPeople: React.FC = () => {
    const { user, allUsers, friendRequests, sendFriendRequest } = useContext(UserContext);
    const { t } = useContext(LanguageContext);
    
    const otherUsers = useMemo(() => {
        if (!user) return [];
        const friendIds = user.friends || [];
        return allUsers.filter(u => u.id !== user.id && !friendIds.includes(u.id));
    }, [user, allUsers]);

    const getRequestStatus = (targetUserId: string) => {
        if (!user) return null;
        const request = friendRequests.find(req => 
            (req.fromUserId === user.id && req.toUserId === targetUserId) ||
            (req.fromUserId === targetUserId && req.toUserId === user.id)
        );
        return request ? request.status : null;
    }

    return (
        <div className="space-y-4">
            {otherUsers.map(otherUser => {
                const status = getRequestStatus(otherUser.id);
                return (
                    <div key={otherUser.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center">
                            {otherUser.avatar ? (
                                <img src={otherUser.avatar} alt={otherUser.name} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                    <UserIcon size={24} className="text-gray-500 dark:text-gray-400" />
                                </div>
                            )}
                            <p className="font-bold text-lg mx-4">{otherUser.name}</p>
                        </div>
                        <button
                            onClick={() => sendFriendRequest(otherUser.id)}
                            disabled={status === 'pending' || status === 'accepted'}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {status === 'pending' ? t.requestSent : t.sendRequest}
                        </button>
                    </div>
                )
            })}
        </div>
    );
};

const Requests: React.FC = () => {
    const { user, friendRequests, allUsers, respondToFriendRequest } = useContext(UserContext);
    const { t } = useContext(LanguageContext);
    const usersMap = useMemo(() => new Map(allUsers.map(u => [u.id, u])), [allUsers]);

    const incomingRequests = useMemo(() => {
        if (!user) return [];
        return friendRequests.filter(req => req.toUserId === user.id && req.status === 'pending');
    }, [user, friendRequests]);

    if(incomingRequests.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t.noFriendRequests}</p>
    }

    return (
        <div className="space-y-4">
            {incomingRequests.map(req => {
                const fromUser = usersMap.get(req.fromUserId);
                if (!fromUser) return null;
                return (
                     <div key={req.fromUserId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center">
                            <img src={fromUser.avatar} alt={fromUser.name} className="w-12 h-12 rounded-full object-cover" />
                            <p className="font-bold text-lg mx-4">{fromUser.name}</p>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={() => respondToFriendRequest(req.fromUserId, 'accept')} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full">
                                <Check size={20} />
                             </button>
                             <button onClick={() => respondToFriendRequest(req.fromUserId, 'decline')} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

const MyFriends: React.FC = () => {
    const { user, allUsers } = useContext(UserContext);
    const { t } = useContext(LanguageContext);

    const friends = useMemo(() => {
        if (!user) return [];
        return allUsers.filter(u => user.friends.includes(u.id));
    }, [user, allUsers]);

    if(friends.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t.noFriends}</p>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.map(friend => (
                <div key={friend.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full object-cover" />
                    <p className="font-bold text-lg mx-4">{friend.name}</p>
                </div>
            ))}
        </div>
    );
};


export default Friends;
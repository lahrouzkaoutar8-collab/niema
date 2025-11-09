import React, { useState, useContext, useMemo } from 'react';
import { UserContext, LanguageContext } from '../App';
import { X } from 'lucide-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {
  const { t } = useContext(LanguageContext);
  const { user, allUsers, createRoom } = useContext(UserContext);
  const [roomName, setRoomName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const friends = useMemo(() => {
    if (!user) return [];
    return allUsers.filter(u => user.friends.includes(u.id));
  }, [user, allUsers]);

  const handleToggleFriend = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !user) return;
    const description = `A private room created by ${user.name}.`;
    createRoom(roomName, description, selectedFriends);
    setRoomName('');
    setSelectedFriends([]);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 sm:p-8 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.createRoom}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="roomName" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.roomName}
            </label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">{t.inviteFriends}</h3>
            {friends.length > 0 ? (
              <div className="max-h-60 overflow-y-auto space-y-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {friends.map(friend => (
                  <label key={friend.id} className="flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFriends.includes(friend.id)}
                      onChange={() => handleToggleFriend(friend.id)}
                      className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover mx-3" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">{friend.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t.noFriendsToInvite}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!roomName.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {t.createRoom}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
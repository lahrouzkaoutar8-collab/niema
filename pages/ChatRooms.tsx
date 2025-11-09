import React, { useContext, useState, useMemo } from 'react';
import { LanguageContext, UserContext } from '../App';
import { Star, PlusCircle, ShieldCheck, Lock } from 'lucide-react';
import CreateRoomModal from '../components/CreateRoomModal';

const ChatRooms: React.FC = () => {
  const { t, language } = useContext(LanguageContext);
  const { user, allChatRooms, allUsers } = useContext(UserContext);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const recommendedRoomIds = user?.assessmentResult?.recommendedRoomIds || [];
  const usersMap = useMemo(() => new Map(allUsers.map(u => [u.id, u])), [allUsers]);

  const officialRooms = allChatRooms.filter(room => !room.isPrivate);
  const privateRooms = allChatRooms.filter(room => room.isPrivate && room.members?.includes(user?.id || ''));

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">{t.communityChatRooms}</h1>
            <button 
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
            >
                <PlusCircle size={20} />
                {t.createRoom}
            </button>
        </div>
        
        <section className="mb-12">
            <h2 className="flex items-center gap-3 text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                <ShieldCheck className="text-blue-500" />
                {t.officialRooms}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {officialRooms.map((room) => (
                <div
                    key={room.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:scale-105 border-t-4 border-blue-500 ${
                    recommendedRoomIds.includes(room.id) ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''
                    }`}
                >
                    <div>
                    {recommendedRoomIds.includes(room.id) && (
                        <div className="flex items-center text-yellow-500 dark:text-yellow-400 mb-2">
                        <Star size={16} className="fill-current" />
                        <span className="ml-1 rtl:mr-1 text-sm font-semibold">Recommended</span>
                        </div>
                    )}
                    <div className="flex items-center mb-4">
                        <span className="text-4xl mr-4">{room.icon}</span>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{room.name[language]}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{room.description[language]}</p>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                    {t.join}
                    </button>
                </div>
                ))}
            </div>
        </section>

        <section>
            <h2 className="flex items-center gap-3 text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                <Lock className="text-green-500" />
                {t.privateRooms}
            </h2>
            {privateRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {privateRooms.map((room) => {
                    const owner = room.ownerId ? usersMap.get(room.ownerId) : null;
                    return (
                        <div
                            key={room.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:scale-105 border-t-4 border-green-500"
                        >
                            <div>
                                <div className="flex items-center mb-4">
                                    <span className="text-4xl mr-4">{room.icon}</span>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{room.name[language]}</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-2">{room.description[language]}</p>
                                {owner && <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t.createdBy} {owner.name}</p>}
                            </div>
                            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                            {t.join}
                            </button>
                        </div>
                    );
                 })}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">{t.noResults}</p>
                </div>
            )}
        </section>

      </div>
      <CreateRoomModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
    </>
  );
};

export default ChatRooms;

import React, { useContext } from 'react';
import { UserContext, LanguageContext } from '../App';
import { Link } from 'react-router-dom';
import { CHAT_ROOMS_DATA } from '../constants';
import { AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useContext(UserContext);
  const { t, language } = useContext(LanguageContext);

  if (!user || !user.assessmentResult) {
    return (
      <div className="p-8 text-center">
        <p>{t.error}</p>
        <Link to="/onboarding" className="text-blue-500">{t.startAssessment}</Link>
      </div>
    );
  }

  const { primaryConcern, summary, recommendedRoomIds } = user.assessmentResult;
  const recommendedRooms = CHAT_ROOMS_DATA.filter(room => recommendedRoomIds.includes(room.id));
  const isProfileIncomplete = !user.avatar || !user.bio?.trim() || user.name === 'New User';

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">{t.myDashboard}</h1>
      
      {isProfileIncomplete && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 p-4 rounded-r-lg mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 rtl:ml-3 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-amber-800 dark:text-amber-200">{t.completeYourProfile}</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">{t.completeProfilePrompt}</p>
            </div>
          </div>
          <Link 
            to="/profile" 
            className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold py-2 px-4 rounded-lg whitespace-nowrap transition-colors self-end sm:self-center"
          >
            {t.goToProfile}
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">{t.assessmentResult}</h2>
            <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">{primaryConcern}</h3>
              <p className="text-gray-700 dark:text-gray-300">{summary}</p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">{t.recommendedRooms}</h2>
            {recommendedRooms.length > 0 ? (
              <ul className="space-y-4">
                {recommendedRooms.map((room) => (
                  <li key={room.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-4">{room.icon}</span>
                      <div>
                        <h4 className="font-bold">{room.name[language]}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{room.description[language]}</p>
                      </div>
                    </div>
                    <Link to="/chat-rooms" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-transform transform hover:scale-105">
                      {t.join}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">{t.noResults}</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
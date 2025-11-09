
import React, { useState, useContext, useMemo } from 'react';
import { LanguageContext } from '../App';
import { THERAPISTS_DATA } from '../constants';
import { Search } from 'lucide-react';

const Therapists: React.FC = () => {
  const { t, language } = useContext(LanguageContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTherapists = useMemo(() => {
    return THERAPISTS_DATA.filter((therapist) =>
      therapist.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">{t.findTherapist}</h1>
      
      <div className="mb-8 max-w-lg mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder={t.searchByCity}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 rtl:pr-12 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="absolute inset-y-0 left-0 rtl:right-0 flex items-center pl-4 rtl:pr-4 pointer-events-none">
            <Search className="text-gray-400" />
          </div>
        </div>
      </div>

      {filteredTherapists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredTherapists.map((therapist) => (
            <div key={therapist.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center transform hover:-translate-y-2 transition-transform duration-300">
              <img
                src={therapist.avatar}
                alt={therapist.name}
                className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-blue-200 dark:border-blue-800"
              />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{therapist.name}</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium my-1">{therapist.specialty[language]}</p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{therapist.city}</p>
              <button className="w-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 font-semibold py-2 px-4 rounded-lg transition-colors">
                {t.viewProfile}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 text-lg">{t.noResults}</p>
        </div>
      )}
    </div>
  );
};

export default Therapists;

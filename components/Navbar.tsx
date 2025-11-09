import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext, LanguageContext } from '../App';
import { Language } from '../types';
import { Globe, MessageSquare, Users, LayoutDashboard, ScrollText, Stethoscope, User as UserIcon, Home, UserPlus } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const languages = [
    { code: Language.EN, name: 'English' },
    { code: Language.AR, name: 'العربية' },
    { code: Language.FR, name: 'Français' },
  ];
  
  const handleBlur = () => {
    setTimeout(() => {
      setIsLangMenuOpen(false);
    }, 200);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        onBlur={handleBlur}
        className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isLangMenuOpen}
        aria-label="Change language"
      >
        <Globe size={24} />
      </button>
      {isLangMenuOpen && (
        <div className="origin-top-right absolute end-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsLangMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  language === lang.code
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-200'
                } hover:bg-gray-100 dark:hover:bg-gray-600 block`}
                role="menuitem"
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const { user } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { to: '/home', text: t.home, icon: <Home size={20} /> },
    { to: '/dashboard', text: t.dashboard, icon: <LayoutDashboard size={20} /> },
    { to: '/feed', text: t.feed, icon: <ScrollText size={20} /> },
    { to: '/friends', text: t.friends, icon: <UserPlus size={20} /> },
    { to: '/chat-rooms', text: t.chatRooms, icon: <Users size={20} /> },
    { to: '/chatbot', text: t.aiCompanion, icon: <MessageSquare size={20} /> },
    { to: '/therapists', text: t.therapists, icon: <Stethoscope size={20} /> },
  ];
  
  const activeLinkStyle = {
    backgroundColor: '#3b82f6', // bg-blue-600
    color: 'white',
  };
  
  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg' : 'bg-white dark:bg-gray-800 shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/dashboard" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {t.appName}
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 rtl:space-x-reverse">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.text}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <LanguageSwitcher />
            <div className="hidden md:block ml-2 rtl:mr-2">
                 <NavLink 
                    to="/profile" 
                    className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none block" 
                    aria-label={t.profile}
                    style={({ isActive }) => (isActive ? {boxShadow: `0 0 0 3px #bfdbfe`} : {})}
                >
                    {user?.avatar ? (
                     <img src={user.avatar} alt={t.profile} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                       <UserIcon size={20} />
                    </div>
                  )}
                </NavLink>
            </div>
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                {link.icon}
                {link.text}
              </NavLink>
            ))}
             <NavLink
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
              style={({ isActive }) => (isActive ? activeLinkStyle : {})}
              className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={t.profile} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <UserIcon size={20} />
              )}
              {t.profile}
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
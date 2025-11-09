import React, { useState, useContext, useEffect, useRef } from 'react';
import { UserContext, LanguageContext } from '../App';
import { Camera, User as UserIcon } from 'lucide-react';

const Profile: React.FC = () => {
    const { user, updateProfile, updateAvatar } = useContext(UserContext);
    const { t } = useContext(LanguageContext);
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [isSaved, setIsSaved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setBio(user.bio || '');
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!user) return;
        updateProfile(name, bio);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                updateAvatar(result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    if (!user) {
        return (
             <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">{t.yourProfile}</h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        <button 
                            onClick={handleAvatarClick} 
                            className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 border-4 border-gray-100 dark:border-gray-600 shadow-md cursor-pointer group"
                            aria-label={t.changeAvatar}
                        >
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={64} />
                            )}
                             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
                                <Camera size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                        />
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{t.fullName}</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="bio" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{t.aboutYourself}</label>
                        <textarea
                            id="bio"
                            rows={5}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder={t.whatOnYourMind}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center justify-end gap-4">
                        {isSaved && <p className="text-green-600 dark:text-green-400 transition-opacity duration-300 animate-pulse">{t.profileUpdated}</p>}
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
                        >
                            {t.saveChanges}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
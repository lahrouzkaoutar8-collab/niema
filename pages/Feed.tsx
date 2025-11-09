
import React, { useState, useContext, useRef } from 'react';
import { UserContext, LanguageContext } from '../App';
import { ImagePlus, Send, Heart, User as UserIcon } from 'lucide-react';

const Feed: React.FC = () => {
  const { user, addPost, toggleLikePost } = useContext(UserContext);
  const { t } = useContext(LanguageContext);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPostImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostText.trim() === '' || !user) return;
    addPost(newPostText, newPostImage || undefined);
    setNewPostText('');
    setNewPostImage(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">{t.myFeed}</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center mb-4">
            {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover mr-4" />
            ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-4">
                    <UserIcon size={24} className="text-gray-500 dark:text-gray-400" />
                </div>
            )}
            <h2 className="text-xl font-semibold">{t.shareExperience}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder={t.whatOnYourMind}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={4}
          />
          {newPostImage && (
            <div className="mt-4">
              <img src={newPostImage} alt="Preview" className="max-h-60 rounded-lg" />
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              <ImagePlus size={20} />
              {t.selectImage}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!newPostText.trim() || !user}
            >
              {t.post}
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {user?.posts && user.posts.length > 0 ? (
          user.posts.map((post) => {
            const isLiked = user && post.likes?.includes(user.id);
            const likeCount = post.likes?.length || 0;

            return (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{post.text}</p>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="Post content" className="mt-4 rounded-lg max-h-96 w-auto" />
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t.postedOn} {new Date(post.timestamp).toLocaleString()}
                  </p>
                   <div className="flex items-center gap-2">
                    <button
                        onClick={() => toggleLikePost(post.id)}
                        className={`flex items-center gap-1 p-2 rounded-full transition-colors ${
                            isLiked
                            ? 'text-red-500 bg-red-100 dark:bg-red-900/50'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        aria-label={t.like}
                    >
                        <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {likeCount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">{t.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
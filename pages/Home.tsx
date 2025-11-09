import React, { useContext, useMemo } from 'react';
import { UserContext, LanguageContext } from '../App';
import { User as UserIcon, Heart } from 'lucide-react';

const Home: React.FC = () => {
  const { allUsers, user, toggleLikePost } = useContext(UserContext);
  const { t } = useContext(LanguageContext);

  const allPosts = useMemo(() => {
    return allUsers
      .flatMap(user => user.posts)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [allUsers]);

  const usersMap = useMemo(() => {
    return new Map(allUsers.map(user => [user.id, user]));
  }, [allUsers]);

  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">{t.home}</h1>
      
      <div className="space-y-6">
        {allPosts.length > 0 ? (
          allPosts.map((post) => {
            const author = usersMap.get(post.authorId);
            if (!author) return null;

            const isLiked = user && post.likes?.includes(user.id);
            const likeCount = post.likes?.length || 0;
            
            return (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  {author.avatar ? (
                    <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-4">
                      <UserIcon size={24} className="text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{author.name}</h3>
                  </div>
                </div>
                
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{post.text}</p>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="Post content" className="mt-4 rounded-lg max-h-96 w-auto" />
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.timestamp).toLocaleString()}
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
                            disabled={!user}
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

export default Home;
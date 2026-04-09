import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { PostSummary } from '../types';

export function Home() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/posts.json')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load posts:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <div className="w-3 h-3 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter text-gray-900 leading-tight">
          Build Thoughtful <br className="hidden md:block" /> AI Systems.
        </h1>
      </div>

      <div className="grid gap-8">
        {posts.map(post => (
          <article key={post.id} className="neo-brutalism-card flex flex-col">
            <div className="neo-brutalism-header font-mono text-sm">
              <time dateTime={post.date}>
                {format(new Date(post.date), 'MMMM d, yyyy')}
              </time>
              {post.categories && post.categories.length > 0 && (
                <span className="bg-white text-primary px-2 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider">
                  {post.categories[0]}
                </span>
              )}
            </div>
            
            <div className="p-6 md:p-8 flex-grow flex flex-col">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                <Link to={`/post/${post.slug}`} className="hover:text-accent transition-colors">
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-8 flex-grow">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-2 flex-wrap">
                  {post.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-1 rounded-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <Link 
                  to={`/post/${post.slug}`} 
                  className="flex items-center gap-2 text-accent font-bold font-mono text-sm group"
                >
                  View Post
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-500 border-3 border-dashed border-gray-300 rounded-sm">
          No posts found. Start writing!
        </div>
      )}
    </div>
  );
}
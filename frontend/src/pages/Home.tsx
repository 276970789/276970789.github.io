import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight, X } from 'lucide-react';
import { PostSummary } from '../types';

export function Home() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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

  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get('category');

  const filteredPosts = activeCategory
    ? posts.filter(post => post.categories?.includes(activeCategory))
    : posts;

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
      <div className="mb-24 relative mt-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
        <div className="flex-1 relative w-full">
          <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 to-primary/5 blur-3xl -z-10 rounded-full"></div>
          
          <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tighter leading-[1.05] relative z-10">
            <span className="block text-primary mb-2">
              Harness the Chaos.
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent via-orange-500 to-accent pb-2">
              Build the Universal AI.
            </span>
          </h1>
          
          {/* 装饰性底部线条与闪烁光标 */}
          <div className="flex items-center gap-4 mt-8">
            <div className="h-[2px] w-12 bg-accent"></div>
            <div className="h-2 w-2 bg-primary animate-pulse"></div>
            <div className="h-[1px] w-full max-w-[200px] bg-gradient-to-r from-gray-300 to-transparent"></div>
          </div>
          {activeCategory && (
            <div className="flex items-center gap-3 mt-4">
              <span className="text-gray-600 font-medium">分类过滤:</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-accent font-bold rounded-sm border border-orange-200">
                {activeCategory}
                <Link to="/" className="hover:bg-orange-200 rounded-full p-0.5 transition-colors">
                  <X size={14} />
                </Link>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8">
        {filteredPosts.map(post => (
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
      
      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-gray-500 border-3 border-dashed border-gray-300 rounded-sm">
          No posts found. Start writing!
        </div>
      )}
    </div>
  );
}
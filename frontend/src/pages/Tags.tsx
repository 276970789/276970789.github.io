import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { PostSummary } from '../types';

export function Tags() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [activeTag, setActiveTag] = useState<string | null>(null);

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

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setActiveTag(hash);
    } else {
      setActiveTag(null);
    }
  }, [location.hash]);

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

  // Get all unique tags and count them
  const tagCounts: Record<string, number> = {};
  posts.forEach(post => {
    post.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

  const filteredPosts = activeTag 
    ? posts.filter(post => post.tags?.includes(activeTag))
    : posts;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-primary">
          Tags Archive
        </h1>
        <p className="text-lg text-gray-600">
          Browse articles by topics.
        </p>
      </div>

      {sortedTags.length > 0 ? (
        <div className="bg-background border-3 border-primary rounded-sm p-6 mb-12 shadow-[4px_4px_0px_0px_rgba(30,30,30,1)]">
          <div className="flex flex-wrap gap-3">
            <Link 
              to="/tags"
              className={`px-3 py-1.5 rounded-sm font-mono text-sm border-2 transition-colors ${
                activeTag === null 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white text-primary border-gray-200 hover:border-primary'
              }`}
            >
              All ({posts.length})
            </Link>
            {sortedTags.map(tag => (
              <Link 
                key={tag}
                to={`#${tag}`}
                className={`px-3 py-1.5 rounded-sm font-mono text-sm border-2 transition-colors flex items-center gap-2 ${
                  activeTag === tag 
                    ? 'bg-accent text-white border-accent' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                <span>#{tag}</span>
                <span className="text-xs opacity-70 bg-black/10 px-1.5 py-0.5 rounded-sm">
                  {tagCounts[tag]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No tags found yet.
        </div>
      )}

      <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-gray-200">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <div key={post.id} className="relative pl-10 animate-in slide-in-from-left-4 duration-300" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
              {/* Timeline dot */}
              <div className="absolute left-0 top-3 w-6 h-6 rounded-full bg-white border-3 border-primary flex items-center justify-center z-10 shadow-[2px_2px_0px_0px_rgba(30,30,30,1)]">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
              </div>
              
              <Link 
                to={`/post/${post.slug}`}
                className="block group"
              >
                <div className="bg-white border-2 border-transparent group-hover:border-primary p-4 rounded-sm transition-all group-hover:shadow-[4px_4px_0px_0px_rgba(30,30,30,1)] group-hover:-translate-y-0.5">
                  <div className="text-xs font-mono text-gray-500 mb-1">
                    <time dateTime={post.date}>{format(new Date(post.date), 'MMM d, yyyy')}</time>
                  </div>
                  <h3 className="font-bold text-xl text-primary group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="pl-10 text-gray-500 py-8">
            No posts found for this tag.
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PostSummary } from '../types';

export function Archive() {
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
        console.error('Failed to load posts', err);
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

  // Group posts by year and month
  const groupedPosts: Record<string, PostSummary[]> = {};
  posts.forEach(post => {
    const date = new Date(post.date);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    if (!groupedPosts[yearMonth]) {
      groupedPosts[yearMonth] = [];
    }
    groupedPosts[yearMonth].push(post);
  });

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight text-primary border-b-4 border-primary pb-4 inline-block">
        归档
      </h1>

      <div className="space-y-12">
        {Object.entries(groupedPosts).map(([yearMonth, monthPosts]) => (
          <section key={yearMonth}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
              <span className="w-3 h-3 bg-accent inline-block rounded-sm"></span>
              {yearMonth}
            </h2>
            <ul className="space-y-4 border-l-2 border-gray-200 ml-1.5 pl-6">
              {monthPosts.map(post => {
                const d = new Date(post.date);
                const day = d.getDate().toString().padStart(2, '0');
                
                return (
                  <li key={post.id} className="relative">
                    <span className="absolute -left-[29px] top-2.5 w-2 h-2 bg-gray-400 rounded-full border-2 border-background"></span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 group">
                      <time className="text-sm font-mono text-gray-500 min-w-[3rem]">
                        {day}日
                      </time>
                      <Link 
                        to={`/post/${post.slug}`}
                        className="text-lg font-medium text-primary hover:text-accent transition-colors underline-offset-4 group-hover:underline"
                      >
                        {post.title}
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

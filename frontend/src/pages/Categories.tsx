import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';
import { PostSummary } from '../types';

export function Categories() {
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

  // Get all unique categories and count them
  const categoryCounts: Record<string, number> = {};
  posts.forEach(post => {
    post.categories?.forEach(category => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
  });

  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by count descending
    .map(([category, count]) => ({ name: category, count }));

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-primary border-b-4 border-primary pb-4 inline-block">
          分类
        </h1>
      </div>

      <div className="space-y-6 mt-8">
        {sortedCategories.length > 0 ? (
          sortedCategories.map((category, index) => (
            <Link 
              key={category.name}
              to={`/?category=${encodeURIComponent(category.name)}`}
              className="flex items-center justify-between group py-2"
            >
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold transition-colors ${index === 0 ? 'text-accent' : 'text-gray-800 group-hover:text-accent'}`}>
                  {category.name}
                </span>
                <ChevronRight 
                  size={18} 
                  strokeWidth={3} 
                  className={`transition-colors ${index === 0 ? 'text-accent' : 'text-gray-800 group-hover:text-accent'}`} 
                />
              </div>
              
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <FileText size={16} />
                <span>{category.count}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 border-3 border-dashed border-gray-300 rounded-sm">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { PostSummary } from '../types';

export function Categories() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/data/posts.json')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        
        // 默认展开所有分类，或者您可以根据需要修改为默认只展开第一个
        const categories = new Set<string>();
        data.forEach((p: PostSummary) => p.categories?.forEach(c => categories.add(c)));
        setExpanded(categories);
        
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

  // 按照分类对文章进行分组
  const groupedPosts: Record<string, PostSummary[]> = {};
  posts.forEach(post => {
    if (!post.categories || post.categories.length === 0) return;
    
    post.categories.forEach(category => {
      if (!groupedPosts[category]) {
        groupedPosts[category] = [];
      }
      groupedPosts[category].push(post);
    });
  });

  // 按包含的文章数量降序排序分类
  const sortedCategories = Object.keys(groupedPosts).sort(
    (a, b) => groupedPosts[b].length - groupedPosts[a].length
  );

  const toggleCategory = (category: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-primary border-b-4 border-primary pb-4 inline-block">
          分类
        </h1>
      </div>

      <div className="space-y-16">
        {sortedCategories.length > 0 ? (
          sortedCategories.map(category => {
            const isExpanded = expanded.has(category);
            return (
              <div key={category} className="animate-in fade-in duration-300">
                <button 
                  onClick={() => toggleCategory(category)}
                  className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-accent hover:opacity-80 transition-opacity mb-8"
                >
                  {category}
                  {isExpanded ? (
                    <ChevronDown size={32} strokeWidth={3} />
                  ) : (
                    <ChevronRight size={32} strokeWidth={3} />
                  )}
                </button>
                
                {isExpanded && (
                  <ul className="space-y-8 ml-4 md:ml-8">
                    {groupedPosts[category].map(post => (
                      <li key={post.id}>
                        <Link 
                          to={`/post/${post.slug}`}
                          className="text-lg md:text-xl text-gray-800 hover:text-accent transition-colors block"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-500 border-3 border-dashed border-gray-300 rounded-sm">
            暂无分类数据。
          </div>
        )}
      </div>
    </div>
  );
}

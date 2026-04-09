import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Mail, X } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { format } from 'date-fns';

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { search } = useSearch();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  
  const searchResults = search(searchQuery);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/post/${slug}`);
  };

  return (
    <>
    <header className="sticky top-0 z-50 bg-background border-b-3 border-primary py-4">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-2xl tracking-tighter text-primary flex items-center group font-mono">
            <span className="text-accent group-hover:animate-pulse mr-1">~/</span>
            <span>LIAM</span>
            <span className="w-1.5 h-6 bg-primary ml-1 animate-pulse group-hover:bg-accent transition-colors"></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 font-medium text-sm">
            <Link to="/" className="hover:text-accent transition-colors">首页</Link>
            <Link to="/about" className="hover:text-accent transition-colors">关于我</Link>
            <Link to="/archive" className="hover:text-accent transition-colors">归档</Link>
            <Link to="/categories" className="hover:text-accent transition-colors">分类</Link>
            <Link to="/tags" className="hover:text-accent transition-colors">标签</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="mailto:Gnew2024@bupt.edu.cn" 
            className="hidden md:flex items-center gap-2 text-sm font-mono border-2 border-primary px-3 py-1.5 rounded-sm hover:bg-primary hover:text-white transition-colors"
          >
            <Mail size={16} />
            <span>Gnew2024@bupt.edu.cn</span>
          </a>

          <div className="relative" ref={searchRef}>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-200 rounded-sm transition-colors"
              aria-label="Search"
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {isSearchOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-background border-3 border-primary rounded-sm shadow-[4px_4px_0px_0px_rgba(30,30,30,1)]">
                <div className="p-2 border-b-2 border-primary">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none outline-none p-2 text-sm font-sans"
                  />
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {searchQuery && searchResults.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No results found</div>
                  ) : (
                    searchResults.map(post => (
                      <div 
                        key={post.id}
                        onClick={() => handleResultClick(post.slug)}
                        className="p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors last:border-b-0"
                      >
                        <h4 className="font-bold text-sm text-primary mb-1 line-clamp-1">{post.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                          <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    ))
                  )}
                  {!searchQuery && (
                    <div className="p-4 text-center text-sm text-gray-500">Type to search</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
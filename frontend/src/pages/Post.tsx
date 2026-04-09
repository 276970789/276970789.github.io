import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, BarChart2, FileClock } from 'lucide-react';
import { PostDetail } from '../types';
import { MarkdownViewer } from '../components/MarkdownViewer';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function Post() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    fetch(`/data/${slug}.json`)
      .then(res => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then(data => {
        setPost(data);
        
        // Extract headings for TOC
        const extractedHeadings: Heading[] = [];
        const headingRegex = /^(#{1,3})\s+(.+)$/gm;
        let match;
        while ((match = headingRegex.exec(data.content)) !== null) {
          const level = match[1].length;
          const text = match[2];
          const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          extractedHeadings.push({ id, text, level });
        }
        setHeadings(extractedHeadings);
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  // Add ids to DOM headings and setup scroll spy
  useEffect(() => {
    if (!post || headings.length === 0) return;
    
    // Quick and dirty way to add IDs to rendered headings
    const article = document.getElementById('post-content');
    if (article) {
      const domHeadings = article.querySelectorAll('h1, h2, h3');
      domHeadings.forEach((heading) => {
        const text = heading.textContent || '';
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        heading.id = id;
      });
    }

    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
      const scrollPosition = window.scrollY + 100;

      let currentId = '';
      for (const element of headingElements) {
        if (element.offsetTop <= scrollPosition) {
          currentId = element.id;
        } else {
          break;
        }
      }
      if (currentId) setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post, headings]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <div className="w-3 h-3 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
        <Link to="/" className="neo-brutalism-btn inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 relative items-start animate-in fade-in duration-500">
      <article className="flex-1 min-w-0 w-full max-w-3xl mx-auto lg:mx-0">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-mono text-gray-500 hover:text-accent mb-6 transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 tracking-tight text-primary">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-base text-gray-700 font-medium">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-800" />
              <time dateTime={post.date}>
                {(() => {
                  const d = new Date(post.date);
                  const h = d.getHours();
                  let tod = '晚上';
                  if (h < 6) tod = '凌晨';
                  else if (h < 12) tod = '上午';
                  else if (h === 12) tod = '中午';
                  else if (h < 18) tod = '下午';
                  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${tod}`;
                })()}
              </time>
            </div>
            
            <div className="flex items-center gap-2">
              <BarChart2 size={18} className="text-gray-800" />
              <span>
                {post.wordCount && post.wordCount >= 1000 
                  ? `${(post.wordCount / 1000).toFixed(1).replace(/\.0$/, '')}k 字` 
                  : `${post.wordCount || 0} 字`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FileClock size={18} className="text-gray-800" />
              <span>{post.readingTime || 1} 分钟</span>
            </div>
          </div>
          
          {post.categories && post.categories.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm font-mono">
              <span className="uppercase text-primary font-bold px-2 py-1 bg-orange-100 rounded-sm border border-orange-200">
                {post.categories[0]}
              </span>
            </div>
          )}
        </div>

        <div id="post-content" className="bg-background border-3 border-primary rounded-sm p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(30,30,30,1)]">
          <MarkdownViewer content={post.content} />
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 flex gap-2 flex-wrap">
            {post.tags.map(tag => (
              <Link 
                key={tag} 
                to={`/tags#${tag}`}
                className="text-sm font-mono bg-gray-200 text-gray-700 px-3 py-1 rounded-sm hover:bg-primary hover:text-white transition-colors border border-transparent hover:border-primary"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </article>

      {/* Sidebar TOC */}
      {headings.length > 0 && (
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start">
          <div className="bg-background border-3 border-primary rounded-sm p-4 shadow-[4px_4px_0px_0px_rgba(30,30,30,1)]">
            <h3 className="font-bold font-mono text-sm uppercase mb-4 text-primary border-b-2 border-primary pb-2">
              Table of Contents
            </h3>
            <ul className="space-y-2 text-sm">
              {headings.map(heading => (
                <li 
                  key={heading.id} 
                  style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
                >
                  <a 
                    href={`#${heading.id}`}
                    className={`block py-1 px-2 border-l-2 transition-colors ${
                      activeId === heading.id 
                        ? 'border-accent text-accent font-bold bg-orange-50' 
                        : 'border-transparent text-gray-600 hover:text-primary hover:bg-gray-100'
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}
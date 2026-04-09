import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { PostSummary } from '../types';

export function useSearch() {
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
        console.error('Failed to load search index:', err);
        setLoading(false);
      });
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(posts, {
      keys: ['title', 'excerpt', 'tags', 'categories'],
      threshold: 0.3,
      includeMatches: true,
    });
  }, [posts]);

  const search = (query: string) => {
    if (!query) return [];
    return fuse.search(query).map(result => result.item);
  };

  return { search, loading };
}
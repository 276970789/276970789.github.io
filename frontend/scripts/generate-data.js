import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../../source/_posts');
const OUTPUT_DIR = path.join(__dirname, '../public/data');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Ensure the directory exists before reading
if (!fs.existsSync(POSTS_DIR)) {
  console.warn(`Posts directory ${POSTS_DIR} does not exist. Creating it...`);
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));

const posts = [];

for (const file of files) {
  const filePath = path.join(POSTS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const parsed = matter(content);
  const slug = file.replace(/\.md$/, '');
  
  // Extract excerpt (first paragraph or summary)
  let excerpt = parsed.data.excerpt || '';
  if (!excerpt) {
    const plainText = parsed.content.replace(/#+\s+.*?\n/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/!\[(.*?)\]\(.*?\)/g, '').trim();
    excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
  }

  const postData = {
    id: slug,
    slug,
    title: parsed.data.title || slug,
    date: parsed.data.date ? new Date(parsed.data.date).toISOString() : new Date().toISOString(),
    categories: parsed.data.categories || [],
    tags: parsed.data.tags || [],
    excerpt,
    wordCount: 0,
    readingTime: 0,
  };

  // Calculate word count and reading time
  const chineseRegex = /[\u4e00-\u9fa5]/g;
  const englishRegex = /[a-zA-Z0-9]+/g;
  const plainTextFull = parsed.content.replace(/#+\s+.*?\n/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/!\[(.*?)\]\(.*?\)/g, '').trim();
  const chineseMatches = plainTextFull.match(chineseRegex) || [];
  const englishMatches = plainTextFull.match(englishRegex) || [];
  const wordCount = chineseMatches.length + englishMatches.length;
  postData.wordCount = wordCount;
  postData.readingTime = Math.max(1, Math.ceil(wordCount / 300)); // Assume 300 words per minute

  posts.push(postData);

  // Write individual post data
  const postDetailData = {
    ...postData,
    content: parsed.content,
  };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${slug}.json`),
    JSON.stringify(postDetailData, null, 2)
  );
}

// Sort posts by date descending
posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Write index data for Home page and Search
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'posts.json'),
  JSON.stringify(posts, null, 2)
);

console.log(`Generated data for ${posts.length} posts.`);

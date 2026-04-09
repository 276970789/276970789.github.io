import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Post } from './pages/Post';
import { About } from './pages/About';
import { Tags } from './pages/Tags';
import { Archive } from './pages/Archive';
import { Categories } from './pages/Categories';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-text font-sans flex flex-col selection:bg-accent selection:text-white">
        <Navbar />
        <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<Post />} />
            <Route path="/about" element={<About />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </main>
        
        <footer className="border-t-3 border-primary py-8 mt-12 bg-background">
          <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-bold text-lg text-primary tracking-tight font-sans flex items-center">
              Liam's Blog
            </div>
            <div className="flex gap-6 text-sm font-medium">
              <a href="mailto:Gnew2024@bupt.edu.cn" className="hover:text-accent transition-colors">
                Email
              </a>
              <a href="https://github.com/276970789" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                GitHub
              </a>
            </div>
            <div className="text-sm text-gray-500 font-mono">
              © {new Date().getFullYear()} Liam
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', section: 'home' },
    { name: 'Skills', path: '/', section: 'skills' },
    { name: 'Projects', path: '/', section: 'projects' },
    { name: 'Experience', path: '/', section: 'experience' },
    { name: 'Education', path: '/', section: 'education' },
    { name: 'Blog', path: '/blog', section: null },
    { name: 'Contact', path: '/', section: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-6">
      <nav className="container mx-auto px-4">
        <div className={`flex items-center justify-between px-5 py-2.5 rounded-full transition-all duration-500 ${
          isScrolled
            ? 'bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10'
            : 'bg-slate-900/80 dark:bg-slate-800/75 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] ring-1 ring-white/[0.08]'
        }`}>
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#EF6461] to-[#ff8a87] flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-base font-semibold text-white hidden sm:block">Harshal</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              link.section ? (
                <button
                  key={link.name}
                  onClick={() => {
                    if (location.pathname !== '/') {
                      window.location.href = '/#' + link.section;
                    } else {
                      scrollToSection(link.section);
                    }
                  }}
                  className="px-4 py-1.5 text-sm font-medium transition-all duration-200 text-white/75 hover:text-white hover:bg-white/10 rounded-full"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-full ${
                    location.pathname === link.path
                      ? 'text-white bg-white/15'
                      : 'text-white/75 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="hidden md:block p-2 rounded-full hover:bg-white/10 transition-colors text-white/75 hover:text-white"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-white/10 text-white/80"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 py-4 bg-slate-900/95 backdrop-blur-2xl rounded-2xl px-5 ring-1 ring-white/10">
            {navLinks.map((link) => (
              link.section ? (
                <button
                  key={link.name}
                  onClick={() => {
                    if (location.pathname !== '/') {
                      window.location.href = '/#' + link.section;
                    } else {
                      scrollToSection(link.section);
                    }
                  }}
                  className="block py-2.5 text-sm font-medium transition-colors text-white/75 hover:text-white w-full text-left"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#EF6461]'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
            <button
              onClick={toggleTheme}
              className="mt-3 flex items-center space-x-2 text-white/75 hover:text-white"
            >
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

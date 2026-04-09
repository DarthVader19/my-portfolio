/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  ChevronRight, 
  Download, 
  Cpu, 
  Brain, 
  Database, 
  Layers,
  MapPin,
  Briefcase,
  BookOpen,
  Clock,
  ArrowUpRight,
  Sun,
  Moon,
  Monitor,
  Copy,
  Check,
  Menu,
  X,
  Palette
} from 'lucide-react';
import portfolioData from './portfolio-data.json';
import { ParticleBackground } from './components/ParticleBackground';

type Theme = 'light' | 'dark' | 'system';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('portfolio-theme') as Theme;
    return saved || 'system';
  });
  
  const { personal, skills, projects, experience, blogs } = portfolioData;

  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = (t: Theme) => {
      root.classList.remove('light', 'dark');
      if (t === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(t);
      }
    };

    applyTheme(theme);
    localStorage.setItem('portfolio-theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'blogs'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust detection range for better accuracy with fixed header
          return rect.top >= -150 && rect.top <= 250;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for the fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen selection:bg-blue-500/30 transition-colors duration-300">
      {/* Desktop Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 glass-card hidden md:flex items-center gap-8">
        <div className="flex items-center gap-8">
          {['About', 'Skills', 'Projects', 'Experience', 'Blogs'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={(e) => scrollToSection(e, item.toLowerCase())}
              className={`text-sm font-medium transition-all hover:scale-110 active:scale-95 ${
                activeSection === item.toLowerCase() ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />

        {/* Theme selector: hidden by default, revealed on hover */}
        <div className="relative group">
          <button
            className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110"
            title="Theme"
          >
            <Palette size={16} />
          </button>
          <div className="absolute right-0 top-full pt-4 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 origin-top-right">
            <div className="flex items-center gap-2 p-1.5 bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-xl rounded-full border border-black/10 dark:border-white/10 shadow-xl">
              {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`p-2 rounded-full transition-all hover:scale-110 active:scale-90 ${
                    theme === t 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  title={`${t.charAt(0).toUpperCase() + t.slice(1)} Mode`}
                >
                  {t === 'light' && <Sun size={16} />}
                  {t === 'dark' && <Moon size={16} />}
                  {t === 'system' && <Monitor size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-6 right-6 z-[60] p-3 glass-card md:hidden transition-all hover:scale-110 active:scale-95 text-gray-700 dark:text-gray-300"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-72 z-[56] md:hidden bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl border-l border-black/10 dark:border-white/10 shadow-2xl"
            >
              <div className="flex flex-col h-full pt-24 pb-10 px-8">
                <div className="flex flex-col gap-2">
                  {['About', 'Skills', 'Projects', 'Experience', 'Blogs'].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={(e) => {
                        scrollToSection(e, item.toLowerCase());
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        activeSection === item.toLowerCase()
                          ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                    >
                      {item}
                    </a>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4 px-4">Theme</p>
                  <div className="flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/5">
                    {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-full transition-all text-xs font-medium ${
                          theme === t
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                        title={`${t.charAt(0).toUpperCase() + t.slice(1)} Mode`}
                      >
                        {t === 'light' && <Sun size={14} />}
                        {t === 'dark' && <Moon size={14} />}
                        {t === 'system' && <Monitor size={14} />}
                        <span className="capitalize">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex gap-4 justify-center">
                  <a href={personal.github} className="p-3 glass-card hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"><Github size={20} /></a>
                  <a href={personal.linkedin} className="p-3 glass-card hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"><Linkedin size={20} /></a>
                  <a href={`mailto:${personal.email}`} className="p-3 glass-card hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"><Mail size={20} /></a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Modern Hero Background with Image */}
        <div className="absolute inset-0 -z-10">
          <img 
            src={personal.heroImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30 dark:opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-white dark:from-[#0a0a0a] dark:via-[#0a0a0a]/40 dark:to-[#0a0a0a]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 mb-6 glass-card text-[10px] font-bold tracking-[0.3em] uppercase text-black dark:text-white"
          >
            Available for new opportunities
          </motion.span>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter text-black dark:text-white">
            I build <span className="text-gradient">Intelligent</span> Systems.
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            {personal.bio}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#projects" 
              onClick={(e) => scrollToSection(e, 'projects')}
              className="btn-primary group"
            >
              View Projects 
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href={personal.resumeUrl.includes('drive.google.com') 
                ? personal.resumeUrl.replace('/view?usp=sharing', '/view').replace('/view', '/uc?export=download')
                : personal.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary group"
              download="Resume.pdf"
            >
              Download CV 
              <Download size={18} className="group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-black/20 dark:from-white/20 to-transparent" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">The Journey</h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              <p>
                With over <span className="text-gray-900 dark:text-white font-medium">{personal.experience}</span> of experience in the AI landscape, I've transitioned from building simple linear models to architecting complex neural networks that solve real-world problems.
              </p>
              <p>
                My approach combines rigorous mathematical foundations with modern engineering practices. I believe that AI should not just be powerful, but also interpretable and efficient.
              </p>
              <div className="flex gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-black dark:text-white" />
                  <span>{personal.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase size={16} className="text-black dark:text-white" />
                  <span>Open to Remote</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-gray-200 to-gray-400 dark:from-white/10 dark:to-white/20 rounded-2xl blur-2xl opacity-10 dark:opacity-20 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity" />
            <div className="relative glass-card p-8 aspect-square flex flex-col justify-center items-center text-center">
              <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Brain size={48} className="text-black dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{personal.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">{personal.role}</p>
              <div className="flex gap-4">
                <a href={personal.github} className="p-3 glass-card hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"><Github size={20} /></a>
                <a href={personal.linkedin} className="p-3 glass-card hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"><Linkedin size={20} /></a>
                <a href={`mailto:${personal.email}`} className="p-3 glass-card hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"><Mail size={20} /></a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section with Particles */}
      <section id="skills" className="py-32 relative overflow-hidden bg-white dark:bg-black border-y border-black/5 dark:border-white/5">
        <ParticleBackground className="opacity-60 dark:opacity-80" />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Technical Arsenal</h2>
            <p className="text-gray-600 dark:text-gray-400">The tools and technologies I use to bring ideas to life.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillGroup, idx) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 hover:border-black/30 dark:hover:border-white/30 transition-colors group"
              >
                <div className="mb-4 text-black dark:text-white group-hover:scale-110 transition-transform inline-block">
                  {idx === 0 && <Cpu size={24} />}
                  {idx === 1 && <Brain size={24} />}
                  {idx === 2 && <Database size={24} />}
                  {idx === 3 && <Layers size={24} />}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-gray-200 dark:bg-white/5 rounded-full text-xs text-gray-700 dark:text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Selected Works</h2>
            <p className="text-gray-600 dark:text-gray-400">A collection of projects that define my engineering philosophy.</p>
          </div>
          <a href={personal.github} className="text-black dark:text-white font-medium flex items-center gap-2 hover:underline">
            View all on GitHub <ExternalLink size={16} />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group glass-card overflow-hidden"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent opacity-60" />
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-black dark:text-white">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                  {project.description}
                </p>
                <a 
                  href={project.link} 
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 group/link"
                >
                  Explore Project 
                  <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 bg-gray-50 dark:bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center text-gray-900 dark:text-white">Experience</h2>
          <div className="space-y-12">
            {experience.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-8 border-l border-gray-200 dark:border-white/10"
              >
                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-black dark:bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                  <span className="text-sm font-medium text-black dark:text-white bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full">
                    {exp.period}
                  </span>
                </div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">{exp.company}</p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section id="blogs" className="py-32 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Insights & Writing</h2>
          <p className="text-gray-600 dark:text-gray-400">Sharing my thoughts on AI, ML, and the future of technology.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 flex flex-col group hover:border-black/30 dark:hover:border-white/30 transition-all"
            >
              <div className="flex items-center gap-4 text-xs text-black dark:text-white mb-6 font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Clock size={14} /> {blog.date}</span>
                <span className="w-1 h-1 rounded-full bg-black/10 dark:bg-white/10" />
                <span>{blog.readTime}</span>
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors leading-tight text-gray-900 dark:text-white">
                {blog.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 line-clamp-3 leading-relaxed">
                {blog.excerpt}
              </p>
              <div className="mt-auto">
                <a 
                  href={blog.link} 
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group/link"
                >
                  Read Article <ArrowUpRight size={16} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-gray-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Let's Connect</h2>
            <p className="text-gray-600 dark:text-gray-400">Always open to discussing new projects or AI research.</p>
          </div>
          <div className="flex gap-6">
            <a href={personal.github} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-all hover:scale-125 active:scale-90"><Github size={24} /></a>
            <a href={personal.linkedin} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-all hover:scale-125 active:scale-90"><Linkedin size={24} /></a>
            <a href={`mailto:${personal.email}`} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-all hover:scale-125 active:scale-90"><Mail size={24} /></a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 text-center text-gray-500 dark:text-gray-600 text-sm">
          © {new Date().getFullYear()} {personal.name}. Built with React & Tailwind.
        </div>
      </footer>

      {/* Sticky Contact Button */}
      <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end gap-3">
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-2"
            >
              <Check size={14} /> Email Copied!
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={copyEmail}
            className="p-3 glass-card hover:bg-blue-50 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-all hover:scale-110 active:scale-90 group"
            title="Copy Email"
          >
            <Copy size={20} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </button>
          
          <a 
            href={`mailto:${personal.email}`}
            className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95 group"
          >
            <span className="hidden md:block">Get in Touch</span>
            <Mail size={20} className="group-hover:rotate-12 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}

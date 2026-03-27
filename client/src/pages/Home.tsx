import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { projectsAPI, skillsAPI, contentAPI, experienceAPI, educationAPI, settingsAPI } from '../services/api';
import ResumeModal from '../components/ResumeModal';
import RubiksCube from '../components/RubiksCube';

const useInView = (threshold = 0.12) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
};

const Fade: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
};

const categoryMeta: Record<string, { icon: string }> = {
  database:   { icon: '🗄️' },
  languages:  { icon: '💻' },
  frameworks: { icon: '⚛️' },
  tools:      { icon: '🔧' },
  courses:    { icon: '📚' },
};

const Home: React.FC = () => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const { data: projects }    = useQuery('featuredProjects', projectsAPI.getAll,              { refetchOnMount: 'always' });
  const { data: skills }      = useQuery('skills',           skillsAPI.getAll,                { refetchOnMount: 'always' });
  const { data: heroContent } = useQuery('heroContent',      () => contentAPI.get('hero'),    { refetchOnMount: 'always' });
  const { data: aboutContent }= useQuery('aboutContent',     () => contentAPI.get('about'),   { refetchOnMount: 'always' });
  const { data: experiences } = useQuery('experiences',      experienceAPI.getAll,            { refetchOnMount: 'always' });
  const { data: education }   = useQuery('education',        educationAPI.getAll,             { refetchOnMount: 'always' });
  const { data: settingsData }= useQuery('settings',         settingsAPI.get,                 { refetchOnMount: 'always' });

  const featuredProjects  = projects?.data?.filter((p: any) => p.featured).slice(0, 3) || [];
  const hero              = heroContent?.data?.data?.hero  || {};
  const about             = aboutContent?.data?.data?.about || {};
  const experienceList: any[] = experiences?.data?.data ?? [];
  const educationList: any[]  = education?.data?.data   ?? [];
  const settings          = settingsData?.data || {};

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactStatus('sending');
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contactForm.name, email: contactForm.email, message: contactForm.message }),
      });
      setContactStatus('sent');
      setContactForm({ name: '', email: '', message: '' });
    } catch {
      setContactStatus('error');
    }
  };

  return (
    <div className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-slate-900">
        <div className="container w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-24 lg:py-0 min-h-screen">
            {/* Left */}
            <div>
              <p className="text-[#EF6461] uppercase tracking-widest text-xs mb-6 font-semibold">
                {hero.tagline || 'GET EVERY SINGLE SOLUTIONS'}
              </p>
              <h1 className="section-title text-left mb-8 leading-tight">
                {hero.title?.split('\n').map((line: string, i: number) => (
                  <React.Fragment key={i}>
                    {i === 0 ? line : <span className="text-gray-900 dark:text-gray-100">{line}</span>}
                    {i === 0 && <br />}
                  </React.Fragment>
                )) || (<>I'm Full Stack Developer<br /><span className="text-gray-900 dark:text-gray-100">Harshal Patil</span></>)}
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-10 max-w-xl">
                {hero.description || 'Passionate about building scalable web applications and optimizing user experiences. Skilled in MERN stack, backend development, and real-time collaboration tools.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={hero.primaryButtonLink || '/projects'} className="btn-primary">
                  {hero.primaryButtonText || 'View Work'}
                </Link>
                <button onClick={() => setIsResumeModalOpen(true)} className="btn-secondary">
                  Resume
                </button>
              </div>
              <div className="flex items-center gap-3 mt-16 text-gray-400 dark:text-gray-500">
                <div className="w-10 h-px bg-gray-300 dark:bg-gray-600" />
                <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
              </div>
            </div>
            {/* Right: 3D Rubik's Cube */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="absolute w-80 h-80 bg-[#EF6461]/5 rounded-full blur-3xl opacity-80" />
              <RubiksCube />
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      <section className="py-32 bg-white dark:bg-slate-900">
        <div className="container">
          <Fade>
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="section-title text-left mb-8">
                  {about.title?.split('\n').map((line: string, i: number) => (
                    <React.Fragment key={i}>{line}{i < (about.title?.split('\n').length - 1) && <br />}</React.Fragment>
                  )) || (<>Designing With Passion While<br />Exploring The World.</>)}
                </h2>
                <div className="space-y-5 text-gray-500 dark:text-gray-400 leading-relaxed">
                  <p>{about.description1 || 'Full Stack Developer with expertise in MERN stack, backend development, and real-time collaboration tools.'}</p>
                  <p>{about.description2 || 'With a strong foundation in data structures, algorithms, and system design, I approach every project with a problem-solving mindset.'}</p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-2xl font-normal mb-4">
                  {about.contactTitle?.split('\n').map((line: string, i: number) => (
                    <React.Fragment key={i}>{line}{i < (about.contactTitle?.split('\n').length - 1) && <br />}</React.Fragment>
                  )) || (<>Any Type Of Query<br />& Discussion.</>)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{about.contactSubtitle || 'Lets talk with me'}</p>
                <a href={`mailto:${about.email || 'harshalp0602@gmail.com'}`}
                  className="text-xl font-medium text-gray-900 dark:text-gray-100 hover:text-[#EF6461] transition-colors inline-flex items-center gap-2 group">
                  {about.email || 'harshalp0602@gmail.com'}
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────────────────────────────── */}
      <section id="skills" className="py-24 bg-gray-50 dark:bg-slate-800/20 relative" style={{
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.08) 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
      }}>
        <div className="container">
          <Fade>
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-[#EF6461] font-semibold mb-3 block">What I Know</span>
              <h2 className="text-4xl font-normal text-gray-900 dark:text-gray-100">Skills</h2>
              <div className="w-10 h-0.5 bg-[#EF6461] mx-auto mt-4" />
            </div>
          </Fade>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {skills?.data && Object.entries(skills.data).map(([category, categorySkills]: [string, any], idx) => (
              <Fade key={category} delay={idx * 80}>
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{categoryMeta[category]?.icon || '🔹'}</span>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {category === 'database' ? 'Database' : category === 'languages' ? 'Languages' : category === 'frameworks' ? 'Frameworks' : category === 'tools' ? 'Tools' : category === 'courses' ? 'Courses' : category.charAt(0).toUpperCase() + category.slice(1)}
                      <span className="text-[#EF6461]">.</span>
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(categorySkills as any[]).map((skill: any) => (
                      <span key={skill._id}
                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-[#EF6461] hover:border-[#EF6461] hover:text-white transition-all duration-200 cursor-default font-medium">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────────────────────────────── */}
      <section id="projects" className="py-28 bg-white dark:bg-slate-900">
        <div className="container">
          <Fade>
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-[#EF6461] font-semibold mb-3 block">Portfolio</span>
              <h2 className="text-4xl font-normal text-gray-900 dark:text-gray-100">Featured Projects</h2>
              <div className="w-10 h-0.5 bg-[#EF6461] mx-auto mt-4" />
            </div>
          </Fade>
          <div className="text-center mb-8">
            <Link to="/projects" className="text-sm text-gray-400 hover:text-[#EF6461] transition-colors inline-flex items-center gap-1 group">
              View All <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {featuredProjects.length > 0 ? featuredProjects.map((project: any, idx: number) => (
              <Fade key={project._id} delay={idx * 100}>
                <div className="group rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl bg-white dark:bg-slate-800 hover:-translate-y-1.5 transition-all duration-300">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img src={project.imageUrl} alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-40 dark:opacity-30">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex gap-2">
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            className="px-3 py-1.5 bg-[#EF6461] text-white text-xs rounded-lg font-medium hover:bg-[#ff8a87] transition-colors">Live Demo</a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-lg font-medium border border-white/30 hover:bg-white/30 transition-colors">GitHub</a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1.5 group-hover:text-[#EF6461] transition-colors">{project.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{project.description}</p>
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.technologies.slice(0, 4).map((tech: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Fade>
            )) : (
              <p className="col-span-3 text-center text-gray-400 py-16">No featured projects yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ───────────────────────────────────────────────────── */}
      <section id="experience" className="py-24 dark:bg-slate-800/20 relative" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(0,0,0,0.025) 59px, rgba(0,0,0,0.025) 60px)',
      }}>
        <div className="container">
          <Fade>
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-[#EF6461] font-semibold mb-3 block">Career</span>
              <h2 className="text-4xl font-normal text-gray-900 dark:text-gray-100">Experience</h2>
              <div className="w-10 h-0.5 bg-[#EF6461] mx-auto mt-4" />
            </div>
          </Fade>
          <div className="max-w-3xl mx-auto">
            {experienceList.length > 0 ? experienceList.map((exp: any, index: number) => (
              <Fade key={exp._id} delay={index * 100}>
                <div className="relative flex gap-6 mb-10 last:mb-0">
                  <div className="flex flex-col items-center flex-shrink-0 pt-2">
                    <div className="w-3 h-3 rounded-full bg-[#EF6461] shadow-lg shadow-[#EF6461]/40 z-10" />
                    {index < experienceList.length - 1 && (
                      <div className="w-px flex-1 mt-3" style={{ background: 'linear-gradient(to bottom, rgba(239,100,97,0.5), transparent)', minHeight: '60px' }} />
                    )}
                  </div>
                  <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-[#EF6461]/20 transition-all duration-300 group">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#EF6461] transition-colors">{exp.position}</h3>
                        <p className="text-[#EF6461] font-medium text-sm mt-0.5">{exp.company}</p>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 bg-[#EF6461]/10 text-[#EF6461] rounded-full whitespace-nowrap">{exp.period}</span>
                    </div>
                    {exp.description && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">{exp.description}</p>
                    )}
                    {exp.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.techStack.map((tech: string, i: number) => (
                          <span key={i} className="text-xs px-2.5 py-1 border border-[#EF6461]/30 text-[#EF6461] rounded-lg hover:bg-[#EF6461] hover:text-white transition-colors cursor-default">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Fade>
            )) : (
              <p className="text-center text-gray-400 py-16">No experience added yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ────────────────────────────────────────────────────── */}
      <section id="education" className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="container">
          <Fade>
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-[#EF6461] font-semibold mb-3 block">Academic</span>
              <h2 className="text-4xl font-normal text-gray-900 dark:text-gray-100">Education</h2>
              <div className="w-10 h-0.5 bg-[#EF6461] mx-auto mt-4" />
            </div>
          </Fade>
          <div className="max-w-3xl mx-auto space-y-5">
            {educationList.length > 0 ? educationList.map((edu: any, index: number) => (
              <Fade key={edu._id} delay={index * 100}>
                <div className="group flex gap-5 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-[#EF6461]/20 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#EF6461]/10 flex items-center justify-center group-hover:bg-[#EF6461] transition-all duration-300">
                      <span className="text-sm font-bold text-[#EF6461] group-hover:text-white transition-colors">
                        {edu.period?.split('-')[0]?.trim() || '—'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#EF6461] transition-colors">{edu.degree}</h3>
                      <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-full">{edu.period}</span>
                    </div>
                    <p className="text-[#EF6461] text-sm font-medium">{edu.institution}</p>
                    {edu.description && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                </div>
              </Fade>
            )) : (
              <p className="text-center text-gray-400 py-16">No education added yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-gray-50 dark:bg-slate-800/30">
        <div className="container">
          <Fade>
            <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#EF6461] font-semibold mb-3 block">Get In Touch</span>
                <h2 className="section-title text-left mb-4">If Not Now, When?<br />Let's Work Together!</h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-12">Have a project in mind or just want to chat? I'm always open to discussing new projects, creative ideas, or opportunities.</p>
                <div className="space-y-4">
                  {[
                    { icon: <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />, label: settings.address || 'Location', href: undefined },
                    { icon: <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />, label: settings.phone || 'Phone', href: settings.phone ? `tel:${settings.phone}` : undefined },
                    { icon: <><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></>, label: settings.email || 'Email', href: settings.email ? `mailto:${settings.email}` : undefined },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <span className="w-9 h-9 rounded-xl bg-[#EF6461]/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-[#EF6461]" fill="currentColor" viewBox="0 0 20 20">{item.icon}</svg>
                      </span>
                      {item.href ? (
                        <a href={item.href} className="hover:text-[#EF6461] transition-colors">{item.label}</a>
                      ) : (
                        <span>{item.label}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <input type="text" placeholder="Full Name" value={contactForm.name}
                  onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-[#EF6461] outline-none transition-colors placeholder:text-gray-400 text-gray-900 dark:text-gray-100" />
                <input type="email" placeholder="Email Address" value={contactForm.email}
                  onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-[#EF6461] outline-none transition-colors placeholder:text-gray-400 text-gray-900 dark:text-gray-100" />
                <textarea rows={5} placeholder="Your Message" value={contactForm.message}
                  onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-[#EF6461] outline-none transition-colors placeholder:text-gray-400 resize-none text-gray-900 dark:text-gray-100" />
                {contactStatus === 'sent' && <p className="text-green-500 text-sm">✓ Message sent successfully!</p>}
                {contactStatus === 'error' && <p className="text-red-400 text-sm">Failed to send. Please try again.</p>}
                <button type="submit" disabled={contactStatus === 'sending'}
                  className="w-full bg-[#EF6461] hover:bg-[#ff8a87] disabled:opacity-60 text-white font-medium py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#EF6461]/25 hover:-translate-y-0.5">
                  {contactStatus === 'sending' ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            </div>
          </Fade>
        </div>
      </section>

      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </div>
  );
};

export default Home;






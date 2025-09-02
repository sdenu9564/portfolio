import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load sections for performance
// const Hero = lazy(() => import('./sections/Hero'));
// const About = lazy(() => import('./sections/About'));
// const Skills = lazy(() => import('./sections/Skills'));
// const Experience = lazy(() => import('./sections/Experience'));
// const Projects = lazy(() => import('./sections/Projects'));
// const Education = lazy(() => import('./sections/Education'));
// const Contact = lazy(() => import('./sections/Contact'));

// Components
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['About', 'Skills', 'Experience', 'Projects', 'Education', 'Contact'];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="nav-container">
        <motion.div
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>SM</span>
        </motion.div>

        <div className={`nav-menu ${isMenuOpen ? 'nav-menu-active' : ''}`}>
          {navItems.map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item);
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          ))}
          <ThemeToggle />
        </div>

        <div
          className={`nav-toggle ${isMenuOpen ? 'nav-toggle-active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </motion.nav>
  );
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <motion.button
      className="theme-toggle"
      onClick={() => setIsDark(!isDark)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? '☀️' : '🌙'}
      </motion.div>
    </motion.button>
  );
};

const SectionTitle = ({ title, subtitle }) => (
  <motion.div
    className="section-title"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <h2>{title}</h2>
    {subtitle && <p>{subtitle}</p>}
  </motion.div>
);

const SkillBadge = ({ skill, delay = 0 }) => (
  <motion.div
    className="skill-badge"
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.05, y: -2 }}
  >
    {skill}
  </motion.div>
);

const ProjectCard = ({ project, index }) => (
  <motion.div
    className="project-card"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.2, duration: 0.6 }}
    whileHover={{ y: -10 }}
  >
    <div className="project-image">
      <img 
        src={`/images/project-${index + 1}.jpg`} 
        alt={project.title}
        loading="lazy"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="project-placeholder" style={{ display: 'none' }}>
        <span>📁</span>
        <p>Project Image</p>
      </div>
    </div>
    <div className="project-content">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="project-tech">
        {project.technologies.map((tech, i) => (
          <span key={i} className="tech-tag">{tech}</span>
        ))}
      </div>
      {/* <div className="project-links">
        {project.github && (
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            GitHub
          </motion.a>
        )}
        {project.demo && (
          <motion.a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Live Demo
          </motion.a>
        )}
      </div> */}
    </div>
  </motion.div>
);

const TimelineItem = ({ item, index, isLeft }) => (
  <motion.div
    className={`timeline-item ${isLeft ? 'timeline-left' : 'timeline-right'}`}
    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.2, duration: 0.6 }}
  >
    <div className="timeline-content">
      <div className="timeline-date">{item.date}</div>
      <h3>{item.position || item.degree}</h3>
      <h4>{item.company || item.institution}</h4>
      <p>{item.description}</p>
      {item.achievements && (
        <ul>
          {item.achievements.map((achievement, i) => (
            <li key={i}>{achievement}</li>
          ))}
        </ul>
      )}
    </div>
    <div className="timeline-marker"></div>
  </motion.div>
);

const SocialIcon = ({ href, icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="social-icon"
    whileHover={{ scale: 1.2, y: -3 }}
    whileTap={{ scale: 0.9 }}
    aria-label={label}
  >
    {icon}
  </motion.a>
);

// Data
const skills = {
  languages: ['JavaScript', 'TypeScript', 'C/C++'],
  frontend: ['React.js', 'Next.js', 'HTML', 'CSS'],
  backend: ['Node.js', 'Express.js', 'Nest.js'],
  databases: ['MongoDB', 'MySQL', 'PostgreSQL'],
  tools: ['Git', 'GitHub', 'Docker', 'Socket.io'],
  cloud: ['AWS EC2', 'AWS S3', 'CloudFront', 'ECR']
};

const projects = [
  {
    title: 'Dawdle Partners',
    description: 'B2B platform for users to register, discover business solutions, and book meetings with prospective companies.',
    technologies: ['Node.js', 'Express.js', 'MySQL', 'Sequelize', 'JWT', '2FA', 'SendGrid', 'AWS'],
    github: '#',
    demo: '#'
  },
  {
    title: 'Dawdle Insights',
    description: 'Video platform similar to YouTube and Reels, delivering business solutions in video format.',
    technologies: ['Node.js', 'Express.js', 'MySQL', 'AWS', 'JWT', 'OAuth'],
    github: '#',
    demo: '#'
  },
  {
    title: 'ACC Cement Projects',
    description: 'Comprehensive platform for managing and tracking cement bags with real-time updates.',
    technologies: ['Express.js', 'Sequelize', 'Socket.io', 'Real-time'],
    github: '#',
    demo: '#'
  },
  {
    title: 'Zomato Clone',
    description: 'Fully functional and responsive food delivery platform clone.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    github: '#',
    demo: '#'
  }
];

const experience = [
  {
    position: 'Fullstack Engineer',
    company: 'OneMDM',
    date: 'February 2025',
    location: 'Hyderabad',
    description: 'Working on microservice architecture using Node.js, NestJS, TypeScript, REST APIs, TypeORM, and PostgreSQL within an Nx monorepo setup.',
    achievements: [
      'Developed runner application to store, manage, and maintain client data efficiently',
      'Containerized applications with Docker for scalable deployment'
    ]
  },
  {
    position: 'Technical Team Member',
    company: 'Dawdle',
    date: 'Feb 2024 - Jan 2025',
    location: 'Bangalore',
    description: 'Developed multiple B2B platforms and video streaming solutions.',
    achievements: [
      'Built robust backend using Node.js, Express.js, and MySQL with secure authentication',
      'Deployed applications on AWS ensuring scalability and high performance',
      'Integrated OAuth (LinkedIn, Google) for seamless user authentication'
    ]
  },
  {
    position: 'Full Stack Developer',
    company: 'Frinks Digital Technologies',
    date: 'December 2022 – January 2024',
    location: 'Bangalore',
    description: 'Developed company website and admin panel management interface.',
    achievements: [
      'Enhanced company online presence using Next.js',
      'Created admin panel for efficient product and user account management',
      'Implemented real-time tracking system using Socket.io'
    ]
  },
  {
    position: 'Software Developer',
    company: 'FlexibleIR',
    date: 'Jan - Dec 2022',
    location: 'Bangalore',
    description: 'Enhanced SaaS platform with new features and security improvements.',
    achievements: [
      'Integrated multi-factor authentication using Google Authenticator',
      'Developed Confluence API integration for documentation management',
      'Resolved bugs and improved platform functionality'
    ]
  }
];

const education = [
  {
    degree: 'B.Tech in Electronics And Communication Engineering',
    institution: 'Bengal College Of Engineering And Technology',
    date: 'August 2017 – July 2021',
    description: 'CGPA: 8.14'
  }
];

// Sections
const HeroSection = () => (
  <section id="hero" className="hero">
    <div className="hero-container">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <img 
            src="/images/profile.jpg" 
            alt="Sourav Manna"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="profile-placeholder" style={{ display: 'none' }}>
            <span>👨‍💻</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Hi, I'm <span className="highlight">Sourav Manna</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          FullStack Developer || MERN STACK Developer || Backend Developer
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
          >
            Get In Touch
          </motion.button>
          <motion.button
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
          >
            View My Work
          </motion.button>
        </motion.div>

        <motion.div
          className="hero-social"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <SocialIcon href="mailto:smanna1004@gmail.com" icon="✉️" label="Email" />
          <SocialIcon href="tel:+918617053607" icon="📱" label="Phone" />
          <SocialIcon href="https://linkedin.com/in/sourav-manna" icon="💼" label="LinkedIn" />
          <SocialIcon href="https://github.com/sdenu9564" icon="🐙" label="GitHub" />
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const AboutSection = () => (
  <section id="about" className="about">
    <div className="container">
      <SectionTitle 
        title="About Me" 
        subtitle="Passionate full-stack developer with expertise in modern web technologies"
      />
      <motion.div
        className="about-content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p>
          I'm a dedicated full-stack developer with over 4 years of experience in building 
          scalable web applications. My expertise spans across the MERN stack, with a strong 
          focus on creating robust backend systems and intuitive user interfaces.
        </p>
        <p>
          Throughout my career, I've worked with various technologies including Node.js, 
          React.js, MongoDB, PostgreSQL, and AWS services. I'm passionate about writing 
          clean, efficient code and staying up-to-date with the latest industry trends.
        </p>
        <div className="about-stats">
          <motion.div 
            className="stat"
            whileHover={{ scale: 1.05 }}
          >
            <span className="stat-number">4+</span>
            <span className="stat-label">Years Experience</span>
          </motion.div>
          <motion.div 
            className="stat"
            whileHover={{ scale: 1.05 }}
          >
            <span className="stat-number">15+</span>
            <span className="stat-label">Projects Completed</span>
          </motion.div>
          <motion.div 
            className="stat"
            whileHover={{ scale: 1.05 }}
          >
            <span className="stat-number">5+</span>
            <span className="stat-label">Companies Worked</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

const SkillsSection = () => (
  <section id="skills" className="skills">
    <div className="container">
      <SectionTitle 
        title="Skills & Technologies" 
        subtitle="The tools and technologies I work with"
      />
      <div className="skills-grid">
        {Object.entries(skills).map(([category, skillList], categoryIndex) => (
          <motion.div
            key={category}
            className="skill-category"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
          >
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <div className="skills-list">
              {skillList.map((skill, index) => (
                <SkillBadge 
                  key={skill} 
                  skill={skill} 
                  delay={(categoryIndex * 0.1) + (index * 0.05)}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ExperienceSection = () => (
  <section id="experience" className="experience">
    <div className="container">
      <SectionTitle 
        title="Work Experience" 
        subtitle="My professional journey and key contributions"
      />
      <div className="timeline">
        {experience.map((item, index) => (
          <TimelineItem 
            key={index} 
            item={item} 
            index={index} 
            isLeft={index % 2 === 0}
          />
        ))}
      </div>
    </div>
  </section>
);

const ProjectsSection = () => (
  <section id="projects" className="projects">
    <div className="container">
      <SectionTitle 
        title="Featured Projects" 
        subtitle="Some of my recent work and contributions"
      />
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </div>
  </section>
);

const EducationSection = () => (
  <section id="education" className="education">
    <div className="container">
      <SectionTitle 
        title="Education" 
        subtitle="My academic background"
      />
      <div className="timeline">
        {education.map((item, index) => (
          <TimelineItem 
            key={index} 
            item={item} 
            index={index} 
            isLeft={true}
          />
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <SectionTitle 
          title="Get In Touch" 
          subtitle="Let's discuss your next project"
        />
        <div className="contact-content">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>Let's Connect</h3>
            <p>
              I'm always interested in hearing about new opportunities and projects. 
              Whether you're looking for a developer, have a question, or just want to connect.
            </p>
            <div className="contact-details">
              <motion.div 
                className="contact-item"
                whileHover={{ x: 5 }}
              >
                <span className="contact-icon">✉️</span>
                <span>smanna1004@gmail.com</span>
              </motion.div>
              <motion.div 
                className="contact-item"
                whileHover={{ x: 5 }}
              >
                <span className="contact-icon">📱</span>
                <span>(+91) 8617053607</span>
              </motion.div>
              <motion.div 
                className="contact-item"
                whileHover={{ x: 5 }}
              >
                <span className="contact-icon">📍</span>
                <span>Arambagh, WB, India</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <motion.button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
            {submitStatus && (
              <motion.div
                className={`submit-status ${submitStatus}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {submitStatus === 'success' ? 'Message sent successfully!' : 'Error sending message.'}
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <motion.div
        className="footer-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="footer-info">
          <h3>Sourav Manna</h3>
          <p>Full Stack Developer passionate about creating amazing web experiences</p>
        </div>
        <div className="footer-social">
          <SocialIcon href="mailto:smanna1004@gmail.com" icon="✉️" label="Email" />
          <SocialIcon href="https://linkedin.com/in/sourav-manna" icon="💼" label="LinkedIn" />
          <SocialIcon href="https://github.com/sdenu9564" icon="🐙" label="GitHub" />
        </div>
      </motion.div>
      <motion.div
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <p>&copy; 2025 Sourav Manna. All rights reserved.</p>
      </motion.div>
    </div>
  </footer>
);

// Main App Component
const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const LoadingScreen = () => (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="loading-content"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span>SM</span>
      </motion.div>
    </motion.div>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      <Navbar />
      <main>
        <Suspense fallback={<div className="section-loading">Loading...</div>}>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ExperienceSection />
          <ProjectsSection />
          <EducationSection />
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;

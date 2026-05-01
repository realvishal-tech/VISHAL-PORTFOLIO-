export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export const DEFAULT_ABOUT = {
  name: 'Vishal',
  title: 'BCA Student & Future Full Stack Developer',
  bio: "Hi! I'm Vishal, a passionate BCA student with a love for web development and technology. I enjoy building clean, user-friendly interfaces and am constantly learning new frameworks and tools to sharpen my skills. My goal is to become a proficient Full Stack Developer and create impactful digital experiences.",
  bio2: "When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and designing UI concepts. I believe in continuous growth and always strive to improve my craft every single day.",
  highlights: [
    { icon: 'FaLightbulb', label: 'Quick Learner', desc: 'Adapts to new technologies rapidly' },
    { icon: 'FaHeart', label: 'Passionate', desc: 'Driven by a love for coding' },
    { icon: 'FaRocket', label: 'Growth Mindset', desc: 'Always pushing boundaries' },
  ],
  stats: [
    { value: '10+', label: 'Projects' },
    { value: '5+', label: 'Technologies' },
    { value: '1+', label: 'Year Experience' },
  ],
  profilePhoto: '',
};

export const DEFAULT_SKILLS = [
  { name: 'HTML', percentage: 90, category: 'Frontend', icon: 'FaHtml5', order: 1 },
  { name: 'CSS', percentage: 85, category: 'Frontend', icon: 'FaCss3Alt', order: 2 },
  { name: 'JavaScript', percentage: 80, category: 'Frontend', icon: 'FaJs', order: 3 },
  { name: 'React', percentage: 75, category: 'Frontend', icon: 'FaReact', order: 4 },
  { name: 'Tailwind CSS', percentage: 80, category: 'Frontend', icon: 'SiTailwindcss', order: 5 },
  { name: 'Firebase', percentage: 70, category: 'Backend', icon: 'SiFirebase', order: 6 },
  { name: 'Node.js', percentage: 50, category: 'Backend', icon: 'FaNodeJs', order: 7 },
  { name: 'Git', percentage: 75, category: 'Tools', icon: 'FaGitAlt', order: 8 },
  { name: 'GitHub', percentage: 80, category: 'Tools', icon: 'FaGithub', order: 9 },
  { name: 'VS Code', percentage: 90, category: 'Tools', icon: 'SiVisualstudiocode', order: 10 },
  { name: 'Figma', percentage: 60, category: 'Tools', icon: 'FaFigma', order: 11 },
];

export const DEFAULT_PROJECTS = [
  {
    id: '1',
    title: 'Portfolio Website',
    description: 'A modern portfolio website built with React and Tailwind CSS, featuring dark mode, smooth animations, and a CMS-like admin panel.',
    image: '',
    liveUrl: '#',
    githubUrl: '#',
    tags: ['React', 'Tailwind', 'Firebase'],
    category: 'Web',
    featured: true,
  },
  {
    id: '2',
    title: 'Todo App',
    description: 'A feature-rich todo application with local storage, priority levels, due dates, and category filtering.',
    image: '',
    liveUrl: '#',
    githubUrl: '#',
    tags: ['JavaScript', 'HTML', 'CSS'],
    category: 'Web',
    featured: false,
  },
  {
    id: '3',
    title: 'Weather App',
    description: 'Real-time weather data using OpenWeather API with beautiful UI, location search, and 5-day forecast.',
    image: '',
    liveUrl: '#',
    githubUrl: '#',
    tags: ['React', 'API', 'CSS'],
    category: 'Web',
    featured: false,
  },
];

export const DEFAULT_SOCIAL_LINKS = {
  github: 'https://github.com/realvishal-tech',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  email: '10717vishal@gmail.com',
};

export const DEFAULT_SERVICES = [
  {
    icon: 'FaLaptopCode',
    title: 'Web Development',
    description: 'Building modern, responsive websites and web applications using React, Tailwind CSS, and the latest web technologies.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: 'FaPalette',
    title: 'UI/UX Design',
    description: 'Creating intuitive, visually stunning user interfaces with a focus on user experience and design principles.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: 'SiFirebase',
    title: 'Firebase Integration',
    description: 'Integrating Firebase for real-time databases, authentication, hosting, and cloud functions into your projects.',
    gradient: 'from-orange-500 to-yellow-500',
  },
];

export const TYPING_STRINGS = [
  'BCA Student',
  'Future Full Stack Developer',
  'Web Developer',
  'UI/UX Enthusiast',
];

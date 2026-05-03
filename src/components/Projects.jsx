import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    title: 'Portfolio Website',
    description: 'A cinematic 3D portfolio built with React, Three.js, and GSAP — the site you\'re currently viewing.',
    tags: ['React', 'Three.js', 'GSAP', 'Tailwind'],
    accent: '#6c63ff',
  },
  {
    title: 'Coming Soon',
    description: 'More projects are on the way. Stay tuned for exciting builds and collaborations.',
    tags: ['Next.js', 'TypeScript', 'Node.js'],
    accent: '#43e8d8',
  },
  {
    title: 'Open Source',
    description: 'Contributing to the developer community with open-source tools and libraries.',
    tags: ['Open Source', 'GitHub', 'Community'],
    accent: '#ff6584',
  },
];

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: index * 0.15,
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === cardRef.current) st.kill();
      });
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="group relative rounded-2xl p-8 transition-all duration-500 cursor-target overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(108,99,255,0.15)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 h-[2px] transition-all duration-500"
        style={{
          width: isHovered ? '100%' : '0%',
          background: project.accent,
          boxShadow: isHovered ? `0 0 20px ${project.accent}` : 'none',
        }}
      />

      {/* Number */}
      <span
        className="font-syne font-extrabold text-[80px] leading-none absolute top-4 right-6 opacity-5 transition-opacity duration-500 group-hover:opacity-10"
        style={{ color: project.accent }}
      >
        0{index + 1}
      </span>

      <h3 className="font-syne font-bold text-2xl text-white mb-3 relative z-10">{project.title}</h3>
      <p className="text-[15px] text-[#5a5a70] mb-6 leading-relaxed relative z-10 max-w-md">{project.description}</p>

      <div className="flex flex-wrap gap-2 relative z-10">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-space text-xs px-3 py-1 rounded-full"
            style={{
              background: `${project.accent}15`,
              color: project.accent,
              border: `1px solid ${project.accent}30`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  const titleRef = useRef(null);

  useEffect(() => {
    const words = titleRef.current.querySelectorAll('.word');
    gsap.fromTo(
      words,
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === titleRef.current) st.kill();
      });
    };
  }, []);

  return (
    <section id="projects" className="relative py-32 px-6 md:px-16 bg-[#050508] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 ref={titleRef} className="font-syne font-extrabold text-[clamp(32px,5vw,52px)] text-white mb-16 flex gap-4">
          {'SELECTED WORK'.split(' ').map((w, i) => (
            <span key={i} className="word inline-block">
              {w}
            </span>
          ))}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

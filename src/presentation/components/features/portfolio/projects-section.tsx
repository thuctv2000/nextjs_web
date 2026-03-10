interface Project {
  title: string;
  description: string;
  tags: string[];
  icon: string;
  hasImage: boolean;
  imageHeight?: string;
  gradient?: string;
  hasLink: boolean;
}

const PROJECTS: Project[] = [
  {
    title: 'Huong Cao Nguyen Delivery',
    description:
      'A comprehensive logistics and delivery application featuring real-time tracking, optimized routing, and dispatcher management. Built to handle complex geographic data and reliable background location updates.',
    tags: ['GPS/Traccar', 'Google Maps SDK', 'Flutter', 'WebSocket'],
    icon: 'local_shipping',
    hasImage: true,
    imageHeight: 'h-48 sm:h-64',
    gradient: 'from-[#1a2f30] to-[#09090b]',
    hasLink: true,
  },
  {
    title: 'Workflow Space',
    description:
      'An enterprise-grade task management and collaboration platform. Engineered with strict adherence to Clean Architecture principles to ensure scalability and maintainability across large teams.',
    tags: ['Clean Architecture', 'BLoC/Cubit', 'REST API'],
    icon: 'account_tree',
    hasImage: true,
    imageHeight: 'h-48',
    gradient: 'from-[#111827] to-[#1e1b4b]',
    hasLink: true,
  },
  {
    title: 'Android Print Service',
    description:
      'A deep native Android utility integrating complex hardware communication protocols. Enables seamless printing across various industrial and commercial thermal printers via multiple connection types.',
    tags: ['Native Android (Kotlin)', 'BLE', 'NFC', 'USB OTG'],
    icon: 'print',
    hasImage: false,
    hasLink: false,
  },
  {
    title: 'High-Conversion E-Commerce',
    description:
      'A highly optimized mobile storefront focusing on performance and user experience. Implements complex state management for cart operations, variant selection, and seamless payment gateway integrations.',
    tags: ['Flutter', 'Stripe SDK', 'Firebase'],
    icon: 'shopping_cart_checkout',
    hasImage: true,
    imageHeight: 'h-56',
    gradient: 'from-[#1c1917] to-[#0f172a]',
    hasLink: true,
  },
  {
    title: 'Real-Time Social Platform',
    description:
      'A community-focused application featuring an infinite-scrolling feed, real-time messaging, and rich media sharing. Optimized for smooth 60fps scrolling even with heavy image payloads.',
    tags: ['Socket.io', 'Riverpod', 'GraphQL'],
    icon: 'forum',
    hasImage: false,
    hasLink: false,
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="glass-card flex flex-col overflow-hidden masonry-item">
      {project.hasImage && (
        <div className={`${project.imageHeight} w-full relative bg-surface-border`}>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-80`}
          />
          <div className="absolute inset-0 flex items-center justify-center text-primary/20">
            <span className="material-symbols-outlined text-6xl">{project.icon}</span>
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-4">
          {!project.hasImage && (
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">
                {project.icon}
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-primary">
                {project.title}
              </h3>
            </div>
          )}
          {project.hasImage && (
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-primary">
              {project.title}
            </h3>
          )}
          {project.hasLink && (
            <span className="text-text-muted hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">open_in_new</span>
            </span>
          )}
        </div>

        <p className="text-text-muted text-sm mb-6 leading-relaxed">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="tech-tag inline-flex items-center px-2.5 py-1 rounded-full text-xs font-[family-name:var(--font-mono)] font-medium bg-surface text-slate-300 border border-surface-border transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="w-full px-4 py-12 md:py-20 lg:px-10">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="mb-12 border-b border-surface-border pb-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
            Featured Work
          </h2>
          <p className="mt-3 text-text-muted max-w-2xl">
            A selection of production-grade mobile applications showcasing architectural
            depth, hardware integration, and high-performance UI implementations.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:masonry-grid gap-6">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

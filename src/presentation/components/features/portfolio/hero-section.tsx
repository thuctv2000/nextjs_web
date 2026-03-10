const CORE_SKILLS = ['Flutter', 'Dart', 'Clean Architecture', 'BLoC/Cubit', 'Provider', 'RESTful APIs'];
const NATIVE_SKILLS = ['Native Android', 'Kotlin / Java', 'BLE', 'NFC', 'Google Maps', 'WebSockets'];
const TOOL_SKILLS = ['CI/CD', 'Git', 'Firebase', 'Dio', 'GetIt', 'Hive'];

interface SkillGroupProps {
  title: string;
  skills: string[];
}

function SkillGroup({ title, skills }: SkillGroupProps) {
  return (
    <div className="mb-12 animate-portfolio-fade-in">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-6 text-text-primary border-b border-surface-border pb-4">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill}
            className="skill-pill glass-panel rounded-lg px-4 py-3 flex items-center justify-center text-sm font-[family-name:var(--font-mono)] cursor-default"
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="home" className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-24 pb-12 min-h-screen flex flex-col lg:flex-row gap-12 lg:gap-24">
      {/* Left: Sticky Hero */}
      <div className="lg:w-1/2 lg:sticky lg:top-32 lg:h-[calc(100vh-10rem)] flex flex-col justify-center animate-portfolio-fade-in">
        <div className="space-y-6">
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl lg:text-[64px] font-bold leading-tight tracking-tight text-text-primary">
            Tran Van Thuc
          </h1>

          <div className="h-8 font-[family-name:var(--font-mono)] text-primary text-lg md:text-xl">
            <div className="typewriter-text inline-block">
              Flutter Expert &amp; Software Architect
            </div>
          </div>

          <p className="text-text-muted text-base md:text-lg max-w-md leading-relaxed mt-4">
            Engineer specialized in high-performance mobile applications. Bridging
            cross-platform efficiency with native power.
          </p>

          <div className="flex items-center gap-3 mt-8 pt-6">
            <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 w-fit">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </div>
              <span className="text-sm font-medium text-text-primary">
                Available for new opportunities
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-text-muted">
            <span className="material-symbols-outlined text-lg">location_on</span>
            <span className="text-sm">Ho Chi Minh City, Vietnam</span>
          </div>

          <div className="mt-12 flex gap-4">
            <a
              href="#projects"
              className="bg-primary/10 text-primary border border-primary/30 px-6 py-3 rounded-lg font-[family-name:var(--font-display)] font-semibold hover:bg-primary hover:text-bg-dark transition-all duration-300 flex items-center gap-2"
            >
              View Projects{' '}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>

      {/* Right: Skills Matrix */}
      <div className="lg:w-1/2 pt-12 lg:pt-32 pb-24">
        <SkillGroup title="Core Competencies" skills={CORE_SKILLS} />
        <SkillGroup title="Native & Integrations" skills={NATIVE_SKILLS} />
        <SkillGroup title="Tools & Ecosystem" skills={TOOL_SKILLS} />
      </div>
    </section>
  );
}

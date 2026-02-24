import { useState, useRef, useEffect } from 'react';
import { FaCog, FaIndustry, FaCube, FaDollarSign, FaClock, FaCheckCircle, FaTools, FaCalendarAlt, FaChartLine, FaUsers, FaShieldAlt } from 'react-icons/fa';
import gsap from "gsap";

export default function WhyChooseSection() {
  const [activeTab, setActiveTab] = useState('prototyping');
  const [indicatorStyle, setIndicatorStyle] = useState<{ width?: number; left?: number }>({});
  const tabRefs = {
    project: useRef(null),
    series: useRef(null),
    prototyping: useRef(null)
  };
  const firstText = useRef<HTMLDivElement>(null);
  const secondText = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Marquee animation
    const marqueeAnimation = () => {
      if (firstText.current) {
        gsap.fromTo(
          firstText.current,
          { y: () => -(firstText.current?.scrollHeight || 0) / 2 },
          {
            y: 0,
            repeat: -1,
            duration: 150,
            ease: "linear",
          }
        );
      }

      if (secondText.current) {
        gsap.fromTo(
          secondText.current,
          { y: 0 },
          {
            y: () => -(secondText.current?.scrollHeight || 0) / 2,
            repeat: -1,
            duration: 150,
            ease: "linear",
          }
        );
      }
    };
    marqueeAnimation();

    const activeRef = tabRefs[activeTab as keyof typeof tabRefs].current as HTMLElement | null;
    if (activeRef) {
      setIndicatorStyle({
        width: activeRef.offsetWidth,
        left: activeRef.offsetLeft
      });
    }
  }, [activeTab]);

  const tabContent = {
    prototyping: {
      title: 'Gain insights into your production with',
      highlight: 'AI-driven analytics.',
      benefits: [
        {
          icon: <FaChartLine className="text-4xl" />,
          title: 'Project Health',
          description: 'Automatically analyze your DAW projects for missing plugins, samples, or corruption risks before you even open them.'
        },
        {
          icon: <FaClock className="text-4xl" />,
          title: 'Time Tracking',
          description: 'Visualize how much time you spend on mixing, arranging, or sound design. Optimize your workflow with data.'
        },
        {
          icon: <FaTools className="text-4xl" />,
          title: 'Stem Analysis',
          description: 'AI-powered stem checking to ensure your deliverables meet loudness and format standards for streaming platforms.'
        },
        {
          icon: <FaShieldAlt className="text-4xl" />,
          title: 'Plugin Usage',
          description: 'Track which plugins you use most often and identify unused heavy plugins to save CPU resources.'
        },
        {
          icon: <FaCheckCircle className="text-4xl" />,
          title: 'Best Practices',
          description: 'Receive automated suggestions for project organization, naming conventions, and backup strategies.'
        },
        {
          icon: <FaIndustry className="text-4xl" />,
          title: 'Format Compatibility',
          description: 'Ensure your project files are compatible across different OS versions and DAW updates.'
        }
      ],
      buttonText: 'View Analytics'
    },
    series: {
      title: 'Seamlessly work together with',
      highlight: 'real-time team capabilities.',
      subtitle: 'for bands, producers, and engineers.',
      benefits: [
        {
          icon: <FaUsers className="text-4xl" />,
          title: 'Role Management',
          description: 'Assign roles like "Producer", "Mixing Engineer", or "Musician" to control access to specific tracks or versions.'
        },
        {
          icon: <FaCheckCircle className="text-4xl" />,
          title: 'Conflict Resolution',
          description: 'Automatically detect and resolve conflicts when multiple people work on the same project file simultaneously.'
        },
        {
          icon: <FaClock className="text-4xl" />,
          title: 'Activity Feed',
          description: "See a real-time feed of who changed what, when, and why. Never lose track of a project's evolution."
        },
        {
          icon: <FaDollarSign className="text-4xl" />,
          title: 'Studio Management',
          description: 'Manage bookings, invoices, and client feedback directly within the collaboration platform.'
        },
        {
          icon: <FaShieldAlt className="text-4xl" />,
          title: 'Secure Sharing',
          description: 'Share project links with expiring access or password protection for external collaborators.'
        },
        {
          icon: <FaTools className="text-4xl" />,
          title: 'Comment Threads',
          description: 'Leave time-stamped comments on tracks and versions to give precise feedback to your team.'
        }
      ],
      buttonText: 'Start Collaborating'
    },
    project: {
      title: 'Never lose a creative spark with',
      highlight: 'incremental cloud versioning.',
      benefits: [
        {
          icon: <FaCube className="text-4xl" />,
          title: 'Infinite History',
          description: 'Every save is tracked. Go back to any point in time, from 5 minutes ago to 5 years ago.'
        },
        {
          icon: <FaShieldAlt className="text-4xl" />,
          title: 'Disaster Recovery',
          description: 'Cloud backups ensure your projects are safe from hard drive failures, theft, or fire.'
        },
        {
          icon: <FaClock className="text-4xl" />,
          title: 'Instant Rollback',
          description: 'Made a mistake? Revert to the previous version with a single click. compare versions side-by-side.'
        },
        {
          icon: <FaChartLine className="text-4xl" />,
          title: 'Storage Optimization',
          description: 'Smart deduplication ensures you only upload changed files, saving massive amounts of bandwidth and storage.'
        },
        {
          icon: <FaCheckCircle className="text-4xl" />,
          title: 'Meta Data',
          description: 'Tag versions with "Demo", "Mix 1", "Master", or custom tags to easily find key milestones.'
        },
        {
          icon: <FaTools className="text-4xl" />,
          title: 'DAW Agnostic',
          description: 'Works with Ableton Live, FL Studio, Logic Pro, Pro Tools, and any other DAW that uses files.'
        }
      ],
      buttonText: 'Start Versioning'
    }
  };

  const currentContent = tabContent[activeTab as keyof typeof tabContent];

  return (
    <section className="py-12 md:py-20 relative px-3 sm:px-5 md:px-10 rounded-[50px] bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
      {/* Left Marquee */}
      <div className="absolute left-0 top-0 h-full flex overflow-hidden z-0 opacity-30 md:opacity-100">
        <div ref={firstText} className="flex flex-col">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 md:gap-4 mb-2 md:mb-4">
              <span className="text-metal-shine text-2xl md:text-[60px] font-bold hover:scale-110 hover:py-2 transition-all duration-300" style={{ writingMode: 'vertical-rl', fontFamily: 'Unbounded, sans-serif' }}>
                PROJECTS
              </span>
              <span className="text-gray-400 text-xl md:text-3xl">•</span>
              <span className="text-metal-shine text-2xl md:text-[60px] font-bold hover:scale-110 hover:py-2 transition-all duration-300" style={{ writingMode: 'vertical-rl', fontFamily: 'Unbounded, sans-serif' }}>
                STEMS
              </span>
              <span className="text-gray-400 text-xl md:text-3xl">•</span>
              <span className="text-metal-shine text-2xl md:text-[60px] font-bold hover:scale-110 hover:py-2 transition-all duration-300" style={{ writingMode: 'vertical-rl', fontFamily: 'Unbounded, sans-serif' }}>
                BACKUP
              </span>
              <span className="text-gray-400 text-xl md:text-3xl">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Marquee */}
      <div className="absolute right-0 top-0 h-full flex overflow-hidden z-0 opacity-30 md:opacity-100">
        <div ref={secondText} className="flex flex-col">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 md:gap-4 mb-2 md:mb-4">
              <span className="text-metal-shine text-2xl md:text-[60px] font-bold hover:scale-110 hover:py-2 transition-all duration-300" style={{ writingMode: 'vertical-rl', fontFamily: 'Unbounded, sans-serif' }}>
                VERSIONING
              </span>
              <span className="text-gray-400 text-xl md:text-3xl">•</span>
              <span className="text-metal-shine text-2xl md:text-[60px] font-bold hover:scale-110 hover:py-2 transition-all duration-300" style={{ writingMode: 'vertical-rl', fontFamily: 'Unbounded, sans-serif' }}>
                COLLABORATE
              </span>
              <span className="text-gray-400 text-xl md:text-3xl">•</span>
              <span className="text-metal-shine text-2xl md:text-[60px] font-bold hover:scale-110 hover:py-2 transition-all duration-300" style={{ writingMode: 'vertical-rl', fontFamily: 'Unbounded, sans-serif' }}>
                ANALYZE
              </span>
              <span className="text-gray-400 text-xl md:text-3xl">•</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center text-white mb-8 md:mb-12 px-4">
          Why Choose Dawlogger?
          <div className="w-16 md:w-20 h-1 bg-[#00f2ff] mx-auto mt-3 md:mt-4"></div>
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-8 md:mb-16 px-2">
          <div className="relative inline-flex bg-white/10 rounded-full p-1 border border-white/5">
            {/* Sliding indicator */}
            <div
              className="absolute bg-[#00f2ff] rounded-full shadow-lg transition-all duration-300 ease-out"
              style={{
                width: indicatorStyle.width,
                left: indicatorStyle.left,
                top: '4px',
                bottom: '4px'
              }}
            />
            <button
              ref={tabRefs.project}
              onClick={() => setActiveTab('project')}
              className={`relative z-10 px-3 sm:px-6 md:px-8 py-2.5 md:py-3.5 rounded-full font-medium text-sm md:text-base transition-colors duration-300 flex items-center gap-2 ${activeTab === 'project'
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              <FaCube className="text-base lg:hidden" />
              <span className="hidden lg:inline">Versioning</span>
              <span className="lg:hidden text-xs">Vers</span>
            </button>
            <button
              ref={tabRefs.series}
              onClick={() => setActiveTab('series')}
              className={`relative z-10 px-3 sm:px-6 md:px-8 py-2.5 md:py-3.5 rounded-full font-semibold text-sm md:text-base transition-colors duration-300 flex items-center gap-2 ${activeTab === 'series'
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              <FaUsers className="text-base lg:hidden" />
              <span className="hidden lg:inline">Collaboration</span>
              <span className="lg:hidden text-xs">Collab</span>
            </button>
            <button
              ref={tabRefs.prototyping}
              onClick={() => setActiveTab('prototyping')}
              className={`relative z-10 px-3 sm:px-6 md:px-8 py-2.5 md:py-3.5 rounded-full font-semibold text-sm md:text-base transition-colors duration-300 flex items-center gap-2 ${activeTab === 'prototyping'
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              <FaChartLine className="text-base lg:hidden" />
              <span className="hidden lg:inline">AI Insights</span>
              <span className="lg:hidden text-xs">AI</span>
            </button>
          </div>
        </div>



        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-10 md:gap-5 mb-10 md:mb-16 cursor-pointer">
          {currentContent.benefits.map((benefit, index) => (
            <div
              key={index}
              className="md:bg-white/5 border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 md:w-10 md:h-10 bg-[#00d2ff]/10 rounded-full flex items-center justify-center text-[#00d2ff] mb-4 md:mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-lg md:text-lg font-medium text-white mb-3 md:mb-5">
                {benefit.title}
              </h3>
              <p className="text-gray-300 text-justify text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Fixed typo 'a' removed */}
        <div className="text-center px-4">
          <a href="/getquote">
            <button className=" py-3 md:py-4 bg-[#00d2ff] hover:bg-[#3a7bd5] text-white rounded-full text-base md:text-lg font-semibold transition-colors shadow-lg hover:shadow-xl px-8 sm:w-auto">
              Get Quote
            </button>
          </a>

        </div>
      </div>

      <style jsx>{`
        .text-metal-shine {
          background-image: linear-gradient(
            120deg,
           rgba(255,255,255,0.1) 0%,
           rgba(255,255,255,0.1) 100%
          );
          -webkit-text-fill-color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.3);
          transition: all 0.4s ease;
        }

        .text-metal-shine:hover {
          background-image: linear-gradient(
            120deg,
           #00d2ff 0%,
           #00d2ff 100%
          );
          -webkit-text-fill-color: #00d2ff;
          -webkit-text-stroke: 1px #00d2ff;
          filter: drop-shadow(0 0 10px rgba(0, 210, 255, 0.5));
        }
      `}</style>
    </section>
  );
}
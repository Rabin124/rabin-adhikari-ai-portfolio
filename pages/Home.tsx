import React, { useEffect, useState } from 'react';
import { Project, Technology } from '../types';
import * as StorageService from '../services/storage';
import { Github, Smartphone, ExternalLink, Code, Coffee, Heart, Globe, Layers, Cpu } from 'lucide-react';

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);

  useEffect(() => {
    setProjects(StorageService.getProjects());
    setTechnologies(StorageService.getTechnologies());
  }, []);

  const handleKhaltiPayment = () => {
    const config = {
      // Test Public Key from Khalti Docs
      publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
      productIdentity: "rabin_adhikari_donation_001",
      productName: "Rabin Adhikari Support",
      productUrl: window.location.href,
      eventHandler: {
        onSuccess(payload: any) {
          console.log(payload);
          alert(`Payment Successful! Token: ${payload.token}\nAmount: NPR ${payload.amount / 100}`);
          // In a real app, you would send this payload to your backend for verification
        },
        onError(error: any) {
          console.log(error);
          alert("Payment Failed. Please try again.");
        },
        onClose() {
          console.log('widget is closing');
        }
      },
      paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
    };

    // @ts-ignore
    const checkout = new window.KhaltiCheckout(config);
    // Minimum amount 1000 paisa (Rs 10)
    checkout.show({ amount: 10000 }); 
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 bg-white dark:bg-slate-900 transition-colors duration-300">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
           <div className="absolute inset-0 bg-gradient-to-br from-android-50 to-slate-100 dark:from-android-900/20 dark:to-slate-900 transition-colors duration-300"></div>
           <div className="absolute -top-40 -right-40 w-96 h-96 bg-android-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
           <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/50 dark:bg-android-900/30 text-android-600 dark:text-android-400 px-3 py-1 rounded-full border border-android-200 dark:border-android-900 mb-6 animate-fade-in backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-android-500 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider">Available for hire</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight animate-zoom-in">
            Building the Future <br /> of <span className="text-transparent bg-clip-text bg-gradient-to-r from-android-600 to-emerald-400 dark:from-android-500 dark:to-emerald-300">the Web</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Junior Web Developer specializing in React, modern web technologies, and crafting buttery smooth user experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <a href="#portfolio" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-8 py-4 rounded-full font-bold transition shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              View Work
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-full font-bold transition flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5">
              <Github className="w-5 h-5" />
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm mb-4">
                 <Cpu className="w-8 h-8 text-android-500" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Technical Arsenal</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                A comprehensive toolkit I use to bring creative ideas to life on the web.
              </p>
           </div>
           <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8">
              {technologies.map((tech, index) => (
                 <div 
                    key={tech.id} 
                    className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group animate-slide-up border border-slate-100 dark:border-slate-800" 
                    style={{ animationDelay: `${index * 0.05}s` }}
                 >
                    <i className={`${tech.icon} text-4xl group-hover:animate-bounce`}></i>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">{tech.name}</span>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="portfolio" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 mb-12 animate-slide-in-right">
            <div className="p-2 bg-android-100 dark:bg-android-900/50 rounded-lg">
               <Code className="text-android-600 dark:text-android-500 w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Projects</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className="group bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-android-500/50 dark:hover:border-android-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-android-500/10 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-android-600 dark:group-hover:text-android-400 transition-colors">{project.title}</h3>
                    <div className="flex space-x-2">
                      {project.playStoreUrl && (
                        <a href={project.playStoreUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-android-600 dark:hover:text-android-400 transition" title="Live Demo">
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition" title="Source Code">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-white dark:bg-slate-900 text-slate-700 dark:text-android-400 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
             <div className="text-center py-20 text-slate-500 dark:text-slate-400">
               <p>No projects display. Login to admin panel to add some.</p>
             </div>
          )}
        </div>
      </section>

      {/* Support / Donation Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center">
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Support My Work</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
            If you find my open-source projects or articles helpful, consider buying me a coffee! 
            Secure payments powered by Khalti.
          </p>
          
          <button 
            onClick={handleKhaltiPayment}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-[#5C2D91] font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 hover:bg-[#4A2475] hover:shadow-xl hover:-translate-y-1"
          >
            <Coffee className="w-5 h-5 mr-2" />
            Support with Khalti (Rs. 100)
            <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
              Test Mode
            </div>
          </button>
          
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            *This is in Test Mode. No real money will be deducted.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 py-12 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Rabin Adhikari. Built with React & Tailwind.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
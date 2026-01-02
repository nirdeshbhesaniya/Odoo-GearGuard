import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiSettings, FiActivity, FiCheckCircle, FiBarChart2, FiShield, FiUsers, 
  FiArrowRight, FiCpu, FiLayers, FiMenu, FiX, FiTwitter, FiFacebook, 
  FiLinkedin, FiInstagram, FiClipboard, FiTool 
} from 'react-icons/fi';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
                  <span className="text-xl">⚙️</span>
                </div>
                <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">
                  GearGuard
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">How it Works</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Testimonials</button>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors px-4 py-2">
                Log in
              </Link>
              <Link to="/register" className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5">
                Get Started
                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
              >
                {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg animate-fadeIn">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <button onClick={() => scrollToSection('features')} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">How it Works</button>
              <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">Testimonials</button>
              <div className="pt-4 flex flex-col gap-3">
                <Link to="/login" className="block w-full text-center px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 border border-gray-200 rounded-lg">Log in</Link>
                <Link to="/register" className="block w-full text-center px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Get Started</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 -z-10" />
        
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-sm mb-8 animate-fadeIn">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                New: AI-Powered Maintenance Predictions
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                Master your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  maintenance
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Streamline equipment tracking, automate workflows, and boost team productivity with the world's most intuitive maintenance management system.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  Start Free Trial
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-8 py-4 text-base font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
                  View Live Demo
                </Link>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-gray-400 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" /> No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" /> 14-day free trial
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 mt-16 lg:mt-0 relative">
              <div className="relative rounded-2xl bg-white/40 backdrop-blur-xl border border-white/50 p-4 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-20 blur-lg" />
                <div className="relative bg-white rounded-xl overflow-hidden shadow-inner border border-gray-100">
                  {/* Mock UI Header */}
                  <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center gap-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="h-2 w-32 bg-gray-200 rounded-full" />
                  </div>
                  
                  {/* Mock UI Content */}
                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="h-2 w-24 bg-gray-200 rounded-full mb-2" />
                        <div className="h-8 w-48 bg-gray-900 rounded-lg" />
                      </div>
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <FiActivity />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="h-2 w-16 bg-blue-200 rounded-full mb-2" />
                        <div className="h-6 w-12 bg-blue-600 rounded-lg" />
                      </div>
                      <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <div className="h-2 w-16 bg-purple-200 rounded-full mb-2" />
                        <div className="h-6 w-12 bg-purple-600 rounded-lg" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <FiSettings className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="h-2 w-32 bg-gray-200 rounded-full mb-2" />
                            <div className="h-2 w-20 bg-gray-100 rounded-full" />
                          </div>
                          <div className="h-6 w-16 bg-green-100 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase mb-3">Powerful Features</h2>
            <p className="text-4xl font-extrabold text-gray-900 mb-6">
              Everything you need to manage maintenance
            </p>
            <p className="text-xl text-gray-500">
              GearGuard provides a complete suite of tools to keep your equipment running smoothly and your team aligned.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Real-time Tracking',
                desc: 'Monitor equipment status and location in real-time. Never lose track of your valuable assets again.',
                icon: FiActivity,
                color: 'blue'
              },
              {
                title: 'Smart Workflows',
                desc: 'Automate maintenance requests and approvals. Streamline communication between teams.',
                icon: FiCpu,
                color: 'indigo'
              },
              {
                title: 'Advanced Analytics',
                desc: 'Gain insights into maintenance costs, downtime, and team performance with detailed reports.',
                icon: FiBarChart2,
                color: 'purple'
              },
              {
                title: 'Team Collaboration',
                desc: 'Assign tasks, leave comments, and keep everyone in the loop with built-in collaboration tools.',
                icon: FiUsers,
                color: 'pink'
              },
              {
                title: 'Preventive Maintenance',
                desc: 'Schedule recurring maintenance tasks and get notified before equipment breaks down.',
                icon: FiShield,
                color: 'green'
              },
              {
                title: 'Inventory Management',
                desc: 'Keep track of spare parts and inventory levels. Auto-reorder when stock gets low.',
                icon: FiLayers,
                color: 'orange'
              }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center text-${feature.color}-600 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase mb-3">Workflow</h2>
            <p className="text-4xl font-extrabold text-gray-900 mb-6">
              How GearGuard Works
            </p>
            <p className="text-xl text-gray-500">
              Get up and running in minutes. Our intuitive platform makes maintenance management a breeze.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Log a Request',
                desc: 'Anyone can submit a maintenance request via mobile or desktop in seconds.',
                icon: FiClipboard
              },
              {
                step: '02',
                title: 'Assign & Track',
                desc: 'Managers assign tasks to technicians. Track progress in real-time.',
                icon: FiTool
              },
              {
                step: '03',
                title: 'Resolve & Report',
                desc: 'Complete the job, log parts used, and generate automated reports.',
                icon: FiCheckCircle
              }
            ].map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-600 mb-8 relative z-10">
                  <item.icon className="w-10 h-10" />
                  <span className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-gray-50">
                    {item.step}
                  </span>
                </div>
                {idx !== 2 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-200 -z-0" />
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase mb-3">Testimonials</h2>
            <p className="text-4xl font-extrabold text-gray-900 mb-6">
              Trusted by Industry Leaders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "GearGuard has completely transformed how we handle maintenance. Downtime has been reduced by 40%.",
                author: "Sarah Johnson",
                role: "Operations Manager",
                company: "TechFlow Mfg"
              },
              {
                quote: "The best maintenance software we've used. Simple, powerful, and the mobile app is a game changer for our techs.",
                author: "Mike Chen",
                role: "Facility Director",
                company: "Global Logistics"
              },
              {
                quote: "Customer support is phenomenal. They helped us migrate all our data and get set up in less than a week.",
                author: "Emily Davis",
                role: "Maintenance Lead",
                company: "BuildRight Inc"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-20 -left-20" />
            <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl bottom-0 right-0" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h2 className="text-4xl font-extrabold text-white mb-8">
            Ready to optimize your workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of maintenance teams who trust GearGuard to keep their operations running smoothly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-blue-900 bg-white rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Get Started for Free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white border border-gray-600 rounded-xl hover:bg-gray-800 transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <span className="text-sm">⚙️</span>
                </div>
                <span className="text-xl font-bold text-gray-900">GearGuard</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Making maintenance management simple, smart, and efficient for teams of all sizes.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-blue-600">Features</button></li>
                <li><Link to="/pricing" className="hover:text-blue-600">Pricing</Link></li>
                <li><Link to="/api" className="hover:text-blue-600">API</Link></li>
                <li><Link to="/integrations" className="hover:text-blue-600">Integrations</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-blue-600">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-blue-600">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/privacy" className="hover:text-blue-600">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-blue-600">Terms</Link></li>
                <li><Link to="/security" className="hover:text-blue-600">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; 2024 GearGuard Inc. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <button className="text-gray-400 hover:text-blue-600 transition-colors">
                <FiFacebook className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-blue-400 transition-colors">
                <FiTwitter className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-blue-700 transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-pink-600 transition-colors">
                <FiInstagram className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

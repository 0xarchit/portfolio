'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, Send, Loader2 } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export const Contact = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telegram: '',
    message: '',
    company_not_required: '',
    startTime: Date.now()
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    let captchaToken = '';
    if (executeRecaptcha) {
      try {
        captchaToken = await executeRecaptcha('contact_form');
      } catch (e) {
        console.error('Captcha generation failed', e);
      }
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           ...formData,
           captchaToken,
           sessionStats: {
               ...JSON.parse(sessionStorage.getItem('user_session_stats') || '{}'),
               totalTime: Date.now() - formData.startTime
           }
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      setStatus('success');
      setFormData({ 
        name: '', 
        email: '', 
        telegram: '', 
        message: '', 
        company_not_required: '',
        startTime: Date.now() 
      });
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
                    <div className="space-y-6">
            <div className="h-full flex flex-col justify-center p-8 bg-[#112240] rounded-lg border border-[#233554] shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#CCD6F6]">
                Get In Touch
              </h2>
              <p className="text-[#8892B0] mb-8 text-lg leading-relaxed">
                I'm always open to new opportunities and interesting projects.
                Whether you have a question or just want to say hi, feel free to drop a message!
              </p>
              
              <div className="flex gap-4">
                {[
                  { icon: Github, href: "https://github.com/0xarchit", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/0xarchit/", label: "LinkedIn" },
                  { icon: Twitter, href: "https://x.com/0xarchit", label: "Twitter" },
                  { icon: Mail, href: "mailto:mail@0xarchit.is-a.dev", label: "Email" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    whileHover={{ y: -5 }}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-[#0a192f] text-[#CCD6F6] hover:text-[#64FFDA] border border-[#233554] hover:border-[#64FFDA] transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

                    <div className="p-8 bg-[#112240] rounded-lg border border-[#233554] shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                            <input 
                type="text" 
                name="company_not_required" 
                value={formData.company_not_required}
                onChange={(e) => setFormData(prev => ({ ...prev, company_not_required: e.target.value }))}
                tabIndex={-1} 
                autoComplete="off"
                className="hidden" 
              />
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#64FFDA] mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-md bg-[#0a192f] border border-[#233554] focus:border-[#64FFDA] focus:ring-1 focus:ring-[#64FFDA] outline-none transition-all text-[#CCD6F6] placeholder-[#8892B0]/50"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#64FFDA] mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-md bg-[#0a192f] border border-[#233554] focus:border-[#64FFDA] focus:ring-1 focus:ring-[#64FFDA] outline-none transition-all text-[#CCD6F6] placeholder-[#8892B0]/50"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="telegram" className="block text-sm font-medium text-[#64FFDA] mb-2">
                  Telegram ID <span className="text-[#8892B0] text-xs font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="telegram"
                  value={formData.telegram}
                  onChange={(e) => setFormData(prev => ({ ...prev, telegram: e.target.value }))}
                  className="w-full px-4 py-3 rounded-md bg-[#0a192f] border border-[#233554] focus:border-[#64FFDA] focus:ring-1 focus:ring-[#64FFDA] outline-none transition-all text-[#CCD6F6] placeholder-[#8892B0]/50"
                  placeholder="@username"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#64FFDA] mb-2">
                  Message 
                  <span className="text-xs font-normal text-[#8892B0] ml-2">({formData.message.length}/1000)</span>
                </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    maxLength={1000}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-md bg-[#0a192f] border border-[#233554] focus:border-[#64FFDA] focus:ring-1 focus:ring-[#64FFDA] outline-none transition-all text-[#CCD6F6] placeholder-[#8892B0]/50 resize-none"
                    placeholder="Your message..."
                  />
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`w-full py-4 px-6 rounded-md font-mono text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 border ${
                  status === 'success' 
                    ? 'bg-[#64FFDA]/10 text-[#64FFDA] border-[#64FFDA]' 
                    : 'bg-transparent text-[#64FFDA] border-[#64FFDA] hover:bg-[#64FFDA]/10'
                }`}
              >
                {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === 'success' && 'Message Sent!'}
                {status === 'error' && 'Failed - Try Again'}
                {status === 'idle' && (
                  <>
                    Send Message <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
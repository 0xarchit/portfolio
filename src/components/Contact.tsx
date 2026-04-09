'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, Send, Loader2, Sparkles } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import {
  appendSessionErrorCode,
  appendSessionEvent,
  getClientContext,
  readSessionStats,
} from '../utils/tracking';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
  const [submitPoint, setSubmitPoint] = useState<{ x: number; y: number } | null>(null);
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const startTimestamp = Date.now();
    appendSessionEvent(
      'formSubmitEvents',
      {
        event: 'start',
        timestampMs: startTimestamp,
        form: 'contact',
        submitPoint,
      },
      50
    );

    let captchaToken = '';
    if (executeRecaptcha) {
      try {
        captchaToken = await executeRecaptcha('contact_form');
      } catch (e) {
        console.error('Captcha generation failed', e);
        appendSessionErrorCode('CAPTCHA_TOKEN_GENERATION_FAILED', 'contact_form');
      }
    }

    try {
      const stats = readSessionStats();
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           ...formData,
           captchaToken,
           requestTimestampMs: Date.now(),
           submitPoint,
           clientContext: getClientContext(),
           sessionStats: {
               ...stats,
               totalTime: Date.now() - formData.startTime
           }
        })
      });

      if (!response.ok) {
        appendSessionErrorCode(`CONTACT_API_${response.status}`, 'contact_submit');
        appendSessionEvent(
          'formSubmitEvents',
          {
            event: 'error',
            timestampMs: Date.now(),
            form: 'contact',
            status: response.status,
          },
          50
        );
        throw new Error(`Failed to send message: ${response.status}`);
      }

      appendSessionEvent(
        'formSubmitEvents',
        {
          event: 'complete',
          timestampMs: Date.now(),
          form: 'contact',
          durationMs: Date.now() - startTimestamp,
        },
        50
      );

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
      appendSessionErrorCode('CONTACT_SUBMIT_FAILED', 'contact_submit');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      {/* Decorative backdrop */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#64FFDA]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#64FFDA]/10 border border-[#64FFDA]/20 text-[#64FFDA] text-xs font-medium mb-6">
             <Sparkles className="w-3 h-3" />
             <span>What's Next?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#CCD6F6]">
            Get In <span className="text-[#64FFDA]">Touch</span>
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="space-y-6 h-full flex flex-col justify-center p-8 md:p-12 bg-[#112240]/80 backdrop-blur-xl rounded-2xl border border-[#233554]/50 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#64FFDA]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h3 className="text-3xl font-bold mb-4 text-[#CCD6F6] relative z-10">
              Let's Talk
            </h3>
            <p className="text-[#8892B0] mb-8 text-lg leading-relaxed relative z-10">
              I'm always open to new opportunities and interesting projects.
              Whether you have a question or just want to say hi, feel free to drop a message!
            </p>
            
            <div className="flex flex-wrap gap-4 relative z-10 mt-auto">
              {[
                { icon: Github, href: "https://github.com/0xarchit", label: "GitHub" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/0xarchit/", label: "LinkedIn" },
                { icon: Twitter, href: "https://x.com/0xarchit", label: "Twitter" },
                { icon: Mail, href: "mailto:mail@0xarchit.is-a.dev", label: "Email" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  whileHover={{ y: -5, scale: 1.1 }}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-[#0a192f] text-[#CCD6F6] hover:text-[#0a192f] hover:bg-[#64FFDA] border border-[#233554] shadow-lg transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="p-8 md:p-12 bg-[#112240]/80 backdrop-blur-xl rounded-2xl border border-[#233554]/50 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                <label htmlFor="name" className="block text-sm font-medium text-[#64FFDA] mb-2 font-mono">01. Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-[#0a192f]/50 border border-[#233554] focus:border-[#64FFDA] focus:ring-1 focus:ring-[#64FFDA] outline-none transition-all text-[#CCD6F6] placeholder-[#8892B0]/30"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#64FFDA] mb-2 font-mono">02. Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-[#0a192f]/50 border border-[#233554] focus:border-[#64FFDA] focus:ring-1 focus:ring-[#64FFDA] outline-none transition-all text-[#CCD6F6] placeholder-[#8892B0]/30"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="telegram" className="block text-sm font-medium text-[#64FFDA] mb-2 font-mono">
                  03. Telegram ID <span className="text-[#8892B0] text-xs font-sans">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="telegram"
                  value={formData.telegram}
                  onChange={(e) => setFormData(prev => ({ ...prev, telegram: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-[#0a192f]/50 border border-[#233554] focus:border-[#64FFDA] focus:ring-1 focus:ring-[#64FFDA] outline-none transition-all text-[#CCD6F6] placeholder-[#8892B0]/30"
                  placeholder="@username"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#64FFDA] mb-2 font-mono">
                  04. Message 
                  <span className="text-xs font-sans text-[#8892B0] ml-2 font-normal">({formData.message.length}/1000)</span>
                </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    maxLength={1000}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-[#0a192f]/50 border border-[#233554] focus:border-[#64FFDA] focus:ring-1 focus:ring-[#64FFDA] outline-none transition-all text-[#CCD6F6] placeholder-[#8892B0]/30 resize-none"
                    placeholder="Your message..."
                  />
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                onClick={(event) =>
                  setSubmitPoint({
                    x: Math.round(event.clientX),
                    y: Math.round(event.clientY),
                  })
                }
                className={`w-full py-4 px-6 rounded-lg font-mono text-sm font-bold flex items-center justify-center gap-3 transition-all duration-300 border shadow-lg ${
                  status === 'success' 
                    ? 'bg-[#64FFDA]/10 text-[#64FFDA] border-[#64FFDA]' 
                    : 'bg-[#64FFDA] text-[#0a192f] border-transparent hover:bg-transparent hover:text-[#64FFDA] hover:border-[#64FFDA]'
                }`}
              >
                {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
                {status === 'success' && 'Message Sent!'}
                {status === 'error' && 'Failed - Try Again'}
                {status === 'idle' && (
                  <>
                    Send Message <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

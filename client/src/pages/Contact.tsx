import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { analyticsAPI, settingsAPI } from '../services/api';
import api from '../services/api';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const { data: settingsData } = useQuery('settings', settingsAPI.get);
  const settings = settingsData?.data;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await api.post('/contact', formData);
      await analyticsAPI.trackEvent({
        type: 'contact_form',
      });

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 dark:bg-slate-800/30">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Left Side - Info */}
          <div>
            <h1 className="section-title text-left mb-8">
              If Not Now, When?<br />
              Let's Work Together!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-12">
              Have a project in mind or just want to chat? Feel free to reach out. 
              I'm always open to discussing new projects, creative ideas, or opportunities.
            </p>
            
            {/* Signature */}
            <div className="mb-12">
              <svg viewBox="0 0 200 60" className="w-48 h-auto">
                <path 
                  d="M10,40 Q20,20 40,35 T80,40 M80,25 Q90,35 100,30 M110,25 L120,45 M130,25 Q140,40 150,30 T180,35" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none"
                  className="text-gray-900 dark:text-gray-100"
                />
              </svg>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <span>📍</span>
              <span>{settings?.address || 'Nagpur, Maharashtra'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <span>📞</span>
              <a href={`tel:${settings?.phone || '+919158508339'}`} className="hover:text-[#EF6461] transition-colors">
                {settings?.phone || '+91 9158508339'}
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <span>✉️</span>
              <a href={`mailto:${settings?.email || 'harshalp0602@gmail.com'}`} className="hover:text-[#EF6461] transition-colors">
                {settings?.email || 'harshalp0602@gmail.com'}
              </a>
            </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="input placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="input placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Your Message"
                  className="input placeholder:text-gray-400 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-center">
                  ✓ Message sent successfully!
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-center">
                  ✗ Failed to send message. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

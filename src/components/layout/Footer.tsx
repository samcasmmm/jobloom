import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className='relative z-10 w-full py-6 border-t border-white/5 bg-black/40 text-center text-xs text-zinc-500'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
        <p>© {new Date().getFullYear()} Jobloom Inc. Intelligent Career Discovery Platform.</p>
        <div className='flex items-center gap-6'>
          <a href='#privacy' className='hover:text-zinc-300 transition-colors'>
            Privacy Policy
          </a>
          <a href='#terms' className='hover:text-zinc-300 transition-colors'>
            Terms of Service
          </a>
          <a href='#security' className='hover:text-zinc-300 transition-colors'>
            Security
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

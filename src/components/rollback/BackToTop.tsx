'use client';

import { useEffect, useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';

function BackToTop({ className = '' }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className={`fixed bottom-6 right-6 z-50 p-2 rounded-full shadow-md border bg-white transition-all duration-300
                ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                ${className}`}
        >
            <ArrowUpTrayIcon className="w-6 h-6 text-gray-700" />
        </button>
    );
}

export default BackToTop;

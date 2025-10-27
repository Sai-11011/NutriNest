import React, { useState, useEffect, useRef } from 'react';
import { useSubscription } from '../context/SubscriptionContext.jsx';

// --- Logo ---
export const Logo = () => (
    <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-10 h-10">
           <svg viewBox="0 0 374 335" xmlns="http://www.w3.org/2000/svg">
                <path d="M174.50 36.50 L177.50 36.50 L186.50 42.50 L193.50 50.50 L192.50 51.50 L196.50 53.50 L203.50 64.50 L208.50 79.50 L207.50 82.50 L209.50 87.50 L207.50 96.50 L209.50 98.50 L200.50 128.50 L200.50 143.50 L167.50 145.50 L126.50 144.50 L117.50 139.50 L107.50 121.50 L104.50 102.50 L106.50 90.50 L107.50 88.50 L111.50 88.50 L119.50 91.50 L122.50 95.50 L124.50 94.50 L124.50 96.50 L127.50 96.50 L137.50 106.50 L139.50 109.50 L138.50 110.50 L144.50 117.50 L143.50 118.50 L151.50 126.50 L152.50 125.50 L147.50 109.50 L147.50 84.50 L149.50 83.50 L149.50 74.50 L157.50 56.50 L167.50 42.50 L173.50 37.50 Z" fill="#2E7D32" stroke="none" />
                <path d="M314.50 73.50 L321.50 74.50 L325.50 80.50 L323.50 95.50 L312.50 114.50 L292.50 131.50 L274.50 160.50 L276.50 163.50 L291.50 163.50 L293.50 166.50 L292.50 178.50 L287.50 191.50 L281.50 198.50 L282.50 199.50 L279.50 204.50 L268.50 217.50 L253.50 229.50 L241.50 236.50 L240.50 235.50 L239.50 237.50 L219.50 244.50 L190.50 246.50 L171.50 243.50 L146.50 232.50 L133.50 223.50 L118.50 208.50 L110.50 196.50 L102.50 177.50 L102.50 164.50 L257.50 163.50 L281.50 127.50 L283.50 115.50 L285.50 114.50 L284.50 110.50 L290.50 95.50 L304.50 78.50 L313.50 74.50 Z" fill="#F57C00" stroke="none" />
                <path d="M260.50 83.50 L266.50 83.50 L268.50 85.50 L268.50 98.50 L262.50 120.50 L254.50 131.50 L245.50 138.50 L233.50 143.50 L214.50 144.50 L214.50 129.50 L218.50 114.50 L221.50 112.50 L220.50 111.50 L228.50 100.50 L239.50 91.50 L259.50 84.50 Z" fill="#2E7D32" stroke="none" />
                <path d="M62.50 166.50 L65.50 166.50 L71.50 171.50 L71.50 173.50 L74.50 174.50 L74.50 177.50 L84.50 188.50 L87.50 195.50 L93.50 202.50 L92.50 204.50 L101.50 214.50 L100.50 215.50 L105.50 219.50 L111.50 228.50 L121.50 236.50 L122.50 239.50 L143.50 253.50 L161.50 261.50 L162.50 260.50 L163.50 262.50 L165.50 261.50 L166.50 263.50 L168.50 262.50 L172.50 264.50 L174.50 263.50 L186.50 266.50 L213.50 265.50 L226.50 263.50 L250.50 254.50 L274.50 238.50 L305.50 205.50 L310.50 202.50 L314.50 202.50 L315.50 216.50 L312.50 222.50 L312.50 230.50 L304.50 248.50 L299.50 253.50 L299.50 256.50 L294.50 263.50 L274.50 282.50 L271.50 284.50 L269.50 283.50 L261.50 290.50 L242.50 299.50 L235.50 299.50 L234.50 301.50 L226.50 304.50 L214.50 305.50 L210.50 307.50 L181.50 308.50 L165.50 307.50 L162.50 305.50 L158.50 306.50 L156.50 304.50 L143.50 302.50 L142.50 300.50 L140.50 301.50 L122.50 294.50 L116.50 289.50 L102.50 282.50 L90.50 272.50 L74.50 253.50 L75.50 251.50 L72.50 250.50 L67.50 240.50 L62.50 228.50 L63.50 226.50 L60.50 222.50 L57.50 208.50 L57.50 178.50 L59.50 168.50 L61.50 167.50 Z" fill="#2E7D32" stroke="none" />
            </svg>
        </div>
        <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-bold text-gray-800 leading-none">NutriNest</span>
            <span className="text-xs text-gray-500 leading-none">Healthy Meals. Simplified.</span>
        </div>
    </div>
);

// --- Button ---
export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseClasses = "px-5 py-2.5 text-sm font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        primary: "bg-[#2E7D32] text-white hover:bg-[#276a2b] focus:ring-[#2E7D32]",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
        accent: "bg-[#F57C00] text-white hover:bg-[#ef6c00] focus:ring-[#F57C00]",
    };
    const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
    return <button className={classes} {...props}>{children}</button>;
};

// --- Card ---
export const Card = ({ children, className = '', ...props }) => (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`} {...props}>
        {children}
    </div>
);

// --- Header ---
export const Header = ({ navigateTo }) => {
    const { state, dispatch } = useSubscription();
    const { isAuthenticated, user } = state;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        setIsMenuOpen(false);
        setIsProfileOpen(false);
        navigateTo('HOME');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const mobileLinkClasses = "text-gray-700 hover:bg-gray-100 block px-4 py-3 text-base font-medium";
    
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="relative flex items-center justify-between h-20 md:h-24">
                    {/* Centered Logo on Mobile */}
                    <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                        {/* Mobile menu button */}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                            <span className="sr-only">Open main menu</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center md:items-stretch md:justify-start">
                        <div onClick={() => navigateTo('HOME')} className="flex-shrink-0 flex items-center">
                            <Logo />
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('HOME'); }} className="text-gray-600 hover:text-gray-900 font-medium">Home</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('PLANS'); }} className="text-gray-600 hover:text-gray-900 font-medium">Plans</a>
                        {isAuthenticated ? (
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium">
                                    <span>Welcome, {user.name.split(' ')[0]}!</span>
                                    <svg className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                {isProfileOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('PROFILE'); setIsProfileOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
                                    </div>
                                )}
                            </div>
                        ) : (
                           <Button onClick={() => navigateTo('LOGIN')} variant="primary" className="px-5 py-2">Log In</Button>
                        )}
                    </nav>
                </div>
            </div>

            {/* Mobile Menu Slide-out Panel */}
            <div className={`fixed inset-0 z-40 transform transition-transform ease-in-out duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Backdrop */}
                <div className={`absolute inset-0 bg-black opacity-50 ${isMenuOpen ? 'block' : 'hidden'}`} onClick={() => setIsMenuOpen(false)}></div>
                
                {/* Panel */}
                <div className="relative w-64 max-w-[80vw] h-full bg-white shadow-xl py-4">
                    <div className="px-4 pb-4 border-b flex justify-between items-center">
                        <Logo />
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-full">
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <nav className="mt-4">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('HOME'); setIsMenuOpen(false); }} className={mobileLinkClasses}>Home</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('PLANS'); setIsMenuOpen(false); }} className={mobileLinkClasses}>Plans</a>
                         {isAuthenticated ? (
                            <>
                                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('PROFILE'); setIsMenuOpen(false); }} className={mobileLinkClasses}>Profile</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className={`${mobileLinkClasses} border-t mt-2 pt-3`}>Logout</a>
                            </>
                        ) : (
                           <div className="px-4 mt-4">
                                <Button onClick={() => { navigateTo('LOGIN'); setIsMenuOpen(false); }} variant="primary" className="w-full">Log In</Button>
                           </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

// --- BackButton ---
export const BackButton = ({ onClick }) => (
    <button onClick={onClick} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
    </button>
);
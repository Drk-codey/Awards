import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { useWindowScroll } from 'react-use';
import gsap from 'gsap';

const navItems = ["Nexus", 'Vault', 'prologue', 'About', 'Contact'];
 
const Navbar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); // New state for mobile nav

  const navContainerRef = useRef(null);
  const audioElementRef = useRef(null);

  
  // Toggle mobile navigation
  const toggleMobileNav = () => {
    setIsMobileNavOpen(prev => !prev);
  };

  // Close mobile nav when link is clicked
  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  };
    
  const { y: currentScrollY } = useWindowScroll();
    
  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove('floating-nav');
    } else if(currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add('floating-nav');
    } else if(currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add('floating-nav');
    }

    setLastScrollY(currentScrollY)
  }, [currentScrollY, lastScrollY])

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,

    })
  }, [isNavVisible])

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);

    setIsIndicatorActive((prev) => !prev);
  }

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying])

  return (
    <>
    <div ref={navContainerRef} className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6">
      <header className='absolute top-1/2 w-full -translate-y-1/2'>
        <nav className="flex size-full items-center justify-between px-4">
          <div className='flex items-center gap-7'>
            <img src="/img/logo.png" alt="Zentry Logo" className="w-10" />

            <Button 
              id="product-button"
              title="Products"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
          </div>

          <div className='flex h-full items-center'>
            <div className='hidden md:block'>
              {navItems.map((item) => (
                <a key={item} href={`#${item.toLowerCase}`} className='nav-hover-btn'>
                  {item}
                </a>            
              ))}
            </div>

            <button className='ml-10 flex items-center space-x-0.5' onClick={toggleAudioIndicator}>
              <audio ref={audioElementRef} className='hidden' src="/audio/loop.mp3" loop />
                {[1, 2, 3, 4].map((bar) => (
                  <div key={bar} className={`border indicator-line ${isIndicatorActive ? 'active' : ''}`} style={{ animationDelay: `${bar * 0.1 }s`  }} />
                ))}
            </button>

            <button className='ml-6 flex flex-col align-middle items-center gap-0.5 sm:hidden' onClick={toggleMobileNav }>
                {[1, 2, 3].map((bar) => (
                  <div key={bar} className={`navbar-button`} />
                ))}
            </button>
          </div>
        </nav>
      </header>


      
    </div>

    {/* Mobile Navbar Navigation Menu */}
    <nav className={`fixed top-0 right-0 z-50 h-dvh w-full bg-white transition-transform duration-300 ease-in-out transform ${
        isMobileNavOpen ? 'translate-x-0' : 'translate-x-full'
      } sm:hidden`}>

      <div className="flex justify-end p-5">
          <button 
            onClick={closeMobileNav}
            className="text-3xl font-bold text-black focus:outline-none"
            aria-expanded={isMobileNavOpen}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        <div className='w-full h-[85%] flex flex-col items-center justify-between gap-2 p-10'>
          {navItems.map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className='nav-hover-btn text-2xl! font-medium text-black! hover:text-blue-600 transition-colors'
              onClick={closeMobileNav}
            >
              {item}
            </a>            
          ))}
        </div>
      </nav>
    </>
  )
}
 
export default Navbar;
 
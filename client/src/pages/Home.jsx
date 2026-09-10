import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const d = new Date().getDay();
  const todayHours = d === 0 ? "10am - 3:30pm" : d === 6 ? "10am - 7pm" : "10am - 6pm";

  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (videoContainerRef.current && videoRef.current) {
        const container = videoContainerRef.current;
        const video = videoRef.current;
        const rect = container.getBoundingClientRect();
        
        // We want the video to be sticky for a while as we scroll past the container
        const scrollStart = 0; // Starts scrubbing when container reaches the top of viewport
        const scrollDistance = rect.height - window.innerHeight; // The total scrub distance
        
        // Calculate how far we've scrolled into the sticky container
        if (rect.top <= scrollStart && rect.bottom >= window.innerHeight) {
          const scrolled = scrollStart - rect.top;
          const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));
          if (video.duration && !isNaN(video.duration)) {
            // Scrub the video based on scroll progress
            video.currentTime = progress * video.duration;
          }
        } else if (rect.top > scrollStart) {
          // Above the container
          video.currentTime = 0;
        } else if (rect.bottom < window.innerHeight) {
          // Below the container
          if (video.duration && !isNaN(video.duration)) {
            video.currentTime = video.duration;
          }
        }
      }
    };

    // Ensure the video is loaded enough to know its duration before we start scrubbing
    const video = videoRef.current;
    let isUnlocked = false;

    const unlockVideo = () => {
      if (video && !isUnlocked) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            video.pause();
            isUnlocked = true;
          }).catch(() => {});
        }
        window.removeEventListener('touchstart', unlockVideo);
      }
    };

    if (video) {
      video.pause(); // We control playback via scroll
      video.addEventListener('loadedmetadata', handleScroll);
      window.addEventListener('touchstart', unlockVideo, { passive: true });
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', unlockVideo);
      if (video) video.removeEventListener('loadedmetadata', handleScroll);
    };
  }, []);

  return (
    <>
      <main className="wrap">
        <section style={{ padding: 'clamp(36px,6vw,72px) 0 clamp(32px,5vw,64px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 'clamp(28px,4vw,72px)', alignItems: 'center' }}>
          <div>
            <p className="fade-up" style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 16px' }}>Norwood, Massachusetts &middot; Est. local</p>
            <h1 className="fade-up" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(38px,6vw,72px)', lineHeight: 1.04, letterSpacing: '-0.02em', margin: '0 0 0 -0.058em', animationDelay: '.08s' }}>
              <span style={{ display: 'block' }}>Your local gun shop.</span><span style={{ display: 'block', color: 'var(--color-accent)' }}>Straight answers.</span><span style={{ display: 'block' }}>Fair prices.</span>
            </h1>
            <p className="fade-up" style={{ fontSize: 'clamp(15px,2vw,17px)', lineHeight: 1.65, maxWidth: '52ch', margin: '24px 0 0', animationDelay: '.16s' }}>Optics, lights, AR parts and used guns in stock. Custom orders on anything we don't carry. FFL transfers, gunsmithing, and Massachusetts LTC classes taught right here in the shop.</p>
            <div className="fade-up" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '28px', animationDelay: '.24s' }}>
              <Link to="/shop" className="btn btn-primary" style={{ textDecoration: 'none', minHeight: '48px' }}>Browse the shop</Link>
              <a href="#ltc" className="btn btn-secondary" style={{ textDecoration: 'none', minHeight: '48px' }}>LTC classes</a>
            </div>
          </div>
          <div className="fade-up" style={{ animationDelay: '.15s' }}>
            <div className="glass-card" style={{ aspectRatio: '5/4', overflow: 'hidden' }}>
              <img src="/images/shop_counter.png" alt="Liberty Ordnance Supply Shop Counter" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '12px 4px 0', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              <span>The counter, Norwood MA</span><span style={{ color: 'var(--color-accent)' }}>Open 7 days</span>
            </div>
          </div>
        </section>

        <section 
          ref={videoContainerRef} 
          style={{ 
            width: '100%', 
            height: '300vh', 
            margin: '0 0 clamp(32px,5vw,64px) 0',
            position: 'relative'
          }}
        >
          <div style={{
            position: 'sticky',
            top: '10vh',
            width: '100%',
            height: '80vh',
            borderRadius: '16px', 
            overflow: 'hidden', 
            background: '#000',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <video 
              ref={videoRef}
              src="/erasio_video.mp4" 
              muted 
              playsInline
              preload="auto"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }} 
            />
          </div>
        </section>

        <div className="tile-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))' }}>
          <a href="tel:+15084925955" className="tile tile-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', color: 'var(--color-text)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" style={{ color: 'var(--color-accent)', flexShrink: 0 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Call the shop</span>
          </a>
          <a href="https://maps.google.com/?q=100+Access+Rd+Suite+215+Norwood+MA+02062" className="tile tile-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', color: 'var(--color-text)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" style={{ color: 'var(--color-accent)', flexShrink: 0 }}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Directions</span>
          </a>
          <a href="#visit" className="tile tile-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', color: 'var(--color-text)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" style={{ color: 'var(--color-accent)', flexShrink: 0 }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Hours today: <span>{todayHours}</span></span>
          </a>
        </div>

        <div style={{ borderTop: '1px solid var(--color-divider)', borderBottom: '1px solid var(--color-divider)', marginTop: 'clamp(32px,5vw,56px)', overflow: 'hidden', padding: '16px 0' }} aria-hidden="true">
          <div style={{ display: 'flex', gap: 0, width: 'max-content', animation: 'ticker 28s linear infinite', whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>FFL Transfers <span style={{ color: 'var(--color-accent)' }}>&#9632;</span> LTC Classes <span style={{ color: 'var(--color-accent)' }}>&#9632;</span> We Buy Collections <span style={{ color: 'var(--color-accent)' }}>&#9632;</span> Gunsmithing <span style={{ color: 'var(--color-accent)' }}>&#9632;</span> Custom Orders <span style={{ color: 'var(--color-accent)' }}>&#9632;</span>&nbsp;</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>FFL Transfers <span style={{ color: 'var(--color-accent)' }}>&#9632;</span> LTC Classes <span style={{ color: 'var(--color-accent)' }}>&#9632;</span> We Buy Collections <span style={{ color: 'var(--color-accent)' }}>&#9632;</span> Gunsmithing <span style={{ color: 'var(--color-accent)' }}>&#9632;</span> Custom Orders <span style={{ color: 'var(--color-accent)' }}>&#9632;</span>&nbsp;</span>
          </div>
        </div>

        <section style={{ padding: 'clamp(40px,6vw,72px) 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,40px)', margin: 0 }}>Shop in store</h2>
            <Link to="/shop" style={{ textDecoration: 'none', fontSize: '15px', fontWeight: 600, color: 'var(--color-accent)' }}>See everything &rarr;</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '20px' }}>
            <Link to="/shop?cat=Red%20Dots" className="tile-link glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src="/images/red_dot.png" alt="Red Dots" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ padding: '16px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px' }}>Red Dots</span>
            </Link>
            <Link to="/shop?cat=Weapon%20Lights" className="tile-link glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src="/images/weapon_light.png" alt="Weapon Lights" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ padding: '16px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px' }}>Weapon Lights</span>
            </Link>
            <Link to="/shop?cat=AR%20Accessories" className="tile-link glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src="/images/ar_accessories.png" alt="AR Accessories" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ padding: '16px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px' }}>AR Accessories</span>
            </Link>
            <Link to="/shop?cat=Used%20Guns" className="tile-link glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src="/images/used_guns.png" alt="Used Guns" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ padding: '16px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px' }}>Used Guns</span>
            </Link>
            <Link to="/shop?cat=Upper%20Receivers" className="tile-link glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src="/images/ar_accessories.png" alt="Upper Receivers" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ padding: '16px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px' }}>Upper Receivers</span>
            </Link>
            <Link to="/shop" className="tile-link glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src="/images/shop_counter.png" alt="Merch" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ padding: '16px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px' }}>Merch</span>
            </Link>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', margin: '24px 0 0', maxWidth: '60ch' }}>Don't see it? We special-order handguns, rifles and shotguns from every major distributor &mdash; <Link to="/services">ask about custom orders</Link>.</p>
        </section>

        <hr className="rule" />

        <section style={{ padding: 'clamp(36px,5vw,60px) 0' }} aria-label="Why people come to us">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '32px 24px' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(34px,3.4vw,48px)', color: 'var(--color-accent)', margin: '0 0 0 -0.045em' }}>7</p>
              <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'color-mix(in srgb, var(--color-text) 70%, transparent)', margin: '10px 0 0' }}>Days open a week</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(34px,3.4vw,48px)', color: 'var(--color-accent)', margin: '0 0 0 -0.045em' }}>~15min</p>
              <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'color-mix(in srgb, var(--color-text) 70%, transparent)', margin: '10px 0 0' }}>Typical FFL transfer</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(34px,3.4vw,48px)', color: 'var(--color-accent)', margin: '0 0 0 -0.045em' }}>Same day</p>
              <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'color-mix(in srgb, var(--color-text) 70%, transparent)', margin: '10px 0 0' }}>LTC certificate in hand</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(34px,3.4vw,48px)', color: 'var(--color-accent)', margin: '0 0 0 -0.045em' }}>$0</p>
              <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'color-mix(in srgb, var(--color-text) 70%, transparent)', margin: '10px 0 0' }}>Optic mounting with purchase</p>
            </div>
          </div>
        </section>

        <hr className="rule" />

        <section id="ltc" style={{ padding: 'clamp(40px,6vw,72px) 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 'clamp(24px,4vw,64px)', alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent)', margin: '0 0 16px', fontWeight: 600 }}>LTC classes taught here</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,40px)', lineHeight: 1.1, margin: 0 }}>Get your Massachusetts License to Carry.</h2>
            <p style={{ fontSize: '15px', lineHeight: 1.65, maxWidth: '52ch', margin: '20px 0 0' }}>State-approved firearms safety certification, taught in-store by certified instructors. Small classes, all materials provided, certificate issued same day. No experience needed.</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
              <Link to="/contact" className="btn btn-primary">Register for a class</Link>
              <Link to="/guide" className="btn btn-secondary">New? Read the Beginner's Guide</Link>
            </div>
          </div>
          <div className="glass-card">
            <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0, padding: '16px 24px', borderBottom: '1px solid var(--color-divider)', fontWeight: 600 }}>What's covered</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ padding: '16px 24px', fontSize: '15px', borderBottom: '1px solid var(--color-surface-hover)' }}>Massachusetts gun law essentials</span>
              <span style={{ padding: '16px 24px', fontSize: '15px', borderBottom: '1px solid var(--color-surface-hover)' }}>Safe handling &amp; storage</span>
              <span style={{ padding: '16px 24px', fontSize: '15px', borderBottom: '1px solid var(--color-surface-hover)' }}>Live instruction with real hardware</span>
              <span style={{ padding: '16px 24px', fontSize: '15px' }}>Application walkthrough for your town</span>
            </div>
          </div>
        </section>

        <hr className="rule" />

        <section style={{ padding: 'clamp(40px,6vw,72px) 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: 0 }}>More than a counter</p>
            <Link to="/services" style={{ textDecoration: 'none', fontSize: '14px', fontWeight: 600, color: 'var(--color-accent-700)' }}>All services &rarr;</Link>
          </div>
          <div className="tile-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
            <Link to="/services" className="tile-link tile" style={{ display: 'block', padding: '22px 20px' }}>
              <span style={{ display: 'block', fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-accent)' }}>01</span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '20px', margin: '12px 0 0' }}>FFL transfers</h3>
              <p style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'color-mix(in srgb, var(--color-text) 78%, transparent)', margin: '10px 0 0' }}>Bought online? Ship it to us. Fast paperwork, no attitude &mdash; usually fifteen minutes.</p>
            </Link>
            <Link to="/services" className="tile-link tile" style={{ display: 'block', padding: '22px 20px' }}>
              <span style={{ display: 'block', fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-accent)' }}>02</span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '20px', margin: '12px 0 0' }}>Gunsmithing</h3>
              <p style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'color-mix(in srgb, var(--color-text) 78%, transparent)', margin: '10px 0 0' }}>Optic mounting, sight installs, cleaning, repairs and full builds &mdash; done in-house.</p>
            </Link>
            <Link to="/sell-your-guns" className="tile-link tile" style={{ display: 'block', padding: '22px 20px' }}>
              <span style={{ display: 'block', fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-accent)' }}>03</span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '20px', margin: '12px 0 0' }}>We buy collections</h3>
              <p style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'color-mix(in srgb, var(--color-text) 78%, transparent)', margin: '10px 0 0' }}>One gun or a whole estate &mdash; fair cash offers, paperwork handled.</p>
            </Link>
          </div>
        </section>
      </main>

      <section style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
        <div className="wrap" style={{ paddingTop: 'clamp(48px,7vw,84px)', paddingBottom: 'clamp(48px,7vw,84px)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', lineHeight: 1.06, letterSpacing: '-0.015em', margin: '0 0 0 -0.058em' }}><span style={{ display: 'block' }}>We buy collections.</span><span style={{ display: 'block' }}>Single guns or entire estates.</span></h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '28px' }}>
            <Link to="/sell-your-guns" className="btn btn-ghost" style={{ textDecoration: 'none', color: 'var(--color-bg)', borderColor: 'var(--color-bg)', minHeight: '48px' }}>How it works</Link>
            <a href="tel:+15084925955" className="btn btn-ghost" style={{ textDecoration: 'none', color: 'var(--color-bg)', borderColor: 'var(--color-bg)', minHeight: '48px' }}><span style={{ whiteSpace: 'nowrap' }}>Get an offer</span>&nbsp;&mdash;&nbsp;<span style={{ whiteSpace: 'nowrap' }}>(508) 492-5955</span></a>
          </div>
        </div>
      </section>

      <main className="wrap">
        <section id="visit" style={{ padding: 'clamp(40px,6vw,72px) 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 'clamp(24px,4vw,64px)' }}>
          <div>
            <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 16px' }}>Visit us</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,40px)', letterSpacing: '-0.015em', margin: '0 0 0 -0.045em' }}>100 Access Rd, Suite 215<br />Norwood, MA 02062</h2>
            <p style={{ fontSize: '15.5px', lineHeight: 1.7, margin: '20px 0 0' }}><a href="tel:+15084925955" style={{ textDecoration: 'none', fontWeight: 700 }}>(508) 492-5955</a><br /><a href="mailto:sales@los2a.com" style={{ textDecoration: 'none' }}>sales@los2a.com</a></p>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'color-mix(in srgb, var(--color-text) 70%, transparent)', margin: '16px 0 0', maxWidth: '44ch' }}>Need a time outside regular hours? Call for a special appointment.</p>
            <a href="https://maps.google.com/?q=100+Access+Rd+Suite+215+Norwood+MA+02062" className="btn btn-secondary" style={{ textDecoration: 'none', marginTop: '24px', minHeight: '48px' }}>Open in Maps</a>
          </div>
          <div>
            <table className="table" style={{ width: '100%' }}>
              <thead><tr><th style={{ textAlign: 'left' }}>Day</th><th style={{ textAlign: 'left' }}>Hours</th></tr></thead>
              <tbody>
                <tr><td>Monday &ndash; Friday</td><td>10am &ndash; 6pm</td></tr>
                <tr><td>Saturday</td><td>10am &ndash; 7pm</td></tr>
                <tr><td>Sunday</td><td>10am &ndash; 3:30pm</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}

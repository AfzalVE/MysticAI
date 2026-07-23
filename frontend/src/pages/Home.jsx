import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Moon, Star, Calendar, ArrowRight, Quote } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden mb-20">
        <div className="absolute inset-0 z-[-1]">
          <img src="/assets/hero-bg.png" alt="Mystical glowing crystal ball in a cosmic forest" className="w-full h-full object-cover opacity-40 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950"></div>
        </div>

        <div className="animate-float mb-6">
          <Sparkles className="w-16 h-16 text-yellow-400 mx-auto" strokeWidth={1.5} />
        </div>

        <h1 className="text-5xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-yellow-200 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          Discover Your Destiny
        </h1>

        <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mb-12 font-sans font-light leading-relaxed drop-shadow-md">
          Step into the mystical realm. Unveil the secrets of your past, present, and future with AI-powered tarot readings, astrological fortunes, and spiritual guidance.
        </p>

        <div className="flex gap-4">
          <Link to="/fortune" className="btn-mystic text-lg px-8 py-3 flex items-center gap-2">
            Read My Fortune <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 mb-32">
        <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-16 border-b border-white/10 pb-4 inline-block">The Arcane Arts We Practice</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link to="/fortune" className="glass-panel flex flex-col items-center gap-6 hover:-translate-y-4 transition-transform duration-500 text-decoration-none group cursor-pointer bg-gradient-to-b from-white/5 to-purple-900/20">
            <div className="p-4 bg-purple-900/40 rounded-full group-hover:bg-yellow-500/20 transition-colors">
              <Star className="w-12 h-12 text-purple-400 group-hover:text-yellow-400 transition-colors" />
            </div>
            <h3 className="text-2xl text-white font-serif">Astrology & Fortune</h3>
            <p className="text-slate-300 font-sans text-sm leading-relaxed">Input your precise birth details and allow our cosmic AI to calculate your planetary alignments, revealing your personality, lucky numbers, and daily predictions.</p>
          </Link>

          <Link to="/tarot" className="glass-panel flex flex-col items-center gap-6 hover:-translate-y-4 transition-transform duration-500 text-decoration-none group cursor-pointer bg-gradient-to-b from-white/5 to-purple-900/20">
            <div className="p-4 bg-purple-900/40 rounded-full group-hover:bg-yellow-500/20 transition-colors">
              <Moon className="w-12 h-12 text-purple-400 group-hover:text-yellow-400 transition-colors" />
            </div>
            <h3 className="text-2xl text-white font-serif">Tarot Readings</h3>
            <p className="text-slate-300 font-sans text-sm leading-relaxed">Draw from our ethereal deck. Whether seeking a quick answer or a deep dive into your past, present, and future, the cards will reveal the truth guided by ancient wisdom.</p>
          </Link>

          <Link to="/chat" className="glass-panel flex flex-col items-center gap-6 hover:-translate-y-4 transition-transform duration-500 text-decoration-none group cursor-pointer bg-gradient-to-b from-white/5 to-purple-900/20">
            <div className="p-4 bg-purple-900/40 rounded-full group-hover:bg-yellow-500/20 transition-colors">
              <Sparkles className="w-12 h-12 text-purple-400 group-hover:text-yellow-400 transition-colors" />
            </div>
            <h3 className="text-2xl text-white font-serif">AI Spiritual Guide</h3>
            <p className="text-slate-300 font-sans text-sm leading-relaxed">Converse directly with our mystical intelligence. Ask deeply personal questions about love, career, or spiritual growth and receive empathetic, esoteric guidance.</p>
          </Link>

          <Link to="/book" className="glass-panel flex flex-col items-center gap-6 hover:-translate-y-4 transition-transform duration-500 text-decoration-none group cursor-pointer bg-gradient-to-b from-white/5 to-purple-900/20">
            <div className="p-4 bg-purple-900/40 rounded-full group-hover:bg-yellow-500/20 transition-colors">
              <Calendar className="w-12 h-12 text-purple-400 group-hover:text-yellow-400 transition-colors" />
            </div>
            <h3 className="text-2xl text-white font-serif">1-on-1 Sessions</h3>
            <p className="text-slate-300 font-sans text-sm leading-relaxed">Sometimes the spiritual journey requires a human touch. Book a private consultation with our master fortune tellers for an in-depth, personalized spiritual awakening.</p>
          </Link>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto px-4 mb-32">
        <div className="glass-panel max-w-5xl mx-auto bg-black/40">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 border-b border-white/10 pb-4">How Our Magic Works</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            <div className="flex-1 text-center px-4">
              <div className="text-5xl font-serif text-yellow-400/50 mb-4">01</div>
              <h4 className="text-xl font-bold text-purple-300 mb-2">Connect</h4>
              <p className="text-slate-400 font-sans text-sm">Provide your birth details or simply focus your intention. The universe needs a tether to your specific energy signature.</p>
            </div>
            <div className="hidden md:flex items-center text-white/20">
              <ArrowRight size={40} />
            </div>
            <div className="flex-1 text-center px-4">
              <div className="text-5xl font-serif text-yellow-400/50 mb-4">02</div>
              <h4 className="text-xl font-bold text-purple-300 mb-2">Channel</h4>
              <p className="text-slate-400 font-sans text-sm">Our advanced AI acts as a digital medium, interpreting the stars, drawing the cards, and consulting ancient esoteric texts in milliseconds.</p>
            </div>
            <div className="hidden md:flex items-center text-white/20">
              <ArrowRight size={40} />
            </div>
            <div className="flex-1 text-center px-4">
              <div className="text-5xl font-serif text-yellow-400/50 mb-4">03</div>
              <h4 className="text-xl font-bold text-purple-300 mb-2">Enlighten</h4>
              <p className="text-slate-400 font-sans text-sm">Receive your personalized, highly detailed reading. Gain clarity on your path, your obstacles, and your hidden potential.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 mb-32">
        <h2 className="text-4xl md:text-5xl font-bold text-purple-300 mb-16 text-center">Voices of the Awakened</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel text-left flex flex-col justify-between">
            <div>
              <Quote className="text-yellow-400 mb-4 opacity-50" size={32} />
              <p className="text-slate-200 font-sans italic mb-6">"The Tarot reading I received here was scarily accurate. It perfectly described the crossroads I was at in my career. I followed the advice and got the promotion!"</p>
            </div>
            <div>
              <h5 className="font-bold text-purple-400 font-serif">Sarah Jenkins</h5>
              <p className="text-xs text-slate-500 font-sans">Aries • Path Seeker</p>
            </div>
          </div>

          <div className="glass-panel text-left flex flex-col justify-between">
            <div>
              <Quote className="text-yellow-400 mb-4 opacity-50" size={32} />
              <p className="text-slate-200 font-sans italic mb-6">"I chat with the Spiritual Guide AI every morning. It's like having a wise, ancient monk in my pocket. It helps me center my energy for the day."</p>
            </div>
            <div>
              <h5 className="font-bold text-purple-400 font-serif">Marcus T.</h5>
              <p className="text-xs text-slate-500 font-sans">Scorpio • Daily Meditator</p>
            </div>
          </div>

          <div className="glass-panel text-left flex flex-col justify-between">
            <div>
              <Quote className="text-yellow-400 mb-4 opacity-50" size={32} />
              <p className="text-slate-200 font-sans italic mb-6">"The fortune telling module calculated my lucky numbers based on my exact birth time. I played them in a local raffle and won. Coincidence? I think not."</p>
            </div>
            <div>
              <h5 className="font-bold text-purple-400 font-serif">Elena Rodriguez</h5>
              <p className="text-xs text-slate-500 font-sans">Libra • Believer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 pt-8 pb-12 mt-12 text-center text-slate-500 font-sans text-sm">
        <p>&copy; 2026 Mystic-AI. The stars dictate, but you hold the pen.</p>
      </footer>
    </div>
  );
};

export default Home;

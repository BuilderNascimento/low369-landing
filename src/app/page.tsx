"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Home() {
  const benefits = [
    { title: "Lucro por resultado", desc: "Ganhos por comissão em cada venda realizada com seu link ou cupom." },
    { title: "Processo simplificado", desc: "Sem burocracia. Cadastro rápido e aprovação ágil." },
    { title: "Sistema fácil de usar", desc: "A cada venda realizada você é notificado via email, relatórios mensais e trimestrais de sua evolução serão disponibilizados para estudos e análises." },
    { title: "Conteúdos prontos", desc: "Materiais de divulgação e criativos para suas redes." },
    { title: "Apoio especializado", desc: "Suporte dedicado que maximizam seus resultados." },
    { title: "Evolução compartilhada", desc: "Crescemos juntos e valorizamos seu desenvolvimento." },
  ];

  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [followers, setFollowers] = useState(5000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Animação ao scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-animate').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Cálculo de ganhos potenciais
  const calculateEarnings = (followers: number) => {
    const conversionRate = 0.03; // 3% de conversão
    const avgTicket = 100; // Ticket médio R$ 100
    const commission = 0.20; // 20% de comissão
    const monthlyEarnings = followers * conversionRate * avgTicket * commission;
    return monthlyEarnings.toFixed(0);
  };

  const totalPages = benefits.length;

  const scrollTo = (index: number) => {
    if (!trackRef.current) return;
    const container = trackRef.current;
    const x = index * container.clientWidth;
    container.scrollTo({ left: x, behavior: 'smooth' });
    setPage(index);
  };

  const onScroll = () => {
    if (!trackRef.current) return;
    const container = trackRef.current;
    const current = Math.round(container.scrollLeft / container.clientWidth);
    if (current !== page) setPage(current);
  };

  // Autoplay do carrossel - avança automaticamente a cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setPage((currentPage) => {
        const nextPage = (currentPage + 1) % totalPages;
        scrollTo(nextPage);
        return nextPage;
      });
    }, 6000); // Muda a cada 6 segundos (reduzido de 4s)

    return () => clearInterval(interval);
  }, [totalPages]);

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes shine {
          to { left: 200%; }
        }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .hover\:pause:hover {
          animation-play-state: paused;
        }
        
        .mask-gradient {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        
        .will-change-transform {
          will-change: transform;
        }
        
        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease-out;
        }
        
        .scroll-animate.animate-fadeInUp {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Background images responsivos */
        .hero-bg-section {
          background-image: url(/herocelular.jpeg);
        }
        
        @media (min-width: 1024px) {
          .hero-bg-section {
            background-image: url(/hero-bg.webp);
          }
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: white;
          border: 4px solid rgb(168 85 247);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.5);
          transition: all 0.2s;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(168, 85, 247, 0.7);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: white;
          border: 4px solid rgb(168 85 247);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.5);
          transition: all 0.2s;
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(168, 85, 247, 0.7);
        }
      `}</style>
      <div className="font-sans min-h-screen bg-background text-foreground">
      <header className="w-full sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b border-orange-200/50 shadow-lg">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl blur-sm"></div>
            <div className="relative text-2xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent">
                LOW369
              </span>
            </div>
          </div>
          
          <nav className="hidden lg:flex gap-8 text-sm font-medium">
            <a href="#beneficios" className="text-gray-700 hover:text-orange-600 transition-colors duration-300 relative group">
              Benefícios
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#como-funciona" className="text-gray-700 hover:text-orange-600 transition-colors duration-300 relative group">
              Como funciona
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#recebe" className="text-gray-700 hover:text-orange-600 transition-colors duration-300 relative group">
              O que você recebe
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#faq" className="text-gray-700 hover:text-orange-600 transition-colors duration-300 relative group">
              Dúvidas
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-full blur-md opacity-75 animate-pulse"></div>
            <a
              href="#cadastro"
              className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 text-white px-6 py-3 text-sm font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-orange-500/50 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                🚀 Quero ser parceiro
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:animate-[shine_0.75s] group-hover:opacity-100"></div>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero - Seção principal com efeitos espetaculares */}
        <section className="relative overflow-hidden min-h-[80vh] flex items-center">
          {/* Background com gradientes animados */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/30 via-transparent to-transparent animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent animate-pulse" />
          
          {/* Partículas flutuantes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-2 h-2 bg-orange-400/60 rounded-full animate-[float_6s_ease-in-out_infinite] top-20 left-[10%]" />
            <div className="absolute w-1 h-1 bg-yellow-400/80 rounded-full animate-[float_4s_ease-in-out_infinite_1s] top-32 right-[15%]" />
            <div className="absolute w-3 h-3 bg-orange-300/40 rounded-full animate-[float_8s_ease-in-out_infinite_2s] bottom-32 left-[20%]" />
            <div className="absolute w-1.5 h-1.5 bg-yellow-300/60 rounded-full animate-[float_5s_ease-in-out_infinite_0.5s] bottom-20 right-[25%]" />
            <div className="absolute w-2 h-2 bg-orange-400/50 rounded-full animate-[float_7s_ease-in-out_infinite_1.5s] top-40 left-[60%]" />
          </div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Coluna da esquerda - Conteúdo */}
              <div>
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent blur-3xl animate-pulse" />
                  
                  <h1 className="relative text-4xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-tight">
                    <span className="block bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-clip-text text-transparent drop-shadow-2xl animate-[float_4s_ease-in-out_infinite] text-3xl sm:text-4xl lg:text-5xl">
                      ZERO Investimento.
                    </span>
                    <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl animate-[float_4s_ease-in-out_infinite_0.5s] mt-2">
                      LUCRO de verdade.
                    </span>
                  </h1>
                  
                  <div className="flex mt-6">
                    <div className="w-32 h-1.5 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <p className="text-xl sm:text-2xl font-semibold mb-6 animate-[fadeInUp_1s_ease-out_0.7s_both]">
                  <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent font-black">
                    COMECE <span className="text-white">HOJE MESMO</span>, com investimento <span className="text-white">ZERO</span>.
                  </span>
                </p>
                
                <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-6 animate-[fadeInUp_1s_ease-out_0.8s_both]">
                  Use sua influência nas redes para{" "}
                  <span className="text-orange-400 font-bold">MONETIZAR SEU ALCANCE</span> e ajudar sua audiência a comprar com <span className="text-orange-400 font-bold">SEGURANÇA</span>.
                </p>
                
                <p className="text-sm sm:text-base text-white/60 mb-8 animate-[fadeInUp_1s_ease-out_1.2s_both]">
                  Torne-se parceiro LOW369 e ganhe comissões por indicação em cada venda realizada com o seu{" "}
                  <span className="text-orange-400 font-black text-base sm:text-lg">CUPOM EXCLUSIVO</span>!
                </p>
                
                {/* Badge de Urgência */}
                <div className="mb-6 animate-[fadeInUp_1s_ease-out_1.4s_both]">
                  <div className="inline-flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-2xl animate-pulse border-2 border-red-300">
                    🔥 Vagas Limitadas
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 animate-[fadeInUp_1s_ease-out_1.6s_both] max-w-xl">
                  {/* Botão Principal - CTA */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-2xl blur-lg animate-pulse opacity-75" />
                    
                    <a
                      href="#cadastro"
                      className="relative flex items-center justify-center w-full px-8 py-5 text-base sm:text-lg font-black text-white bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-2xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <span className="text-2xl">🚀</span>
                        <span>QUERO SER PARCEIRO LOW369</span>
                        <span className="group-hover:translate-x-2 transition-transform duration-300 text-xl">→</span>
                      </span>
                      
                      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:animate-[shine_0.75s] group-hover:opacity-100" />
          </a>
        </div>
                  
                  {/* Botão Secundário */}
                  <a
                    href="#beneficios"
                    className="flex items-center justify-center w-full px-8 py-4 text-base sm:text-lg font-semibold text-white border-2 border-orange-400/50 rounded-2xl hover:border-orange-400 hover:bg-orange-400/10 transition-all duration-300 hover:scale-105 group backdrop-blur-sm"
                  >
                    <span className="flex items-center gap-2">
                      ✨ Ver benefícios
                      <span className="group-hover:translate-y-1 transition-transform duration-300">↓</span>
                    </span>
                  </a>
                </div>
                
                <div className="flex flex-wrap gap-6 mt-12 animate-[fadeInUp_1s_ease-out_2s_both]">
                  <div className="flex items-center gap-2 text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">100% Gratuito</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Comissões Garantidas</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Suporte Dedicado</span>
                  </div>
                </div>
              </div>
              
              {/* Coluna da direita - Área do vídeo */}
              <div className="animate-[fadeInUp_1s_ease-out_1s_both]">
                <div className="relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/50 via-yellow-500/30 to-orange-500/50 rounded-3xl blur-sm animate-pulse" />
                    
                    <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-orange-500/30 overflow-hidden">
                      <video 
                        className="w-full h-full object-cover rounded-3xl"
                        controls
                        playsInline
                        poster="/VIDEO.jpg"
                      >
                        <source src="/video-teste.mp4" type="video/mp4" />
                        Seu navegador não suporta vídeos HTML5.
                      </video>
                    </div>
                  </div>
                  
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                    🎥 Assista agora
                  </div>
                </div>
                
                {/* Botão Loja Oficial */}
                <div className="mt-8 text-center animate-[fadeInUp_1s_ease-out_1.5s_both]">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full blur-md opacity-75 animate-pulse"></div>
                    <a
                      href="https://reserva.ink/low369"
          target="_blank"
          rel="noopener noreferrer"
                      className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white px-8 py-4 text-base sm:text-lg font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-blue-500/50 group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center gap-3">
                        🏪 Acessar Loja Oficial
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </span>
                      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:animate-[shine_0.75s] group-hover:opacity-100"></div>
                    </a>
                  </div>
                  <p className="text-white/60 text-sm mt-3">
                    Conheça nossos produtos e valores
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculadora de Ganhos */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
          
          {/* Partículas flutuantes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-2 h-2 bg-purple-400/60 rounded-full animate-[float_6s_ease-in-out_infinite] top-20 left-[10%]" />
            <div className="absolute w-1 h-1 bg-pink-400/80 rounded-full animate-[float_4s_ease-in-out_infinite_1s] top-32 right-[15%]" />
            <div className="absolute w-3 h-3 bg-purple-300/40 rounded-full animate-[float_8s_ease-in-out_infinite_2s] bottom-32 left-[20%]" />
          </div>
          
          <div className="relative z-10 mx-auto max-w-4xl px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent">
                  Calcule seu Potencial de Ganhos
                </span>
              </h2>
              <p className="text-purple-200 text-lg">
                Descubra quanto você pode ganhar como parceiro LOW369
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="mb-8">
                <label className="block text-white font-semibold mb-4 text-lg">
                  Pessoas que você leva ao site através do seu CUPOM
                </label>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={followers}
                  onChange={(e) => setFollowers(Number(e.target.value))}
                  className="w-full h-3 bg-purple-300/30 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${((followers - 1000) / 99000) * 100}%, rgba(216, 180, 254, 0.3) ${((followers - 1000) / 99000) * 100}%, rgba(216, 180, 254, 0.3) 100%)`
                  }}
                />
                <div className="flex justify-between text-purple-200 text-sm mt-2">
                  <span>1k</span>
                  <span className="text-white font-bold text-2xl">{(followers / 1000).toFixed(0)}k pessoas</span>
                  <span>100k</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 rounded-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <p className="text-white/90 text-lg mb-2">💰 Ganho Estimado Mensal</p>
                <p className="text-5xl sm:text-6xl font-black text-white mb-2">
                  R$ {calculateEarnings(followers)}
                </p>
                <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left space-y-2">
                  <p className="text-green-100 text-sm font-bold mb-3">📊 Baseado em 1% a 3% em conversão de venda!</p>
                  
                  <div className="space-y-1.5">
                    <p className="text-white text-sm font-semibold">
                      <span className="bg-white/20 px-2 py-1 rounded">Comissão mínima:</span> R$ 20,00 por Cupom utilizado
                    </p>
                    
                    <p className="text-white text-sm font-semibold">
                      <span className="bg-white/20 px-2 py-1 rounded">Comissão máxima:</span> Sem limite! Quanto mais itens na compra, maior sua comissão.
                    </p>
                    
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-white text-xs font-bold mb-2">💡 Exemplo prático de ganhos:</p>
                      <div className="space-y-1 text-green-100 text-xs">
                        <p>• 1 UN = <span className="text-white font-bold">R$ 20,00</span></p>
                        <p>• 2 UN = <span className="text-white font-bold">R$ 25,00</span></p>
                        <p>• 3 UN = <span className="text-white font-bold">R$ 30,00</span></p>
                        <p className="text-yellow-200 font-semibold mt-2">E assim por diante! 🚀</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <a
                  href="#cadastro"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-black text-white bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 group"
                >
                  <span className="flex items-center gap-2">
                    🚀 COMEÇAR AGORA
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios - com imagem de fundo - VERSÃO MOBILE OTIMIZADA */}
        <section 
          className="w-full relative overflow-hidden hero-bg-section"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div id="beneficios" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
            
            {/* Título - Mobile First */}
            <div className="text-center relative mb-8 sm:mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent blur-2xl animate-pulse" />
              
              <h2 className="relative text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight">
                <span className="block bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent drop-shadow-2xl animate-[float_4s_ease-in-out_infinite] leading-tight">
                  Por que se tornar
                </span>
                <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl animate-[float_4s_ease-in-out_infinite_0.3s] leading-tight mt-1 sm:mt-2">
                  um parceiro?
                </span>
              </h2>
              
              <p className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl text-white/80 font-medium animate-[fadeInUp_1s_ease-out_0.8s_both] px-4">
                Descubra as vantagens exclusivas que vão transformar sua <span className="text-orange-400 font-bold">INFLUÊNCIA EM RENDA</span>
              </p>
              
              <div className="flex justify-center mt-4 sm:mt-6">
                <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Layout Mobile First */}
            <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">
              
              {/* Seção LOW 369 - Mobile Otimizada */}
              <div className="flex items-center justify-center lg:justify-start order-2 lg:order-1">
                <div className="relative w-full max-w-sm lg:max-w-none">
                  <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-orange-600/30 via-yellow-500/20 to-orange-600/30 rounded-3xl blur-xl animate-pulse" />
                  
                  <div className="relative text-white text-center lg:text-left">
                    {/* Logo Mobile */}
                    <div className="text-4xl sm:text-5xl lg:text-8xl font-black tracking-wider mb-4 sm:mb-6 relative">
                      <span className="block leading-none bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent drop-shadow-2xl animate-[float_3s_ease-in-out_infinite]">
                        LOW
                      </span>
                      <span className="block leading-none bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl animate-[float_3s_ease-in-out_infinite_0.5s]">
                        369
                      </span>
                    </div>
                    
                    {/* Subtítulo Mobile */}
                    <div className="text-lg sm:text-xl lg:text-4xl font-bold mb-6 sm:mb-8 relative">
                      <span className="block text-white/90 drop-shadow-lg">LOJA</span>
                      <span className="block bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg animate-[float_2s_ease-in-out_infinite]">
                        OFICIAL
                      </span>
                    </div>
                    
                    {/* Botão Mobile */}
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-full blur-md animate-pulse opacity-75" />
                      
                      <a
                        href="#cadastro"
                        className="relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 group overflow-hidden w-full sm:w-auto"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          ✨ Quero participar
                          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </span>
                        
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:animate-[shine_0.75s] group-hover:opacity-100" />
                      </a>
                    </div>
                    
                    <p className="text-white/70 text-sm sm:text-base animate-[fadeInUp_1s_ease-out_0.5s_both]">
                      Transforme sua audiência em renda extra
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Carrossel Mobile Otimizado */}
              <div className="relative flex flex-col items-center order-1 lg:order-2">
                <div className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl">
                  <div className="overflow-hidden rounded-2xl">
                    <div
                      ref={trackRef}
                      onScroll={onScroll}
                      className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar"
                    >
                      {benefits.map((b, i) => (
                        <div key={i} className="snap-center shrink-0 w-full px-1 sm:px-2">
                          <div className="bg-white text-gray-800 p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-orange-200 mx-1 sm:mx-2 min-h-[180px] sm:min-h-[200px] flex flex-col justify-center">
                            <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-orange-600 font-bold text-xs sm:text-sm">✓</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 leading-tight">{b.title}</h3>
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">{b.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Indicadores - Apenas visualização */}
                <div className="mt-6 sm:mt-8 flex items-center justify-center w-full">
                  <div className="flex gap-2 sm:gap-3">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all duration-300 ${
                          i === page 
                            ? "bg-orange-500 shadow-lg w-8 sm:w-10" 
                            : "bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
          
          <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 grid gap-16">
            <div className="text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent blur-2xl animate-pulse" />
              
              <h2 className="relative text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                <span className="block bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]">
                  Como funciona
                </span>
                <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl animate-[float_4s_ease-in-out_infinite_0.3s] text-2xl sm:text-3xl lg:text-4xl mt-2">
                  o programa?
                </span>
              </h2>
              
              <div className="flex justify-center mt-6">
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              
              <p className="mt-6 text-lg sm:text-xl text-white/80 animate-[fadeInUp_1s_ease-out_0.8s_both]">
                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent font-semibold">3 passos simples</span> para transformar sua influência em{" "}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-bold">renda garantida</span>
              </p>
            </div>
            
            <ol className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  n: "1", 
                  t: "Cadastro rápido e fácil", 
                  d: "Preencha o formulário com seus dados e links de redes sociais.",
                  icon: "📝",
                  color: "from-blue-500 to-cyan-500"
                },
                { 
                  n: "2", 
                  t: "Aguarde a análise", 
                  d: "Retornamos em até 3 dias úteis com aprovação e orientações.",
                  icon: "⏱️",
                  color: "from-purple-500 to-pink-500"
                },
                { 
                  n: "3", 
                  t: "Receba seu CUPOM", 
                  d: "Enviamos seu cupom de parceiro e todas as orientações para começar.",
                  icon: "🎁",
                  color: "from-orange-500 to-yellow-500"
                },
              ].map((s, index) => (
                <li 
                  key={s.n} 
                  className="relative group animate-[fadeInUp_1s_ease-out_both]"
                  style={{ animationDelay: `${index * 0.2 + 1}s` }}
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${s.color} rounded-3xl blur opacity-25 group-hover:opacity-50 transition-opacity duration-300`} />
                  
                  <div className="relative bg-white text-gray-900 rounded-3xl p-8 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${s.color} text-white flex items-center justify-center text-xl font-black shadow-lg`}>
                        {s.n}
                      </div>
                      <div className="text-3xl">{s.icon}</div>
                    </div>
                    
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 leading-tight">
                      {s.t}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {s.d}
                    </p>
                    
                    <div className={`mt-6 h-1 bg-gradient-to-r ${s.color} rounded-full`} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* O que você recebe - com designs ilustrativos */}
        <section id="recebe" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-orange-50 to-yellow-50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-200/30 via-transparent to-transparent" />
          
          <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 grid gap-16">
            <div className="text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/20 to-transparent blur-2xl animate-pulse" />
              
              <h2 className="relative text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                <span className="block bg-gradient-to-r from-gray-800 via-orange-600 to-gray-800 bg-clip-text text-transparent drop-shadow-lg animate-[float_4s_ease-in-out_infinite]">
                  O que você
                </span>
                <span className="block bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 bg-clip-text text-transparent drop-shadow-lg animate-[float_4s_ease-in-out_infinite_0.3s] mt-2">
                  recebe?
                </span>
              </h2>
              
              <div className="flex justify-center mt-6">
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              
              <p className="mt-6 text-lg sm:text-xl text-gray-700 animate-[fadeInUp_1s_ease-out_0.8s_both]">
                <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent font-semibold">Benefícios exclusivos</span> para parceiros que 
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">maximizam seus resultados</span>
              </p>
            </div>
            
            {/* Cards com suas imagens personalizadas */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  t: "Cupom exclusivo", 
                  d: "Um cupom único para divulgar e gerar comissões em cada venda.",
                  bgColor: "from-purple-600 to-indigo-600",
                  image: "/cupom-novo.png"
                },
                { 
                  t: "Kit de boas-vindas", 
                  d: "Materiais e instruções personalizadas para começar do jeito certo.",
                  bgColor: "from-orange-600 to-yellow-600",
                  image: "/kit-novo.png"
                },
                { 
                  t: "Regulamento completo", 
                  d: "Transparência total sobre regras e pagamento de comissões garantidas.",
                  bgColor: "from-green-600 to-emerald-600",
                  image: "/forms-novo.png"
                },
                { 
                  t: "Grupo de afiliados personalizado", 
                  d: "Grupo para debater estratégias comprovadas e maximizar sua confiança gerando mais resultados.",
                  bgColor: "from-pink-600 to-rose-600",
                  image: "/forms-novo.png"
                },
              ].map((c, i) => (
                <div 
                  key={i} 
                  className="relative group animate-[fadeInUp_1s_ease-out_both]"
                  style={{ animationDelay: `${i * 0.15 + 1}s` }}
                >
                  <div className="relative bg-white rounded-3xl shadow-2xl group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100">
                    
                    {/* Área da imagem preenchendo todo o espaço */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center p-3">
          <Image
                        src={c.image}
                        alt={c.t}
                        width={240}
                        height={240}
                        className="object-contain max-w-full max-h-full"
                      />
                    </div>
                    
                    {/* Content area */}
                    <div className="p-6 text-center">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 leading-tight">
                        {c.t}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                        {c.d}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Depoimentos - Carrossel Infinito */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
          
          {/* Partículas flutuantes laranja - APENAS NO DESKTOP */}
          <div className="absolute inset-0 overflow-hidden hidden lg:block">
            {/* Lado esquerdo */}
            <div className="absolute w-4 h-4 bg-orange-400/60 rounded-full animate-[float_7s_ease-in-out_infinite] top-20 left-[5%]" />
            <div className="absolute w-2 h-2 bg-yellow-400/70 rounded-full animate-[float_5s_ease-in-out_infinite_1s] top-40 left-[8%]" />
            <div className="absolute w-6 h-6 bg-orange-300/40 rounded-full animate-[float_9s_ease-in-out_infinite_2s] top-60 left-[3%]" />
            <div className="absolute w-3 h-3 bg-orange-500/50 rounded-full animate-[float_6s_ease-in-out_infinite_3s] bottom-40 left-[6%]" />
            <div className="absolute w-5 h-5 bg-yellow-300/60 rounded-full animate-[float_8s_ease-in-out_infinite_1.5s] bottom-20 left-[4%]" />
            
            {/* Lado direito */}
            <div className="absolute w-4 h-4 bg-orange-400/60 rounded-full animate-[float_6s_ease-in-out_infinite_0.5s] top-20 right-[5%]" />
            <div className="absolute w-3 h-3 bg-yellow-400/70 rounded-full animate-[float_7s_ease-in-out_infinite_2s] top-40 right-[8%]" />
            <div className="absolute w-5 h-5 bg-orange-300/50 rounded-full animate-[float_8s_ease-in-out_infinite] top-60 right-[3%]" />
            <div className="absolute w-2 h-2 bg-orange-500/60 rounded-full animate-[float_5s_ease-in-out_infinite_2.5s] bottom-40 right-[6%]" />
            <div className="absolute w-4 h-4 bg-yellow-300/50 rounded-full animate-[float_9s_ease-in-out_infinite_1s] bottom-20 right-[4%]" />
            
            {/* Partículas roxas originais - mais sutis */}
            <div className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-[float_7s_ease-in-out_infinite] top-20 left-[15%]" />
            <div className="absolute w-1 h-1 bg-pink-400/40 rounded-full animate-[float_5s_ease-in-out_infinite_1s] top-32 right-[15%]" />
            <div className="absolute w-3 h-3 bg-purple-300/20 rounded-full animate-[float_9s_ease-in-out_infinite_2s] bottom-32 left-[20%]" />
          </div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-6 mb-16">
            <div className="text-center">
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-4">
                <span className="block bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  Últimos
                </span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-300 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl mt-2">
                  cadastros realizados
                </span>
              </h2>
              <p className="mt-6 text-lg sm:text-xl text-white/80 font-medium">
                Junte-se aos <span className="text-orange-400 font-bold">novos parceiros</span> que já garantiram sua vaga 🚀
              </p>
            </div>
          </div>
          
          {/* Carrossel Infinito */}
          <div className="relative">
            <div className="overflow-hidden md:mask-gradient">
              <div className="flex animate-[scroll_5s_linear_infinite] md:animate-[scroll_20s_linear_infinite] hover:pause will-change-transform">
                {[
                  {
                    nome: "Lucas T.",
                    cidade: "Florianópolis",
                    estado: "SC",
                    foto: "/rafael.jpg",
                    nicho: "Instagram - CARROS REBAIXADOS",
                    seguidores: "47k",
                    tempo: "Cadastro recente"
                  },
                  {
                    nome: "Carlos M.",
                    cidade: "São Paulo",
                    estado: "SP",
                    foto: "/marcelo.jpg",
                    nicho: "TikTok - LIFESTYLE AUTOMOTIVO",
                    seguidores: "8k",
                    tempo: "Cadastro recente"
                  },
                  {
                    nome: "Beatriz F.",
                    cidade: "Goiânia",
                    estado: "GO",
                    foto: "/Beatriz.jpg",
                    nicho: "Instagram - Moto 244",
                    seguidores: "371k",
                    tempo: "Cadastro recente"
                  },
                  {
                    nome: "Marina S.",
                    cidade: "Rio de Janeiro",
                    estado: "RJ",
                    foto: "/marina.avif",
                    nicho: "TikTok - MOTOS E MANOBRAS",
                    seguidores: "32k",
                    tempo: "Cadastro recente"
                  },
                  {
                    nome: "Rodrigo A.",
                    cidade: "Recife",
                    estado: "PE",
                    foto: "/diogo.jpg",
                    nicho: "YouTube - CARROS TUNADOS",
                    seguidores: "3.8k",
                    tempo: "Cadastro recente"
                  },
                  // Duplicar para efeito infinito
                  {
                    nome: "Lucas T.",
                    cidade: "Florianópolis",
                    estado: "SC",
                    foto: "/rafael.jpg",
                    nicho: "Instagram - CARROS REBAIXADOS",
                    seguidores: "47k",
                    tempo: "Cadastro recente"
                  },
                  {
                    nome: "Carlos M.",
                    cidade: "São Paulo",
                    estado: "SP",
                    foto: "/marcelo.jpg",
                    nicho: "TikTok - LIFESTYLE AUTOMOTIVO",
                    seguidores: "8k",
                    tempo: "Cadastro recente"
                  },
                  {
                    nome: "Beatriz F.",
                    cidade: "Goiânia",
                    estado: "GO",
                    foto: "/Beatriz.jpg",
                    nicho: "Instagram - Moto 244",
                    seguidores: "371k",
                    tempo: "Cadastro recente"
                  },
                  {
                    nome: "Marina S.",
                    cidade: "Rio de Janeiro",
                    estado: "RJ",
                    foto: "/marina.avif",
                    nicho: "TikTok - MOTOS E MANOBRAS",
                    seguidores: "32k",
                    tempo: "Cadastro recente"
                  },
                  {
                    nome: "Rodrigo A.",
                    cidade: "Recife",
                    estado: "PE",
                    foto: "/diogo.jpg",
                    nicho: "YouTube - CARROS TUNADOS",
                    seguidores: "3.8k",
                    tempo: "Cadastro recente"
                  },
                ].map((cadastro, i) => (
                  <div key={i} className="flex-shrink-0 w-[350px] lg:w-[420px] mx-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl h-full hover:scale-105 hover:shadow-orange-500/50 transition-all duration-500 hover:border-orange-400/50">
                      {/* Cabeçalho */}
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-orange-400/50 shadow-lg flex-shrink-0">
                          <Image
                            src={cadastro.foto}
                            alt={cadastro.nome}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg">{cadastro.nome}</h3>
                          <p className="text-purple-200 text-sm">{cadastro.cidade}, {cadastro.estado}</p>
                        </div>
                        <div className="bg-green-500/20 border border-green-400/50 rounded-full px-3 py-1">
                          <span className="text-green-300 text-xs font-bold">✓ ATIVO</span>
                        </div>
                      </div>
                      
                      {/* Info do nicho */}
                      <div className="mb-4 bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">📱</span>
                          <span className="text-orange-300 font-bold text-sm">{cadastro.nicho}</span>
                        </div>
                        <p className="text-white/70 text-sm">
                          <span className="text-white font-bold">{cadastro.seguidores}</span> seguidores
                        </p>
                      </div>
                      
                      {/* Tempo de cadastro */}
                      <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 px-4 py-2.5 rounded-full">
                        <span className="text-lg">🕐</span>
                        <span className="text-orange-300 font-bold text-sm">Cadastrado {cadastro.tempo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
          
          {/* Partículas flutuantes laranja - APENAS NO DESKTOP */}
          <div className="absolute inset-0 overflow-hidden hidden lg:block">
            {/* Lado esquerdo */}
            <div className="absolute w-5 h-5 bg-orange-400/70 rounded-full animate-[float_6s_ease-in-out_infinite] top-24 left-[4%]" />
            <div className="absolute w-3 h-3 bg-yellow-400/80 rounded-full animate-[float_7s_ease-in-out_infinite_1s] top-48 left-[7%]" />
            <div className="absolute w-7 h-7 bg-orange-300/50 rounded-full animate-[float_8s_ease-in-out_infinite_2s] top-72 left-[2%]" />
            <div className="absolute w-4 h-4 bg-orange-500/60 rounded-full animate-[float_5s_ease-in-out_infinite_3s] bottom-48 left-[5%]" />
            <div className="absolute w-6 h-6 bg-yellow-300/70 rounded-full animate-[float_9s_ease-in-out_infinite_1.5s] bottom-24 left-[3%]" />
            <div className="absolute w-2 h-2 bg-orange-400/60 rounded-full animate-[float_6s_ease-in-out_infinite_2.5s] top-96 left-[6%]" />
            
            {/* Lado direito */}
            <div className="absolute w-5 h-5 bg-orange-400/70 rounded-full animate-[float_7s_ease-in-out_infinite_0.5s] top-24 right-[4%]" />
            <div className="absolute w-4 h-4 bg-yellow-400/80 rounded-full animate-[float_6s_ease-in-out_infinite_2s] top-48 right-[7%]" />
            <div className="absolute w-6 h-6 bg-orange-300/60 rounded-full animate-[float_9s_ease-in-out_infinite] top-72 right-[2%]" />
            <div className="absolute w-3 h-3 bg-orange-500/70 rounded-full animate-[float_5s_ease-in-out_infinite_2.5s] bottom-48 right-[5%]" />
            <div className="absolute w-5 h-5 bg-yellow-300/60 rounded-full animate-[float_8s_ease-in-out_infinite_1s] bottom-24 right-[3%]" />
            <div className="absolute w-2 h-2 bg-orange-400/50 rounded-full animate-[float_7s_ease-in-out_infinite_3s] top-96 right-[6%]" />
          </div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 grid gap-16">
            <div className="text-center relative">
              <h2 className="relative text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight">
                <span className="block bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]">
                  Perguntas
                </span>
                <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl animate-[float_4s_ease-in-out_infinite_0.3s] mt-4">
                  frequentes
                </span>
              </h2>
              
              <p className="mt-8 text-xl sm:text-2xl lg:text-3xl text-white/80 animate-[fadeInUp_1s_ease-out_0.8s_both]">
                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent font-semibold">Tire suas dúvidas</span> e descubra tudo sobre o nosso 
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-bold">programa de parceiros</span>
              </p>
            </div>
            
            <div className="grid gap-6 max-w-4xl lg:max-w-6xl mx-auto w-full">
              {[
                { q: "Quanto ganho por venda?", a: "Pagamos comissão por cada venda gerada com seu cupom exclusivo." },
                { q: "Quando recebo?", a: "Pagamentos mensais conforme regulamento enviado após aprovação." },
                { q: "Quem pode participar?", a: "Criadores com presença ativa em redes sociais, blogs ou portais." },
                { q: "Preciso pagar algo?", a: "Não. A participação é 100% gratuita, sem taxas ou mensalidades." },
                { q: "Tenho algum tipo de meta?", a: "Os afiliados tem como meta mínima fazer com que o seu cupom seja utilizado no mínimo 5 vezes em 30 dias, ou a sua vaga de afiliado será disponibilizada para outro afiliado de forma automática." },
                { q: "Qual o ticket médio das camisetas?", a: "O ticket médio é de R$ 100, com produtos de alta qualidade que convertem muito bem." },
                { q: "Vocês fazem o envio?", a: "Sim! Cuidamos de toda a logística. Você só divulga, nós cuidamos de todos os processos." },
                { q: "Preciso ter estoque?", a: "Não! Você não precisa investir em estoque. Trabalhamos com dropshipping completo." },
                { q: "Como funciona o suporte?", a: "Suporte dedicado via WhatsApp e materiais exclusivos para maximizar suas vendas." },
              ].map((f, i) => (
                <details 
                  key={i} 
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-[1.02] hover:border-orange-200"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <summary className="cursor-pointer p-6 lg:p-10 text-lg lg:text-2xl font-bold text-gray-900 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-300 flex items-center justify-between">
                    <span>{f.q}</span>
                    <span className="text-orange-500 text-2xl lg:text-3xl">→</span>
                  </summary>
                  <div className="px-6 lg:px-10 pb-6 lg:pb-10 bg-gradient-to-br from-gray-50 to-orange-50/30">
                    <p className="text-gray-700 leading-relaxed text-base lg:text-xl font-medium">
                      {f.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Cadastro */}
        <section id="cadastro" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-orange-50 to-yellow-50" />
          
          <div className="relative z-10 mx-auto max-w-4xl px-6 py-20">
            <div className="text-center relative mb-16">
              <h2 className="relative text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                <span className="block bg-gradient-to-r from-gray-800 via-orange-600 to-gray-800 bg-clip-text text-transparent drop-shadow-lg animate-[float_4s_ease-in-out_infinite]">
                  Cadastre-se
                </span>
                <span className="block bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 bg-clip-text text-transparent drop-shadow-lg animate-[float_4s_ease-in-out_infinite_0.3s] mt-2">
                  agora 👇
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-700 font-medium">
                <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent font-semibold">Menos de 1 minuto</span> para garantir seu acesso
              </p>
            </div>
            
            <div className="relative">
              <form
                className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-orange-200/50"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  setSubmitMessage('');

                  try {
                    const form = e.currentTarget as HTMLFormElement;
                    const data = new FormData(form);
                    
                    // Validações
                    const rede1 = data.get('rede1');
                    const link1 = data.get('link1');
                    const seguidores1 = data.get('seguidores1');
                    const rede2 = data.get('rede2');
                    const link2 = data.get('link2');
                    const seguidores2 = data.get('seguidores2');
                    const rede3 = data.get('rede3');
                    const link3 = data.get('link3');
                    const seguidores3 = data.get('seguidores3');
                    const audiencia = data.get('audiencia');
                    const nicho = data.get('nicho');
                    
                    // Validar que pelo menos 1 rede social foi preenchida
                    if (!rede1 && !rede2 && !rede3) {
                      setSubmitMessage('❌ Por favor, preencha pelo menos 1 rede social.');
                      setIsSubmitting(false);
                      return;
                    }
                    
                    // Validar seguidores se a rede foi preenchida
                    if (rede1 && link1 && !seguidores1) {
                      setSubmitMessage('❌ Por favor, preencha a quantidade de seguidores da primeira rede social.');
                      setIsSubmitting(false);
                      return;
                    }
                    
                    if (rede2 && link2 && !seguidores2) {
                      setSubmitMessage('❌ Por favor, preencha a quantidade de seguidores da segunda rede social.');
                      setIsSubmitting(false);
                      return;
                    }
                    
                    if (rede3 && link3 && !seguidores3) {
                      setSubmitMessage('❌ Por favor, preencha a quantidade de seguidores da terceira rede social.');
                      setIsSubmitting(false);
                      return;
                    }
                    
                    // Validar audiência e nicho
                    if (!audiencia) {
                      setSubmitMessage('❌ Por favor, preencha o tamanho da audiência (visualizações story).');
                      setIsSubmitting(false);
                      return;
                    }
                    
                    if (!nicho) {
                      setSubmitMessage('❌ Por favor, preencha o nicho principal.');
                      setIsSubmitting(false);
                      return;
                    }
                    
                    const leadData = {
                      nome: String(data.get('nome') || ''),
                      email: String(data.get('email') || ''),
                      whatsapp: String(data.get('whatsapp') || ''),
                      cidade: String(data.get('cidade') || ''),
                      estado: String(data.get('estado') || ''),
                      redesSociais: {
                        ...(data.get('rede1') && data.get('link1') && {
                          [String(data.get('rede1'))]: {
                            link: String(data.get('link1')),
                            seguidores: String(data.get('seguidores1') || '')
                          }
                        }),
                        ...(data.get('rede2') && data.get('link2') && {
                          [String(data.get('rede2'))]: {
                            link: String(data.get('link2')),
                            seguidores: String(data.get('seguidores2') || '')
                          }
                        }),
                        ...(data.get('rede3') && data.get('link3') && {
                          [String(data.get('rede3'))]: {
                            link: String(data.get('link3')),
                            seguidores: String(data.get('seguidores3') || '')
                          }
                        }),
                      },
                      audiencia: String(data.get('audiencia') || ''),
                      nicho: String(data.get('nicho') || ''),
                      timestamp: serverTimestamp(),
                      status: 'novo'
                    };

                    await addDoc(collection(db, 'leads'), leadData);
                    
                    setSubmitMessage('✅ Cadastro realizado com sucesso! Entraremos em contato em breve.');
                    form.reset();
                    
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                  } catch (error) {
                    console.error('Erro ao cadastrar:', error);
                    setSubmitMessage('❌ Erro ao enviar cadastro. Tente novamente.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                <div className="grid gap-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="nome">
                        <span className="text-orange-500">👤</span> Nome completo
                      </label>
                      <input 
                        id="nome" 
                        name="nome" 
                        required 
                        className="w-full h-12 rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 text-gray-800 font-medium placeholder-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-400/20 transition-all duration-300" 
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="email">
                        <span className="text-blue-500">📧</span> E-mail
                      </label>
                      <input 
                        id="email" 
                        name="email" 
                        type="email" 
                        required 
                        className="w-full h-12 rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 text-gray-800 font-medium placeholder-gray-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-400/20 transition-all duration-300" 
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="whatsapp">
                        <span className="text-green-500">📱</span> WhatsApp
                      </label>
                      <input 
                        id="whatsapp" 
                        name="whatsapp" 
                        placeholder="(00) 00000-0000" 
                        className="w-full h-12 rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 text-gray-800 font-medium placeholder-gray-400 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-400/20 transition-all duration-300" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="cidade">
                          <span className="text-blue-500">🏙️</span> Cidade
                        </label>
                        <input 
                          id="cidade" 
                          name="cidade" 
                          placeholder="Sua cidade" 
                          required 
                          className="w-full h-12 rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 text-gray-800 font-medium placeholder-gray-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-400/20 transition-all duration-300" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="estado">
                          <span className="text-indigo-500">📍</span> Estado
                        </label>
                        <select 
                          id="estado" 
                          name="estado" 
                          required 
                          className="w-full h-12 rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 text-gray-800 font-medium focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-400/20 transition-all duration-300"
                        >
                          <option value="">UF</option>
                          <option value="AC">AC</option>
                          <option value="AL">AL</option>
                          <option value="AP">AP</option>
                          <option value="AM">AM</option>
                          <option value="BA">BA</option>
                          <option value="CE">CE</option>
                          <option value="DF">DF</option>
                          <option value="ES">ES</option>
                          <option value="GO">GO</option>
                          <option value="MA">MA</option>
                          <option value="MT">MT</option>
                          <option value="MS">MS</option>
                          <option value="MG">MG</option>
                          <option value="PA">PA</option>
                          <option value="PB">PB</option>
                          <option value="PR">PR</option>
                          <option value="PE">PE</option>
                          <option value="PI">PI</option>
                          <option value="RJ">RJ</option>
                          <option value="RN">RN</option>
                          <option value="RS">RS</option>
                          <option value="RO">RO</option>
                          <option value="RR">RR</option>
                          <option value="SC">SC</option>
                          <option value="SP">SP</option>
                          <option value="SE">SE</option>
                          <option value="TO">TO</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Redes Sociais */}
                  <div className="space-y-4 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-purple-600">📱</span> Suas Redes Sociais
                      <span className="text-xs font-normal text-gray-500">(escolha de 1 a 3)</span>
                    </h3>
                    
                    {/* Rede Social 1 */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-3">
                        <select 
                          name="rede1" 
                          className="h-12 rounded-2xl border-2 border-purple-200 bg-white px-4 text-gray-800 font-medium focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300"
                        >
                          <option value="">Selecione</option>
                          <option value="Instagram">📸 Instagram</option>
                          <option value="Facebook">👥 Facebook</option>
                          <option value="TikTok">🎵 TikTok</option>
                        </select>
                        <input 
                          name="link1" 
                          placeholder="@seuperfil ou URL" 
                          className="col-span-2 h-12 rounded-2xl border-2 border-purple-200 bg-white px-4 text-gray-800 font-medium placeholder-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-purple-700 font-semibold ml-1 mb-1 block">
                          👥 Quantidade de seguidores desta rede
                        </label>
                        <input 
                          name="seguidores1" 
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9.,kKmM]*"
                          placeholder="Ex: 5k, 1.2k, 25k seguidores" 
                          className="w-full h-12 rounded-2xl border-2 border-purple-200 bg-white px-4 text-gray-800 font-medium placeholder-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300"
                          title="Use apenas números. Ex: 5k, 1.2k, 25000"
                        />
                      </div>
                    </div>
                    
                    {/* Rede Social 2 */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-3">
                        <select 
                          name="rede2" 
                          className="h-12 rounded-2xl border-2 border-purple-200 bg-white px-4 text-gray-800 font-medium focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300"
                        >
                          <option value="">Selecione</option>
                          <option value="Instagram">📸 Instagram</option>
                          <option value="Facebook">👥 Facebook</option>
                          <option value="TikTok">🎵 TikTok</option>
                        </select>
                        <input 
                          name="link2" 
                          placeholder="@seuperfil ou URL" 
                          className="col-span-2 h-12 rounded-2xl border-2 border-purple-200 bg-white px-4 text-gray-800 font-medium placeholder-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-purple-700 font-semibold ml-1 mb-1 block">
                          👥 Quantidade de seguidores desta rede
                        </label>
                        <input 
                          name="seguidores2" 
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9.,kKmM]*"
                          placeholder="Ex: 5k, 1.2k, 25k seguidores" 
                          className="w-full h-12 rounded-2xl border-2 border-purple-200 bg-white px-4 text-gray-800 font-medium placeholder-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300"
                          title="Use apenas números. Ex: 5k, 1.2k, 25000"
                        />
                      </div>
                    </div>
                    
                    {/* Rede Social 3 */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-3">
                        <select 
                          name="rede3" 
                          className="h-12 rounded-2xl border-2 border-purple-200 bg-white px-4 text-gray-800 font-medium focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300"
                        >
                          <option value="">Selecione</option>
                          <option value="Instagram">📸 Instagram</option>
                          <option value="Facebook">👥 Facebook</option>
                          <option value="TikTok">🎵 TikTok</option>
                        </select>
                        <input 
                          name="link3" 
                          placeholder="@seuperfil ou URL" 
                          className="col-span-2 h-12 rounded-2xl border-2 border-purple-200 bg-white px-4 text-gray-800 font-medium placeholder-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-purple-700 font-semibold ml-1 mb-1 block">
                          👥 Quantidade de seguidores desta rede
                        </label>
                        <input 
                          name="seguidores3" 
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9.,kKmM]*"
                          placeholder="Ex: 5k, 1.2k, 25k seguidores" 
                          className="w-full h-12 rounded-2xl border-2 border-purple-200 bg-white px-4 text-gray-800 font-medium placeholder-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300"
                          title="Use apenas números. Ex: 5k, 1.2k, 25000"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="audiencia">
                        <span className="text-cyan-500">📊</span> Tamanho da audiência
                      </label>
                      <div>
                        <label className="text-xs text-cyan-700 font-semibold ml-1 mb-1 block">
                          📈 Visualização story diária de todas as redes juntas
                        </label>
                        <input 
                          id="audiencia" 
                          name="audiencia" 
                          required
                          placeholder="Ex: 25k seguidores, 10k visualizações" 
                          className="w-full h-12 rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 text-gray-800 font-medium placeholder-gray-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/20 transition-all duration-300" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="nicho">
                        <span className="text-pink-500">🎯</span> Nicho principal
                      </label>
                      <input 
                        id="nicho" 
                        name="nicho" 
                        required
                        placeholder="Ex: motos, JDM, streetwear, lifestyle" 
                        className="w-full h-12 rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 text-gray-800 font-medium placeholder-gray-400 focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-400/20 transition-all duration-300" 
                      />
                    </div>
                  </div>
                  
                  {/* Mensagem de feedback */}
                  {submitMessage && (
                    <div className={`mb-6 p-4 rounded-2xl text-center font-bold ${
                      submitMessage.includes('✅') 
                        ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                        : 'bg-red-100 text-red-800 border-2 border-red-300'
                    }`}>
                      {submitMessage}
                    </div>
                  )}
                  
                  <div className="mt-8 text-center">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-full blur-lg animate-pulse opacity-75" />
                      
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-2 group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <span className="relative z-10 flex items-center gap-3 animate-[float_4s_ease-in-out_infinite]">
                          {isSubmitting ? (
                            <>
                              ⏳ Enviando...
                            </>
                          ) : (
                            <>
                              🚀 Enviar cadastro
                              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </>
                          )}
                        </span>
                        
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:animate-[shine_0.75s] group-hover:opacity-100" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-foreground/70 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} LOW369 — Todos os direitos reservados.</span>
            <a href="/admin" className="text-foreground/30 hover:text-foreground/50 transition-colors text-[10px]">v1.0</a>
          </div>
          <a href="https://reserva.ink/low369" target="_blank" rel="noopener noreferrer" className="hover:underline">Loja</a>
        </div>
      </footer>
    </div>
    </>
  );
}
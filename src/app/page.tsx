import { ExpertiseDeployment } from '@/components/Expertise';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';
import { WaveBanner } from '@/components/WaveBanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-secondaire selection:text-background">
      <Header />
      <main>
        <WaveBanner />

        {/* The Animated Deployment Section */}
        <ExpertiseDeployment />

        {/* Impact Stats */}
        <section className="py-40 bg-background text-center px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-12 bg-principale/10 rounded-[3rem] border border-white/5 hover:border-secondaire/20 transition-colors group">
              <span className="block text-6xl font-black text-secondaire mb-4 group-hover:scale-110 transition-transform">150+</span>
              <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black">Réalisations Uniques</span>
            </div>
            <div className="p-12 bg-principale/10 rounded-[3rem] border border-white/5 hover:border-secondaire/20 transition-colors group">
              <span className="block text-6xl font-black text-white mb-4 group-hover:scale-110 transition-transform">12</span>
              <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black">Spécialistes Seniors</span>
            </div>
            <div className="p-12 bg-principale/10 rounded-[3rem] border border-white/5 hover:border-secondaire/20 transition-colors group">
              <span className="block text-6xl font-black text-secondaire mb-4 group-hover:scale-110 transition-transform">100%</span>
              <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black">Focus Performance</span>
            </div>
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}

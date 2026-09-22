import { ArrowUpRight } from 'lucide-react';
import { Media } from './media';

export function Hero() {
  return (
    <section className="tl-hero" id="hero">
      <div className="tl-rail tl-hero__grille">
        <div className="tl-hero__contenu">
          <p className="tl-sur-titre">Photo, vidéo &amp; campagnes de marque</p>
          <h1>TALAREF<span>Studio.</span></h1>
          <p className="tl-hero__promesse">Vos idées méritent des images qui comptent.</p>
          <p className="tl-lead">Un événement à faire vivre. Une histoire à raconter. Une marque à faire grandir. On imagine, on tourne, on livre.</p>
          <div className="tl-hero__actions">
            <a className="tl-btn tl-btn--lime" href="#rdv">Parlons de votre projet <ArrowUpRight size={18} aria-hidden="true" /></a>
            <a className="tl-btn tl-btn--fil" href="#cas">Nos réalisations</a>
          </div>
          <p className="tl-hero__note">Appel découverte gratuit · 20 minutes · Sans engagement</p>
        </div>

        <div className="tl-mosaique">
          <Media ratio="169" src="/images/home/denza-eiffel-opera.jpg" alt="Invitée en noir posant devant la DENZA Z9 GT et l'Opéra Garnier" />
          <Media ratio="11" src="/images/home/philipp-plein-pogba.jpg" alt="Paul Pogba lors de la soirée Philipp Plein à Cannes" />
          <Media ratio="11" src="/images/home/psg-champions-starligue.jpg" alt="L'équipe de handball du PSG sacrée championne de LNH Starligue" />
        </div>
      </div>
    </section>
  );
}

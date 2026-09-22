'use client';

import { useRef, useState } from 'react';
import { ArrowUpRight, CheckCircle2, LoaderCircle, Phone } from 'lucide-react';

export function AppelFinal() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const submitting = useRef(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    submitting.current = true;
    setStatus('loading');
    setError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'), email: data.get('email'), service: data.get('service'),
          message: `Demande d'appel découverte\nTéléphone : ${data.get('phone') || 'Non renseigné'}\n\n${data.get('message')}`,
        }),
      });
      if (!response.ok) throw new Error("Votre demande n'a pas pu être envoyée. Réessayez ou contactez-nous par téléphone.");
      setStatus('success');
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "L'envoi a échoué. Merci de réessayer.");
      setStatus('error');
    } finally { submitting.current = false; }
  }

  return (
    <section className="tl-bande tl-contact" id="rdv">
      <div className="tl-rail tl-contact__grille" id="contact">
        <div>
          <p className="tl-sur-titre">Votre projet commence ici</p>
          <h2>Dites-nous l&apos;idée.<br />On s&apos;occupe de la suite.</h2>
          <p className="tl-lead">Un appel de vingt minutes pour parler de vos objectifs, de votre budget et de votre calendrier. Gratuit et sans engagement.</p>
          <a className="tl-contact__tel" href="tel:+33635217526"><Phone size={18} aria-hidden="true" />06 35 21 75 26</a>
          <a href="mailto:contact@talaref.co">contact@talaref.co</a>
        </div>
        <div>
          {status === 'success' ? <div className="tl-contact__succes" role="status"><CheckCircle2 size={36} aria-hidden="true" /><h3>Votre demande est envoyée.</h3><p>Nous vous recontacterons pour convenir d&apos;un créneau et parler de votre projet.</p><button className="tl-btn tl-btn--fil" type="button" onClick={() => setStatus('idle')}>Envoyer une autre demande</button></div> :
            <form className="tl-formulaire" onSubmit={submit} aria-busy={status === 'loading'}>
              <div className="tl-formulaire__ligne">
                <label htmlFor="home-name">Votre nom<input id="home-name" name="name" autoComplete="name" required maxLength={120} placeholder="Prénom et nom" /></label>
                <label htmlFor="home-email">Votre e-mail<input id="home-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="vous@entreprise.fr" /></label>
              </div>
              <div className="tl-formulaire__ligne">
                <label htmlFor="home-phone">Téléphone (facultatif)<input id="home-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="06 00 00 00 00" /></label>
                <label htmlFor="home-service">Votre besoin<select id="home-service" name="service" defaultValue="Récap d'événement"><option>Récap d&apos;événement</option><option>Interview</option><option>Campagne &amp; shooting</option><option>Développement Web Performance</option><option>Autre projet</option></select></label>
              </div>
              <label htmlFor="home-message">Quelques mots sur votre projet<textarea id="home-message" name="message" rows={4} required maxLength={5000} placeholder="Votre idée, la date, le lieu, vos disponibilités pour un appel…" /></label>
              {status === 'error' && <p className="tl-formulaire__erreur" role="alert">{error}</p>}
              <button className="tl-btn tl-btn--lime" type="submit" disabled={status === 'loading'}>{status === 'loading' ? <><LoaderCircle className="tl-spin" size={18} aria-hidden="true" />Envoi en cours…</> : <>Demander mon appel gratuit<ArrowUpRight size={18} aria-hidden="true" /></>}</button>
              <p className="tl-mini">Vos coordonnées servent uniquement à vous recontacter au sujet de votre demande.</p>
            </form>}
        </div>
      </div>
    </section>
  );
}

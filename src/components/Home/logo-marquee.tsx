import { CLIENTS } from "@/data/home-projects";

/**
 * Bandeau de logos défilant.
 *
 * La liste est rendue DEUX FOIS : l'animation translate de -50 %,
 * donc la piste doit contenir exactement deux copies pour boucler
 * sans saut visible. La seconde copie est masquée aux lecteurs
 * d'écran, qui n'ont pas à entendre la liste en double.
 */
export function LogoMarquee() {
  return (
    <div className="tl-defile" aria-label="Marques accompagnées">
      <div className="tl-defile__piste">
        {CLIENTS.map((c) => (
          <span key={c}>{c}</span>
        ))}
        {CLIENTS.map((c) => (
          <span key={`bis-${c}`} aria-hidden="true">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}


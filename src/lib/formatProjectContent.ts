/**
 * Le champ `content` d'un projet est injecté tel quel dans la page détail
 * (dangerouslySetInnerHTML). Pour que l'admin reste utilisable sans savoir
 * écrire du HTML : si le texte saisi ne contient aucune balise, on le
 * transforme en paragraphes — sinon on le laisse passer tel quel (HTML
 * avancé toujours possible pour qui veut du sur-mesure).
 */
export function formatProjectContent(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (trimmed.includes("<")) return trimmed;

  const paragraphs = trimmed
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
    .join("\n");

  return `<div class="prose prose-invert">\n${paragraphs}\n</div>`;
}

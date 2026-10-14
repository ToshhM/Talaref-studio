import styles from './ProjectDetail.module.css'

interface StoryHeading {
  id: string
  title: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function createHeadingId(title: string, index: number): string {
  const slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `projet-${slug || 'section'}-${index + 1}`
}

function getHeadingText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .trim()
}

function prepareStory(content: string): { html: string; headings: StoryHeading[]; wordCount: number } {
  const hasHtml = /<\/?[a-z][\s\S]*?>/i.test(content)
  const source = hasHtml
    ? content
    : content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `<p>${escapeHtml(line)}</p>`)
        .join('')

  const headings: StoryHeading[] = []
  const html = source.replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (_match, inner: string) => {
    const title = getHeadingText(inner)
    const id = createHeadingId(title, headings.length)
    headings.push({ id, title })
    return `<h2 id="${id}">${inner}</h2>`
  })
  const wordCount = source.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length

  return { html, headings, wordCount }
}

export default function ProjectStory({ content }: { content: string }) {
  const { html, headings, wordCount } = prepareStory(content)
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <section className={styles.storySection} aria-label="Présentation du projet">
      <div className={styles.storyTexture} aria-hidden="true" />
      <div className={styles.storyLayout}>
        <aside className={styles.storySidebar}>
          <div className={styles.readingTime}>
            <span className={styles.storyEyebrow}>Temps de lecture</span>
            <span className={styles.readingValue}>{readingMinutes} min</span>
            <div className={styles.readingRule} />
          </div>

          <nav className={styles.storyContents} aria-label="Sommaire du projet">
            <span className={styles.storyEyebrow}>Dans ce projet</span>
            <ol>
              {headings.length > 0 ? (
                headings.map((heading, index) => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`}>
                      <span className={styles.storyContentsNumber}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {heading.title}
                    </a>
                  </li>
                ))
              ) : (
                <li>
                  <a href="#projet-contenu">
                    <span className={styles.storyContentsNumber}>01</span>
                    Le projet
                  </a>
                </li>
              )}
            </ol>
          </nav>

          <div className={styles.storyAsideNote}>
            <span className={styles.storyAsideDot} />
            <span>Un projet imaginé et réalisé par TALAREF.</span>
          </div>
        </aside>

        <article className={styles.storyArticle}>
          <div className={styles.storyArticleHeader}>
            <span className={styles.storyEyebrow}>Les coulisses du projet</span>
            <span className={styles.storyIndex}>Étude de cas / TALAREF STUDIO</span>
          </div>
          <div
            id="projet-contenu"
            className={styles.storyContent}
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className={styles.storyEndMark} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </article>
      </div>
    </section>
  )
}

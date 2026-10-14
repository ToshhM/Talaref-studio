"use client";

import { useEffect, useRef } from "react";
import styles from "./RichTextEditor.module.css";

interface RichTextEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

const FONT_SIZES: Record<string, string> = {
  "1": "0.8rem",
  "3": "1rem",
  "5": "1.35rem",
  "7": "1.8rem",
};

export default function RichTextEditor({ initialContent, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);
  const initialContentRef = useRef(initialContent);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = initialContentRef.current;
  }, []);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection?.rangeCount || !editorRef.current?.contains(selection.anchorNode)) return;
    savedSelection.current = selection.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !savedSelection.current || !editorRef.current) return;
    editorRef.current.focus();
    selection.removeAllRanges();
    selection.addRange(savedSelection.current);
  };

  const publishChanges = () => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.querySelectorAll("font[size]").forEach((font) => {
      const size = font.getAttribute("size") || "3";
      const span = document.createElement("span");
      span.style.fontSize = FONT_SIZES[size] || FONT_SIZES["3"];
      span.innerHTML = font.innerHTML;
      font.replaceWith(span);
    });

    onChange(editor.innerHTML);
    saveSelection();
  };

  const format = (command: string, value?: string) => {
    restoreSelection();
    document.execCommand(command, false, value);
    publishChanges();
  };

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar} role="toolbar" aria-label="Mise en forme du texte">
        <button type="button" title="Gras" aria-label="Mettre en gras" onMouseDown={(event) => event.preventDefault()} onClick={() => format("bold")}>
          <strong>B</strong>
        </button>
        <button type="button" title="Souligné" aria-label="Souligner" onMouseDown={(event) => event.preventDefault()} onClick={() => format("underline")}>
          <u>U</u>
        </button>
        <span className={styles.separator} />
        <button type="button" title="Titre de section" aria-label="Appliquer un titre de section" onMouseDown={(event) => event.preventDefault()} onClick={() => format("formatBlock", "h2")}>
          H2
        </button>
        <button type="button" title="Sous-titre" aria-label="Appliquer un sous-titre" onMouseDown={(event) => event.preventDefault()} onClick={() => format("formatBlock", "h3")}>
          H3
        </button>
        <button type="button" title="Paragraphe" aria-label="Appliquer un paragraphe" onMouseDown={(event) => event.preventDefault()} onClick={() => format("formatBlock", "p")}>
          P
        </button>
        <span className={styles.separator} />
        <label className={styles.sizeLabel}>
          Taille
          <select
            aria-label="Taille du texte sélectionné"
            defaultValue="3"
            onMouseDown={saveSelection}
            onChange={(event) => format("fontSize", event.target.value)}
          >
            <option value="1">Petite</option>
            <option value="3">Normale</option>
            <option value="5">Grande</option>
            <option value="7">Très grande</option>
          </select>
        </label>
        <span className={styles.separator} />
        <button type="button" title="Liste à puces" aria-label="Créer une liste à puces" onMouseDown={(event) => event.preventDefault()} onClick={() => format("insertUnorderedList")}>
          • Liste
        </button>
        <button type="button" title="Annuler" aria-label="Annuler" onMouseDown={(event) => event.preventDefault()} onClick={() => format("undo")}>
          ↶
        </button>
        <button type="button" title="Rétablir" aria-label="Rétablir" onMouseDown={(event) => event.preventDefault()} onClick={() => format("redo")}>
          ↷
        </button>
      </div>

      <div
        ref={editorRef}
        className={styles.editable}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Texte détaillé du projet"
        aria-multiline="true"
        data-placeholder="Racontez le contexte, les objectifs, la solution et les résultats du projet…"
        onInput={publishChanges}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onBlur={saveSelection}
        onPaste={(event) => {
          event.preventDefault();
          const text = event.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, text);
          publishChanges();
        }}
      />
      <p className={styles.hint}>Sélectionnez un passage puis appliquez une mise en forme. Les titres H2 alimentent le sommaire de la page projet.</p>
    </div>
  );
}

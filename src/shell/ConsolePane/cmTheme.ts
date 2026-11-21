import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';

export function createBudseiEditorTheme(isDark: boolean): Extension {
  return EditorView.theme(
    {
      '&': {
        color: isDark ? '#e6e6ec' : '#19191d',
        backgroundColor: 'var(--bg-input)',
        fontFamily: "var(--font-mono)",
        fontSize: '12px',
        height: '100%',
      },
      '.cm-content': {
        caretColor: 'var(--accent-color)',
        padding: '8px 10px',
        lineHeight: '1.5',
      },
      '.cm-cursor, .cm-dropCursor': {
        borderLeftColor: 'var(--accent-color)',
        borderLeftWidth: '2px',
      },
      '&.cm-focused': {
        outline: 'none',
      },
      '.cm-gutters': {
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-dim)',
        border: 'none',
        borderRight: '1px solid var(--border-color)',
      },
      '.cm-activeLine': {
        backgroundColor: 'var(--accent-tint-subtle)',
      },
      '.cm-activeLineGutter': {
        backgroundColor: 'var(--accent-tint)',
        color: 'var(--text-primary)',
      },
      '.cm-selectionBackground, ::selection': {
        backgroundColor: 'var(--accent-tint) !important',
      },
      '.cm-placeholder': {
        color: 'var(--text-muted)',
        fontStyle: 'normal',
      },
    },
    { dark: isDark }
  );
}

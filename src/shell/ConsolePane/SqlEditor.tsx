import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, placeholder, lineNumbers } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { sql } from '@codemirror/lang-sql';
import { createBudseiEditorTheme } from './cmTheme';
import { useSettingsStore } from '../../store/settingsStore';

interface SqlEditorProps {
  value: string;
  onChange: (val: string) => void;
  onExecute: () => void;
}

export function SqlEditor({ value, onChange, onExecute }: SqlEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { theme } = useSettingsStore();
  const onExecuteRef = useRef(onExecute);
  onExecuteRef.current = onExecute;

  useEffect(() => {
    if (!containerRef.current) return;

    const executeKeymap = keymap.of([
      {
        key: 'Mod-Enter',
        run: () => {
          onExecuteRef.current();
          return true;
        },
      },
      ...defaultKeymap,
    ]);

    const placeholderText =
      '-- Enter SQLite statements (multi-statement supported)\nSELECT sqlite_version();';

    const startState = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        sql(),
        placeholder(placeholderText),
        executeKeymap,
        createBudseiEditorTheme(theme === 'dark'),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: containerRef.current,
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [theme]); // Re-create on theme change

  // Sync external value changes (e.g. from preset select)
  useEffect(() => {
    const view = viewRef.current;
    if (view && view.state.doc.toString() !== value) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });
    }
  }, [value]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />;
}

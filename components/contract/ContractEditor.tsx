'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Heading1,
  Heading2,
  Heading3,
  Type,
} from 'lucide-react';

interface ContractEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

// Convert markdown to HTML for TipTap
const convertMarkdownToHtml = (markdown: string): string => {
  const lines = markdown.split('\n');
  const htmlLines: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      htmlLines.push('<p><br></p>');
      continue;
    }

    if (line.startsWith('# ')) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      htmlLines.push(`<h1>${line.substring(2)}</h1>`);
    } else if (line.startsWith('## ')) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      htmlLines.push(`<h2>${line.substring(3)}</h2>`);
    } else if (line.startsWith('### ')) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      htmlLines.push(`<h3>${line.substring(4)}</h3>`);
    } else if (line.startsWith('- ')) {
      if (!inList) {
        htmlLines.push('<ul>');
        inList = true;
      }
      const processedLine = line.substring(2).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      htmlLines.push(`<li>${processedLine}</li>`);
    } else {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      // Handle bold and italic text
      const processedLine = line
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
      htmlLines.push(`<p>${processedLine}</p>`);
    }
  }

  if (inList) {
    htmlLines.push('</ul>');
  }

  return htmlLines.join('');
};

// Convert TipTap HTML back to markdown
const convertHtmlToMarkdown = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;

  const lines: string[] = [];

  for (const node of div.childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;

      switch (element.tagName.toLowerCase()) {
        case 'h1':
          lines.push(`# ${element.textContent}`);
          break;
        case 'h2':
          lines.push(`## ${element.textContent}`);
          break;
        case 'h3':
          lines.push(`### ${element.textContent}`);
          break;
        case 'ul':
          const listItems = element.querySelectorAll('li');
          listItems.forEach((item) => {
            lines.push(`- ${item.textContent}`);
          });
          break;
        case 'p':
          if (element.innerHTML === '<br>' || element.innerHTML === '') {
            lines.push('');
          } else {
            // Convert bold tags back to markdown
            const processedContent = element.innerHTML
              .replace(/<strong>([^<]+)<\/strong>/g, '**$1**')
              .replace(/<em>([^<]+)<\/em>/g, '*$1*')
              .replace(/<br>/g, '');
            lines.push(processedContent);
          }
          break;
        default:
          lines.push(element.textContent || '');
      }
    }
  }

  return lines.join('\n');
};

export default function ContractEditor({
  content,
  onChange,
  onSave,
  onCancel,
}: ContractEditorProps) {
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bold: false,
        italic: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Bold,
      Italic,
    ],
    content: convertMarkdownToHtml(content),
    onUpdate: ({ editor }) => {
      // Clear existing timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Debounce the update to prevent cursor jumping
      updateTimeoutRef.current = setTimeout(() => {
        const markdown = convertHtmlToMarkdown(editor.getHTML());
        onChange(markdown);
      }, 100);
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none leading-relaxed focus:outline-none min-h-[600px] max-h-[800px] overflow-y-auto p-6 bg-white',
      },
    },
    enableCoreExtensions: true,
    parseOptions: {
      preserveWhitespace: 'full',
    },
    immediatelyRender: false,
  });

  // Update editor content when content prop changes (only on initial load)
  useEffect(() => {
    if (editor && content && !editor.getHTML()) {
      const htmlContent = convertMarkdownToHtml(content);
      editor.commands.setContent(htmlContent);
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  const toggleHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const toggleBold = () => {
    editor.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor.chain().focus().toggleItalic().run();
  };

  const setNormalText = () => {
    editor.chain().focus().setParagraph().run();
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 flex items-center gap-2 flex-wrap bg-gray-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleHeading(1)}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleHeading(2)}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleHeading(3)}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={setNormalText}
          className={editor.isActive('paragraph') ? 'bg-accent' : ''}
        >
          <Type className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBold}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleItalic}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="p-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

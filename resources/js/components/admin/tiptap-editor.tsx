import { useCallback, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {
    Bold,
    Check,
    Heading1,
    Heading2,
    Italic,
    LinkIcon,
    List,
    ListOrdered,
    Redo,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo,
    Unlink,
    X,
} from 'lucide-react';

interface Props {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

function ToolbarButton({ onClick, isActive = false, children }: { onClick: () => void; isActive?: boolean; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded p-1.5 transition-colors hover:bg-accent ${isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`}
        >
            {children}
        </button>
    );
}

export function TiptapEditor({ content, onChange, placeholder = 'დაწერეთ ტექსტი...' }: Props) {
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [2, 3] } }),
            Underline,
            Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline' } }),
            Placeholder.configure({ placeholder }),
        ],
        content,
        onUpdate: ({ editor: e }) => {
            onChange(e.getHTML());
        },
    });

    const openLinkInput = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href || '';
        setLinkUrl(previousUrl);
        setShowLinkInput(true);
    }, [editor]);

    const applyLink = useCallback(() => {
        if (!editor) return;
        if (linkUrl.trim() === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
        setShowLinkInput(false);
        setLinkUrl('');
    }, [editor, linkUrl]);

    const cancelLink = useCallback(() => {
        setShowLinkInput(false);
        setLinkUrl('');
        editor?.chain().focus().run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="rounded-lg border bg-background">
            <div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
                    <Heading1 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })}>
                    <Heading2 className="h-4 w-4" />
                </ToolbarButton>
                <div className="mx-1 h-6 w-px bg-border" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}>
                    <UnderlineIcon className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
                    <Strikethrough className="h-4 w-4" />
                </ToolbarButton>
                <div className="mx-1 h-6 w-px bg-border" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
                <div className="mx-1 h-6 w-px bg-border" />
                <div className="relative">
                    <ToolbarButton onClick={openLinkInput} isActive={editor.isActive('link')}>
                        <LinkIcon className="h-4 w-4" />
                    </ToolbarButton>
                    {showLinkInput && (
                        <div className="absolute left-0 top-full z-50 mt-1 flex items-center gap-1 rounded-lg border bg-popover p-1.5 shadow-lg">
                            <input
                                type="text"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
                                    if (e.key === 'Escape') cancelLink();
                                }}
                                placeholder="https://example.com"
                                className="h-7 w-56 rounded border bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                                autoFocus
                            />
                            <button type="button" onClick={applyLink} className="rounded p-1 text-green-600 hover:bg-accent">
                                <Check className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={cancelLink} className="rounded p-1 text-destructive hover:bg-accent">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
                {editor.isActive('link') && (
                    <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()}>
                        <Unlink className="h-4 w-4" />
                    </ToolbarButton>
                )}
                <div className="mx-1 h-6 w-px bg-border" />
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
                    <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
                    <Redo className="h-4 w-4" />
                </ToolbarButton>
            </div>
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none px-3 py-2 dark:prose-invert focus-within:outline-none [&_.tiptap]:min-h-[150px] [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
            />
        </div>
    );
}

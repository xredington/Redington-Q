"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useState, useCallback, useMemo } from "react";
import { PartialBlock, BlockSchema, DefaultInlineContentSchema, DefaultStyleSchema, BlockNoteEditor } from "@blocknote/core";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { selectDocument, selectDocumentLoaded, setDocumentLoaded, updateDocument } from "@/lib/store/features/editor/EditorSlice";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import axios from "axios";

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function (...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post('/api/notes/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status !== 200) {
            throw new Error('Failed to upload image to S3');
        }

        return response.data.url;
    } catch (error) {
        toast.error('Error uploading image to the document');
        throw error;
    }
}

const fetchDocument = async (userId: string) => {
    const res = await fetch(`/api/notes?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch document');
    return res.json();
}

const saveDocument = async (userId: string, document: PartialBlock<BlockSchema, DefaultInlineContentSchema, DefaultStyleSchema>[]) => {
    await fetch("/api/notes/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, document }),
    });
}

const EditorSkeleton = ({ className }: { className?: string }) => (
    <div className={`${className} bg-gray-100 rounded-xl p-6 w-full h-[500px] grid gap-4 flex-gow animate-pulse`}>
        <div className="h-12 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
        <div className="h-7 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
        <div className="h-7 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
        <div className="h-7 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
        <div className="h-7 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
        <div className="h-7 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
        <div className="h-7 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
    </div>
);

const Editor = ({ className }: { className?: string }) => {
    const content = useAppSelector(selectDocument);
    const isDocumentLoaded = useAppSelector(selectDocumentLoaded);
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const [initialContent, setInitialContent] = useState<PartialBlock[] | "loading">("loading");
    const [editorInstance, setEditorInstance] = useState<BlockNoteEditor | null>(null); // Track editor instance

    useEffect(() => {
        async function loadInitialContent() {
            try {
                if (!isDocumentLoaded && session?.user.id) {
                    const data = await fetchDocument(session.user.id);
                    if (Array.isArray(data.document) && data.document.length > 0) {
                        dispatch(updateDocument(data.document));
                        setInitialContent(data.document);
                    } else {
                        setInitialContent([]);
                    }
                    dispatch(setDocumentLoaded(true));
                }
            } catch (error) {
                console.error("Failed to load initial content:", error);
                setInitialContent([]);
            }
        }
        loadInitialContent();
    }, [session?.user.id, dispatch, isDocumentLoaded]);

    // Create editor only after initialContent is loaded and valid
    useEffect(() => {
        if (initialContent !== "loading" && !editorInstance) {
            const editor = BlockNoteEditor.create({
                initialContent: content || [],
                uploadFile,
            });
            setEditorInstance(editor);
        }
    }, [initialContent, content, editorInstance]);

    const handleEditorChange = useCallback(
        debounce(async (updatedEditor) => {
            const document = updatedEditor;
            dispatch(updateDocument(document));
            try {
                if (session?.user.id) {
                    await saveDocument(session.user.id, document);
                }
            } catch (error) {
                console.error("Failed to save document:", error);
            }
        }, 1000),
        [session?.user.id, dispatch]
    );

    if (initialContent === "loading" && !isDocumentLoaded) {
        return <EditorSkeleton className={className} />;
    }

    // Only render BlockNoteView if the editor instance is available
    return editorInstance ? (
        <BlockNoteView
            editor={editorInstance}
            className={`w-full ${className}`}
            data-theming-css-variables-main
            theme={"light"}
            onChange={() => handleEditorChange(editorInstance.document)}
        />
    ) : null;
};

export default Editor;

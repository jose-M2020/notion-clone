"use client";

import { useTheme } from "next-themes";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

import { useEdgeStore } from "@/lib/edgestore";
import { createHighlighter } from "@/shiki.bundle";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

const Editor = ({
  onChange,
  initialContent,
  editable
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ 
      file
    });

    return response.url;
  }

  const handleChange = async () => {
    onChange(JSON.stringify(editor.document, null, 2));
  }

  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    uploadFile: handleUpload,
    codeBlock: {
      indentLineWithTab: true,
      defaultLanguage: "typescript",
      supportedLanguages: {
        typescript: { name: "TypeScript", aliases: ["ts"] },
        javascript: { name: "JavaScript", aliases: ["js"] },
        vue: { name: "Vue" },
      },
      createHighlighter: () =>
        createHighlighter({
          // themes: resolvedTheme === "dark" ? ["github-dark"] : ["github-light"],
          themes: ["github-dark", "github-light"],
          langs: [],
        }),
    },
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        editable={editable}
        onChange={handleChange}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        data-blocknote-theming-css-variables
      />
    </div>
  )
}

export default Editor;
"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Maximize } from "lucide-react";

import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

const files = {
  "script.js": {
    name: "script.js",
    language: "javascript",
    value: "// Start writing some JS!",
  },
  "style.css": {
    name: "style.css",
    language: "css",
    value: "/* Start writing some CSS! */",
  },
  "index.html": {
    name: "index.html",
    language: "html",
    value: "<!-- Start writing some HTML! -->",
  },
};

function PanelTitle({ children }: React.PropsWithChildren) {
  return (
    <div className="flex justify-between bg-primary-foreground text-xl text-muted-foreground">
      {children}
    </div>
  );
}

function PanelContent({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={clsx("h-full", className)}>{children}</div>;
}

export default function ChallengePanels() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const [fileName, setFileName] = useState("style.css");
  const [source, setSource] = useState({ javascript: "", css: "", html: "" });
  const [srcDoc, setSrcDoc] = useState("");

  const file = files[fileName as keyof typeof files];

  useEffect(() => {
    editorRef.current?.focus();
  }, [file.name]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(
        `<!DOCTYPE html>
        <html>
          <head>
            <style>
              html {
                height: 100%;
              }
              ${source.css}
            </style>
          </head>
          <body>${source.html} <script>${source.javascript}</script></body>
        </html>`,
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [source]);

  function handleEditorChanged(
    value?: string,
    event?: editor.IModelContentChangedEvent,
  ) {
    if (!editorRef.current) return;

    const model = editorRef.current.getModel();

    if (!model) return;
    const language = model.getLanguageId();

    setSource((prevSource) => ({
      ...prevSource,
      [language]: value,
    }));
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-fit rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <PanelTitle>
          <div>
            <button
              className="w-20 p-1 hover:bg-secondary disabled:bg-secondary-foreground disabled:text-secondary"
              disabled={fileName === "style.css"}
              onClick={() => setFileName("style.css")}
            >
              CSS
            </button>
            <button
              className="w-20 p-1 hover:bg-secondary disabled:bg-secondary-foreground disabled:text-secondary"
              disabled={fileName === "index.html"}
              onClick={() => setFileName("index.html")}
            >
              HTML
            </button>
            <button
              className="w-20 p-1 hover:bg-secondary disabled:bg-secondary-foreground disabled:text-secondary"
              disabled={fileName === "script.js"}
              onClick={() => setFileName("script.js")}
            >
              JS
            </button>
          </div>
          <div>
            <Maximize />
          </div>
        </PanelTitle>
        <PanelContent>
          <Editor
            theme="vs-dark"
            defaultLanguage={file.language}
            defaultValue={file.value}
            path={file.name}
            onChange={handleEditorChanged}
            onMount={(editor) => (editorRef.current = editor)}
          />
        </PanelContent>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25}>
            <PanelTitle>
              <h1 className="p-1">Challenge</h1>
            </PanelTitle>
            <PanelContent></PanelContent>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className="flex flex-col" defaultSize={75}>
            <PanelTitle>
              <h1 className="p-1">Preview</h1>
            </PanelTitle>
            <PanelContent className="h-full">
              <iframe
                width="100%"
                height="100%"
                srcDoc={srcDoc}
                sandbox="allow-scripts"
              />
            </PanelContent>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

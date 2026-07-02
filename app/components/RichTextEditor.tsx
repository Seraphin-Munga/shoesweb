"use client";

import { useRef, useEffect } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const TOOLS: { cmd: string; label: string; arg?: string }[] = [
  { cmd: "bold", label: "B" },
  { cmd: "italic", label: "I" },
  { cmd: "underline", label: "U" },
  { cmd: "insertUnorderedList", label: "•" },
  { cmd: "insertOrderedList", label: "1." },
];

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const apply = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    onChange(ref.current?.innerHTML ?? "");
  };

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) apply("createLink", url);
  };

  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden focus-within:border-zinc-900 transition-colors">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-zinc-100 bg-zinc-50">
        {TOOLS.map((t) => (
          <button
            key={t.cmd}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => apply(t.cmd, t.arg)}
            className="min-w-[2rem] h-8 px-2 rounded-lg text-xs font-bold text-zinc-600 hover:bg-white hover:text-zinc-900 border border-transparent hover:border-zinc-200 transition-colors"
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={addLink}
          className="h-8 px-2 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-white hover:text-zinc-900 border border-transparent hover:border-zinc-200 transition-colors"
        >
          Link
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
        className="rich-editor min-h-[140px] max-h-64 overflow-y-auto px-3 py-2.5 text-sm text-zinc-800 outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline empty:before:content-[attr(data-placeholder)] empty:before:text-zinc-400"
      />
    </div>
  );
}

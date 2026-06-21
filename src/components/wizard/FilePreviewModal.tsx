"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FilePreviewModalProps {
  filename: string;
  content: string;
  onClose: () => void;
}

export function FilePreviewModal({ filename, content, onClose }: FilePreviewModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-zinc-800 rounded-t-xl sm:rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-zinc-200 dark:border-zinc-600">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-zinc-200 dark:border-zinc-600 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-700 px-2.5 py-1 rounded">
              {filename}
            </span>
            <span className="text-xs text-zinc-400">
              {content.split("\n").length} lines
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5"
            >
              {copied ? (
                <Check className="size-3.5 text-green-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-auto flex-1 p-3 sm:p-5">
          <pre className="font-mono text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
}

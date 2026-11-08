import React, { useState } from 'react';
import { ARCHITECTURE_DOCUMENTATION, DocSection } from '../../data/architectureDocs';
import { 
  BookOpen, Code2, Copy, Check, Layers, Database, 
  Smartphone, FolderTree, ListOrdered, Globe2, Sparkles, Download 
} from 'lucide-react';

export const ArchitectureStudio: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState(ARCHITECTURE_DOCUMENTATION[0].id);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const activeSection = ARCHITECTURE_DOCUMENTATION.find((s) => s.id === selectedSectionId) || ARCHITECTURE_DOCUMENTATION[0];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getIconForSection = (id: string) => {
    switch (id) {
      case 'architecture': return <Layers className="w-4 h-4 text-orange-400" />;
      case 'data-models': return <Database className="w-4 h-4 text-amber-400" />;
      case 'screens': return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'code-structure': return <Code2 className="w-4 h-4 text-sky-400" />;
      case 'folder-structure': return <FolderTree className="w-4 h-4 text-purple-400" />;
      case 'priority-order': return <ListOrdered className="w-4 h-4 text-pink-400" />;
      case 'nigerian-market': return <Globe2 className="w-4 h-4 text-orange-500" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const handleExportAll = () => {
    const fullDoc = ARCHITECTURE_DOCUMENTATION.map(
      (sec) => `# ${sec.title}\n\n${sec.summary}\n\n${sec.content}\n\n` +
      (sec.codeBlocks?.map((b) => `### File: ${b.filename}\n\`\`\`${b.language}\n${b.code}\n\`\`\`\n\n`).join('') || '')
    ).join('\n---\n\n');

    const blob = new Blob([fullDoc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tender-mvp-production-architecture.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100">
      {/* Top Header */}
      <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Tender · MVP 1 Production Architecture & Technical Specs
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete technical blueprint for engineering teams building the Flutter / React Native + Firebase backend.
          </p>
        </div>

        <button
          onClick={handleExportAll}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
          title="Export Markdown File"
        >
          <Download className="w-3.5 h-3.5 text-orange-400" />
          <span>Export Markdown</span>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <div className="w-72 bg-slate-950/70 border-r border-slate-800/80 p-3 overflow-y-auto shrink-0 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2 block">
            Specification Modules
          </span>
          {ARCHITECTURE_DOCUMENTATION.map((sec) => {
            const isSelected = sec.id === selectedSectionId;
            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-orange-600/15 border border-orange-500/40 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-transparent'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {getIconForSection(sec.id)}
                </div>
                <div className="min-w-0">
                  <span className={`text-xs font-bold block truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {sec.title}
                  </span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {sec.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section Banner */}
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-orange-400 tracking-wider uppercase">
              {activeSection.badge}
            </span>
            <h3 className="text-2xl font-black text-white mt-1">
              {activeSection.title}
            </h3>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              {activeSection.summary}
            </p>
          </div>

          {/* Section Prose / Markdown Formatted text */}
          <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {activeSection.content}
          </div>

          {/* Code Blocks if present */}
          {activeSection.codeBlocks && activeSection.codeBlocks.length > 0 && (
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Production Code Artifacts
              </span>
              {activeSection.codeBlocks.map((block, i) => (
                <div key={i} className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
                  <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-orange-400 font-semibold">
                      {block.filename}
                    </span>
                    <button
                      onClick={() => handleCopy(block.code, `${activeSection.id}-${i}`)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      {copiedIndex === `${activeSection.id}-${i}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-96">
                    <code>{block.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

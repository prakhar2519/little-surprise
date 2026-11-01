import React from 'react';
import { X, Trash2, ExternalLink, Copy, Check, Gift, Heart, Calendar } from 'lucide-react';
import { generateShareUrl } from '../utils/compression';

export default function SavedSurprisesModal({ isOpen, onClose, surprises, onDelete, onPreview }) {
  const [copiedId, setCopiedId] = React.useState(null);

  if (!isOpen) return null;

  const handleCopy = async (surprise) => {
    const url = await generateShareUrl(surprise);
    navigator.clipboard.writeText(url);
    setCopiedId(surprise.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💝</span>
            <div>
              <h3 className="font-bold text-lg text-slate-900">My Saved Surprises</h3>
              <p className="text-xs text-slate-500">Stored safely in your browser for easy re-sharing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {surprises.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Gift className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-bold text-sm">No surprises created yet</p>
              <p className="text-xs mt-1">Create a birthday, apology, proposal or love card to see it here!</p>
            </div>
          ) : (
            surprises.map((item) => {
              const typeConfig = {
                birthday: { label: 'Birthday Card', emoji: '🎂', bg: 'bg-amber-100 text-amber-700' },
                apology: { label: 'Apology Card', emoji: '💙', bg: 'bg-sky-100 text-sky-700' },
                proposal: { label: 'Romantic Proposal', emoji: '💍', bg: 'bg-rose-100 text-rose-700' },
                show_love: { label: 'Show Your Love', emoji: '💕', bg: 'bg-pink-100 text-pink-700' }
              }[item.type] || { label: 'Custom Card', emoji: '🎁', bg: 'bg-purple-100 text-purple-700' };

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-brand-300 bg-slate-50/50 hover:bg-white transition flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${typeConfig.bg}`}>
                      {typeConfig.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-slate-800 truncate">
                        For {item.recipientName || 'Someone Special'}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span>{typeConfig.label}</span>
                        <span>•</span>
                        <span>{item.senderName ? `From ${item.senderName}` : 'Custom'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Copy Link */}
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-rose-50 transition"
                      title="Copy Shareable Link"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {/* Preview */}
                    <button
                      onClick={() => {
                        onClose();
                        onPreview(item);
                      }}
                      className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-rose-50 transition"
                      title="View Experience"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

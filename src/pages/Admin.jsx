import { useState, useEffect } from 'react';
import { decks as initialDecks, colorMeta, playstyleMeta } from '../data/decks';
import { Plus, Trash2, Edit2, Download, X, Check, ChevronUp, ChevronDown } from 'lucide-react';

// ─── Color / gradient presets keyed by sorted color combos ───────────────────
const COLOR_PRESETS = {
  red:          { accentColor: '#ef4444', gradientFrom: '#1a0000', gradientTo: '#0a0000', glowClass: 'glow-red' },
  blue:         { accentColor: '#3b82f6', gradientFrom: '#00001a', gradientTo: '#000010', glowClass: 'glow-blue' },
  black:        { accentColor: '#7c3aed', gradientFrom: '#0d0020', gradientTo: '#050010', glowClass: 'glow-purple' },
  white:        { accentColor: '#f59e0b', gradientFrom: '#1a1400', gradientTo: '#0a0a00', glowClass: 'glow-gold' },
  green:        { accentColor: '#22c55e', gradientFrom: '#001a00', gradientTo: '#000a00', glowClass: 'glow-green' },
  'black,white':{ accentColor: '#d4af37', gradientFrom: '#1a0a0a', gradientTo: '#0a0a1a', glowClass: 'glow-gold' },
  'black,green':{ accentColor: '#22c55e', gradientFrom: '#0d0020', gradientTo: '#001a00', glowClass: 'glow-green' },
  'black,red':  { accentColor: '#ef4444', gradientFrom: '#1a0000', gradientTo: '#0d0020', glowClass: 'glow-red' },
  'blue,red':   { accentColor: '#818cf8', gradientFrom: '#1a0000', gradientTo: '#00001a', glowClass: 'glow-blue' },
  'blue,white': { accentColor: '#60a5fa', gradientFrom: '#00001a', gradientTo: '#1a1400', glowClass: 'glow-blue' },
  'green,white':{ accentColor: '#4ade80', gradientFrom: '#001a00', gradientTo: '#1a1400', glowClass: 'glow-green' },
  'blue,green': { accentColor: '#34d399', gradientFrom: '#00001a', gradientTo: '#001a00', glowClass: 'glow-green' },
  'red,white':  { accentColor: '#f87171', gradientFrom: '#1a0000', gradientTo: '#1a1400', glowClass: 'glow-red' },
  'green,red':  { accentColor: '#f97316', gradientFrom: '#1a0000', gradientTo: '#001a00', glowClass: 'glow-red' },
  'black,blue': { accentColor: '#818cf8', gradientFrom: '#00001a', gradientTo: '#0d0020', glowClass: 'glow-blue' },
};

const COLOR_LABELS = {
  red: 'Mono Red', blue: 'Mono Blue', black: 'Mono Black', white: 'Mono White', green: 'Mono Green',
  'black,white': 'White / Black', 'black,green': 'Black / Green', 'black,red': 'Black / Red',
  'blue,red': 'Blue / Red', 'blue,white': 'Blue / White', 'green,white': 'Green / White',
  'blue,green': 'Simic', 'red,white': 'Red / White', 'green,red': 'Gruul', 'black,blue': 'Dimir',
};

const MTG_COLORS = [
  { key: 'white', symbol: 'W', hex: '#f59e0b' },
  { key: 'blue',  symbol: 'U', hex: '#3b82f6' },
  { key: 'black', symbol: 'B', hex: '#7c3aed' },
  { key: 'red',   symbol: 'R', hex: '#ef4444' },
  { key: 'green', symbol: 'G', hex: '#22c55e' },
];

const DIFFICULTY_OPTIONS = ['Beginner', 'Easy', 'Moderate', 'Advanced'];

function colorKey(colors) {
  return [...colors].sort().join(',');
}

function deriveColorMeta(colors) {
  if (colors.length === 0) return { accentColor: '#6366f1', gradientFrom: '#0a0a1a', gradientTo: '#1a0a1a', glowClass: 'glow-purple', colorLabel: 'Colorless' };
  if (colors.length >= 3) return { accentColor: '#ec4899', gradientFrom: '#1a001a', gradientTo: '#001a1a', glowClass: 'glow-pink', colorLabel: 'Multicolor' };
  const key = colorKey(colors);
  const preset = COLOR_PRESETS[key] || COLOR_PRESETS[colors[0]] || COLOR_PRESETS.black;
  return { ...preset, colorLabel: COLOR_LABELS[key] || colors.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' / ') };
}

function imageFilename(imagePath) {
  if (!imagePath) return '';
  return imagePath.split('/').pop();
}

function buildImagePath(filename) {
  if (!filename) return null;
  return `${import.meta.env.BASE_URL}images/${filename}`;
}

// ─── Generate decks.js content for export ────────────────────────────────────
function generateDecksJs(deckList) {
  const deckEntries = deckList.map(deck => {
    const filename = imageFilename(deck.image);
    const imageStr = filename
      ? `\`\${import.meta.env.BASE_URL}images/${filename}\``
      : 'null';

    const decklist = deck.fullDecklist
      .map(s => `      { section: ${JSON.stringify(s.section)}, cards: ${JSON.stringify(s.cards)} }`)
      .join(',\n');

    const included = deck.included.map(i => `"${i}"`).join(', ');

    return `  {
    id: ${deck.id},
    name: ${JSON.stringify(deck.name)},
    commander: ${JSON.stringify(deck.commander)},
    price: ${deck.price},
    bracket: ${deck.bracket},
    colors: ${JSON.stringify(deck.colors)},
    colorLabel: ${JSON.stringify(deck.colorLabel)},
    difficulty: ${JSON.stringify(deck.difficulty)},
    playstyles: ${JSON.stringify(deck.playstyles)},
    description: ${JSON.stringify(deck.description)},
    image: ${imageStr},
    gradientFrom: ${JSON.stringify(deck.gradientFrom)},
    gradientTo: ${JSON.stringify(deck.gradientTo)},
    accentColor: ${JSON.stringify(deck.accentColor)},
    glowClass: ${JSON.stringify(deck.glowClass || 'glow-purple')},
    strategy: ${JSON.stringify(deck.strategy || '')},
    wins: ${JSON.stringify(deck.wins || '')},
    pilotGuide: ${JSON.stringify(deck.pilotGuide || '')},
    openingHand: ${JSON.stringify(deck.openingHand || '')},
    upgradePath: ${JSON.stringify(deck.upgradePath || '')},
    tokensNeeded: ${JSON.stringify(deck.tokensNeeded || '')},
    fullDecklist: [\n${decklist}\n    ],
    included: [${included}],
    featured: ${deck.featured},
    quantity: ${deck.quantity ?? 10},
  }`;
  }).join(',\n');

  return `export const decks = [\n${deckEntries}\n];\n
export const colorMeta = {
  red:   { label: "Red",        hex: "#ef4444", icon: "🔥", desc: "Aggro & Burn",        glowClass: "glow-red" },
  blue:  { label: "Blue",       hex: "#3b82f6", icon: "💧", desc: "Control & Combo",      glowClass: "glow-blue" },
  black: { label: "Black",      hex: "#7c3aed", icon: "💀", desc: "Sacrifice & Drain",    glowClass: "glow-purple" },
  white: { label: "White",      hex: "#f59e0b", icon: "☀️", desc: "Lifegain & Tokens",    glowClass: "glow-gold" },
  green: { label: "Green",      hex: "#22c55e", icon: "🌿", desc: "Ramp & Creatures",     glowClass: "glow-green" },
  multi: { label: "Multicolor", hex: "#ec4899", icon: "✨", desc: "All Combinations",     glowClass: "glow-pink" },
};

export const playstyleMeta = [
  "Aggro", "Tokens", "Aristocrats", "Sacrifice", "Spellslinger",
  "Ramp", "Lifegain", "Control", "Reanimator", "Storm",
  "Counters", "Tribal", "Drain", "Go Wide", "Superfriends",
];
`;
}

const BLANK_DECK = {
  name: '', commander: '', price: 149, bracket: 2,
  colors: [], colorLabel: '', difficulty: 'Easy', playstyles: [],
  description: '', image: null,
  accentColor: '#6366f1', gradientFrom: '#0a0a1a', gradientTo: '#1a0a1a', glowClass: 'glow-purple',
  strategy: '', wins: '', pilotGuide: '', openingHand: '', upgradePath: '', tokensNeeded: '',
  fullDecklist: [
    { section: 'Commander', cards: [] },
    { section: 'Creatures ()', cards: [] },
    { section: 'Artifacts ()', cards: [] },
    { section: 'Lands (36)', cards: [] },
  ],
  included: ['99-card Commander deck', 'Pilot guide booklet', 'Synergy cheat sheet', 'Upgrade path guide', 'Storage sleeve set'],
  featured: false,
  quantity: 10,
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600
          focus:outline-none focus:border-blue-500 transition-colors"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm
          placeholder-gray-600 focus:outline-none focus:border-blue-500 leading-relaxed resize-none transition-colors"
      />
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className="w-10 h-6 rounded-full transition-colors relative shrink-0"
        style={{ background: checked ? '#3b82f6' : '#374151' }}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
          style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
        />
      </div>
      <span className="text-sm text-gray-300">{label}</span>
    </label>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Admin() {
  const [deckList, setDeckList] = useState(() => {
    try {
      const saved = localStorage.getItem('adminDecks');
      return saved
        ? JSON.parse(saved)
        : initialDecks.map(d => ({ ...d, quantity: d.quantity ?? 10 }));
    } catch { return initialDecks.map(d => ({ ...d, quantity: d.quantity ?? 10 })); }
  });

  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [savedFlash, setSavedFlash] = useState(false);
  const [exportFlash, setExportFlash] = useState(false);

  useEffect(() => {
    localStorage.setItem('adminDecks', JSON.stringify(deckList));
  }, [deckList]);

  // ── List actions ────────────────────────────────────────────────────────────
  function newDeck() {
    setEditing({ ...BLANK_DECK, id: Date.now() });
    setActiveTab('basic');
  }

  function editDeck(deck) {
    setEditing(JSON.parse(JSON.stringify(deck)));
    setActiveTab('basic');
  }

  function deleteDeck(id) {
    if (!window.confirm('Delete this deck? This cannot be undone.')) return;
    setDeckList(prev => prev.filter(d => d.id !== id));
    if (editing?.id === id) setEditing(null);
  }

  function moveDeck(id, dir) {
    setDeckList(prev => {
      const idx = prev.findIndex(d => d.id === id);
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  }

  // ── Edit actions ────────────────────────────────────────────────────────────
  function set(key, val) { setEditing(prev => ({ ...prev, [key]: val })); }

  function toggleColor(color) {
    const next = editing.colors.includes(color)
      ? editing.colors.filter(c => c !== color)
      : [...editing.colors, color];
    const meta = deriveColorMeta(next);
    setEditing(prev => ({ ...prev, colors: next, ...meta }));
  }

  function togglePlaystyle(tag) {
    const next = editing.playstyles.includes(tag)
      ? editing.playstyles.filter(t => t !== tag)
      : [...editing.playstyles, tag];
    set('playstyles', next);
  }

  function saveDeck() {
    const exists = deckList.some(d => d.id === editing.id);
    setDeckList(prev =>
      exists ? prev.map(d => d.id === editing.id ? editing : d) : [...prev, editing]
    );
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }

  // ── Decklist section helpers ────────────────────────────────────────────────
  function addSection() {
    set('fullDecklist', [...editing.fullDecklist, { section: 'New Section', cards: [] }]);
  }
  function removeSection(i) {
    set('fullDecklist', editing.fullDecklist.filter((_, idx) => idx !== i));
  }
  function updateSection(i, key, val) {
    set('fullDecklist', editing.fullDecklist.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  }
  function setSectionCards(i, text) {
    updateSection(i, 'cards', text.split('\n').map(c => c.trim()).filter(Boolean));
  }

  // ── Export ──────────────────────────────────────────────────────────────────
  function downloadDecksJs() {
    const blob = new Blob([generateDecksJs(deckList)], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'decks.js'; a.click();
    URL.revokeObjectURL(url);
    setExportFlash(true);
    setTimeout(() => setExportFlash(false), 2000);
  }

  // ── Render: List view ───────────────────────────────────────────────────────
  if (!editing) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Deck Admin</h1>
              <p className="text-gray-500 text-sm mt-1">
                {deckList.length} deck{deckList.length !== 1 ? 's' : ''} · edits saved in browser
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={downloadDecksJs}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10
                  text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                <Download size={14} />
                {exportFlash ? 'Downloaded!' : 'Download decks.js'}
              </button>
              <button
                onClick={newDeck}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500
                  text-white text-sm font-semibold transition-colors"
              >
                <Plus size={16} /> New Deck
              </button>
            </div>
          </div>

          <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
            <strong>Workflow:</strong> Edit decks here → click <em>Download decks.js</em> → replace
            <code className="mx-1 text-amber-200 bg-black/30 px-1 rounded">src/data/decks.js</code>
            → <code className="text-amber-200 bg-black/30 px-1 rounded">git push</code> to deploy.
          </div>

          <div className="space-y-2">
            {deckList.map((deck, idx) => (
              <div
                key={deck.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/3 border border-white/8
                  hover:border-white/15 transition-colors group"
              >
                {/* Thumbnail */}
                <div
                  className="w-14 h-14 rounded-xl overflow-hidden shrink-0"
                  style={{ background: `linear-gradient(135deg, ${deck.gradientFrom}, ${deck.gradientTo})` }}
                >
                  {deck.image && (
                    <img src={deck.image} alt="" className="w-full h-full object-contain" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">{deck.name || 'Untitled Deck'}</div>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>{deck.commander || '—'}</span>
                    <span className="text-gray-700">·</span>
                    <span>B{deck.bracket}</span>
                    <span className="text-gray-700">·</span>
                    <span>${deck.price}</span>
                    <span className="text-gray-700">·</span>
                    <span>Qty: {deck.quantity ?? '—'}</span>
                  </div>
                </div>

                {/* Color dots */}
                <div className="hidden sm:flex items-center gap-1">
                  {deck.colors.map(c => (
                    <span key={c} className="w-3 h-3 rounded-full" style={{ background: colorMeta[c]?.hex }} />
                  ))}
                </div>

                {/* Featured badge */}
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                  deck.featured ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-600'
                }`}>
                  {deck.featured ? 'Featured' : 'Hidden'}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveDeck(deck.id, -1)} disabled={idx === 0}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white disabled:opacity-20 transition-colors">
                    <ChevronUp size={13} />
                  </button>
                  <button onClick={() => moveDeck(deck.id, 1)} disabled={idx === deckList.length - 1}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white disabled:opacity-20 transition-colors">
                    <ChevronDown size={13} />
                  </button>
                  <button onClick={() => editDeck(deck)}
                    className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors ml-1">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => deleteDeck(deck.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Edit view ───────────────────────────────────────────────────────
  const ac = editing.accentColor;

  return (
    <div className="min-h-screen bg-[#0a0e1a] pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Edit header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setEditing(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <X size={14} /> Back to list
          </button>
          <div className="flex gap-3">
            <button
              onClick={downloadDecksJs}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10
                text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              <Download size={14} /> Download decks.js
            </button>
            <button
              onClick={saveDeck}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
              style={{ background: savedFlash ? '#22c55e' : '#2563eb' }}
            >
              {savedFlash ? <><Check size={14} /> Saved!</> : 'Save Deck'}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left: Preview + Inventory ─────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Preview</div>

            {/* Card preview */}
            <div
              className="rounded-2xl overflow-hidden border border-white/8"
              style={{ boxShadow: `0 8px 32px ${ac}33, 0 0 0 1px ${ac}22` }}
            >
              <div
                className="relative aspect-square w-full overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${editing.gradientFrom}, ${editing.gradientTo})` }}
              >
                {editing.image ? (
                  <img src={editing.image} alt={editing.name} className="absolute inset-0 w-full h-full object-contain" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 text-6xl select-none">⚔</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/60 border border-white/10"
                    style={{ color: editing.bracket === 2 ? '#4ade80' : editing.bracket === 3 ? '#facc15' : '#f87171' }}>
                    Bracket {editing.bracket}
                  </span>
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/70 border border-white/15 text-white font-bold text-sm">
                  ${editing.price}
                </div>
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  {editing.colors.map(c => (
                    <span key={c} className="w-4 h-4 rounded-full border border-white/20" style={{ background: colorMeta[c]?.hex }} />
                  ))}
                </div>
              </div>
              <div className="p-4" style={{ background: '#0f1629' }}>
                <div className="font-bold text-white mb-0.5 truncate">{editing.name || 'Deck Name'}</div>
                <div className="text-xs text-gray-500 mb-2 truncate">{editing.commander || 'Commander name'}</div>
                <div className="flex flex-wrap gap-1">
                  {editing.playstyles.slice(0, 3).map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${ac}18`, color: ac, border: `1px solid ${ac}33` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Inventory panel */}
            <div className="p-4 rounded-xl bg-white/3 border border-white/8 space-y-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Inventory</div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Quantity in Stock</label>
                <input
                  type="number" min="0"
                  value={editing.quantity ?? 0}
                  onChange={e => set('quantity', parseInt(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm
                    focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <Toggle
                checked={editing.inStock !== false}
                onChange={v => set('inStock', v)}
                label="Show as In Stock"
              />
              <Toggle
                checked={!!editing.featured}
                onChange={v => set('featured', v)}
                label="Featured (shows in hero)"
              />
            </div>
          </div>

          {/* ── Right: Tabbed form ────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex border-b border-white/8 mb-6">
              {['Basic', 'Content', 'Decklist'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-5 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.toLowerCase()
                      ? 'text-white border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ── Tab: Basic ─────────────────────────────────────────────── */}
            {activeTab === 'basic' && (
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Deck Name" value={editing.name} onChange={v => set('name', v)} placeholder="e.g. Meren Graveyard Engine" />
                  <Field label="Commander" value={editing.commander} onChange={v => set('commander', v)} placeholder="e.g. Meren of Clan Nel Toth" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Price ($)</label>
                    <input type="number" min="0" value={editing.price}
                      onChange={e => set('price', parseInt(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm
                        focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Bracket</label>
                    <div className="flex gap-2 h-[42px]">
                      {[2, 3, 4].map(b => (
                        <button key={b} onClick={() => set('bracket', b)}
                          className="flex-1 rounded-xl text-sm font-bold border transition-colors"
                          style={editing.bracket === b
                            ? { background: `${ac}22`, borderColor: `${ac}88`, color: ac }
                            : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#6b7280' }}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Difficulty</label>
                    <select value={editing.difficulty} onChange={e => set('difficulty', e.target.value)}
                      className="w-full h-[42px] bg-[#0a0e1a] border border-white/10 rounded-xl px-3 text-white text-sm
                        focus:outline-none focus:border-blue-500">
                      {DIFFICULTY_OPTIONS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                {/* Color identity */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Color Identity</label>
                  <div className="flex gap-2 mb-2">
                    {MTG_COLORS.map(c => (
                      <button key={c.key} onClick={() => toggleColor(c.key)}
                        className="w-12 h-12 rounded-xl font-bold text-sm border-2 transition-all"
                        style={editing.colors.includes(c.key)
                          ? { background: c.hex + '25', borderColor: c.hex, color: c.hex }
                          : { background: 'transparent', borderColor: 'rgba(255,255,255,0.12)', color: '#4b5563' }}>
                        {c.symbol}
                      </button>
                    ))}
                  </div>
                  <input value={editing.colorLabel} onChange={e => set('colorLabel', e.target.value)}
                    placeholder="Color label (auto-filled, override if needed)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm
                      placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>

                {/* Playstyles */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Playstyles</label>
                  <div className="flex flex-wrap gap-2">
                    {playstyleMeta.map(tag => (
                      <button key={tag} onClick={() => togglePlaystyle(tag)}
                        className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
                        style={editing.playstyles.includes(tag)
                          ? { background: `${ac}22`, borderColor: `${ac}66`, color: ac }
                          : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#6b7280' }}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Image Filename</label>
                  <div className="flex gap-2">
                    <input
                      value={imageFilename(editing.image)}
                      onChange={e => set('image', e.target.value ? buildImagePath(e.target.value.trim()) : null)}
                      placeholder="e.g. meren.png"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm
                        placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    {editing.image && (
                      <button onClick={() => set('image', null)}
                        className="px-3 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors">
                        Clear
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Copy your image to <code className="text-gray-500">public/images/</code> first, then enter the filename.
                  </p>
                </div>
              </div>
            )}

            {/* ── Tab: Content ───────────────────────────────────────────── */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <TextArea label="Short Description" value={editing.description} onChange={v => set('description', v)} rows={2}
                  placeholder="One-liner shown on the deck card" />
                <TextArea label="Strategy" value={editing.strategy} onChange={v => set('strategy', v)} rows={4}
                  placeholder="How the deck works overall" />
                <TextArea label="How This Deck Wins" value={editing.wins} onChange={v => set('wins', v)} rows={3}
                  placeholder="The win conditions" />
                <TextArea label="Beginner Pilot Guide" value={editing.pilotGuide} onChange={v => set('pilotGuide', v)} rows={4}
                  placeholder="How a new player should approach piloting this deck" />
                <TextArea label="Opening Hand Tips" value={editing.openingHand} onChange={v => set('openingHand', v)} rows={3}
                  placeholder="What to look for in your opening hand" />
                <TextArea label="Upgrade Path" value={editing.upgradePath} onChange={v => set('upgradePath', v)} rows={3}
                  placeholder="Suggested upgrades and why" />
                <TextArea label="Tokens Needed" value={editing.tokensNeeded} onChange={v => set('tokensNeeded', v)} rows={2}
                  placeholder="List the tokens this deck creates" />
              </div>
            )}

            {/* ── Tab: Decklist ──────────────────────────────────────────── */}
            {activeTab === 'decklist' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-500">One card per line per section. Section name can include count, e.g. <code className="text-gray-400">Creatures (28)</code>.</p>
                {editing.fullDecklist.map((section, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/8">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        value={section.section}
                        onChange={e => updateSection(i, 'section', e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm
                          font-medium focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Section name"
                      />
                      <button onClick={() => removeSection(i)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <textarea
                      value={section.cards.join('\n')}
                      onChange={e => setSectionCards(i, e.target.value)}
                      rows={Math.max(4, section.cards.length + 2)}
                      placeholder="One card per line..."
                      className="w-full bg-[#0a0e1a] border border-white/8 rounded-lg px-3 py-2.5 text-gray-300 text-sm
                        font-mono leading-relaxed focus:outline-none focus:border-blue-500 resize-none transition-colors"
                    />
                    <div className="text-xs text-gray-600 mt-1">{section.cards.length} cards</div>
                  </div>
                ))}
                <button onClick={addSection}
                  className="w-full py-3 rounded-xl border border-dashed border-white/15 text-gray-500
                    hover:text-gray-300 hover:border-white/30 text-sm transition-colors flex items-center justify-center gap-2">
                  <Plus size={14} /> Add Section
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnnouncementBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      {/* Fade the page content into the bar */}
      <div className="h-6 bg-gradient-to-t from-[#020817] to-transparent" />

      <div
        className="pointer-events-auto bg-[#020817]/95 backdrop-blur-md border-t border-white/8"
        style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.5)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-4 sm:gap-10 flex-wrap">

          {/* Mystery gift */}
          <div className="flex items-center gap-2">
            <span className="gift-glow text-xl leading-none select-none">🎁</span>
            <span className="text-sm text-gray-400">
              Mystery surprise included in{' '}
              <span className="text-white font-semibold">every order</span>
            </span>
          </div>

          {/* Divider — hidden on tiny screens */}
          <div className="hidden sm:block w-px h-4 bg-white/15 shrink-0" />

          {/* Free shipping */}
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none select-none">🚚</span>
            <span className="text-sm text-gray-400">
              Free shipping on orders{' '}
              <span className="text-green-400 font-semibold">over $150</span>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

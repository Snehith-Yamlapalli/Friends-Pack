'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../auth/firebase";
import { StoryData } from "@/lib/stories";
import { getStories, deleteStory } from "@/lib/firestoreStories";
import { isAdminEmail } from "@/lib/admins";

export default function EventsPage() {
  const router = useRouter();
  const [stories, setStories] = useState<StoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load events from Firestore (newest first).
  useEffect(() => {
    getStories()
      .then((uploaded) => setStories(uploaded))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Only admins can delete events.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(isAdminEmail(user?.email));
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (story: StoryData) => {
    if (!confirm(`Delete the event "${story.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      setDeletingId(story.id);
      await deleteStory(story.id);
      setStories((prev) => prev.filter((s) => s.id !== story.id));
    } catch (err) {
      const code =
        err && typeof err === "object" && "code" in err
          ? (err as { code: string }).code
          : "unknown";
      console.error("Delete failed:", err);
      alert(
        `Could not delete "${story.title}".\nReason: ${code}\n\n` +
          (code === "permission-denied"
            ? "Your Firestore rules are not allowing delete. Publish the full rules (create, update, delete)."
            : "Please try again.")
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen text-black p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#ffffff' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      `}</style>

      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={() => router.push('/')}
            className="text-xs sm:text-sm font-black border-2 sm:border-4 border-black px-3 py-2 sm:px-4 sm:py-3 bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            ← BACK
          </button>

          <h1
            className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-black border-4 sm:border-6 md:border-8 border-black px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              lineHeight: '1.6'
            }}
          >
            ALL EVENTS
          </h1>

          <div className="w-24 sm:w-32 md:w-40"></div>
        </header>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {stories.map((story) => (
            <div
              key={story.id}
              className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => router.push(`/story/${story.id}`)}
              onMouseEnter={() => setHoveredCard(story.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                transform: hoveredCard === story.id ? 'translate(-4px, -4px)' : 'translate(0, 0)'
              }}
            >
              {/* Image */}
              <div className="relative w-full h-56 border-b-4 border-black overflow-hidden">
                <Image
                  src={story.thumbnail}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />

                {/* Delete - admins only (temporarily disabled) */}
                {/* {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(story);
                    }}
                    disabled={deletingId === story.id}
                    aria-label={`Delete ${story.title}`}
                    className="absolute top-2 right-2 z-10 bg-black text-white border-2 border-white px-2 py-1 text-[10px] font-black hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    {deletingId === story.id ? '...' : 'DELETE'}
                  </button>
                )} */}
              </div>

              {/* Card Content */}
              <div className="p-5">
                <h2
                  className="text-sm sm:text-base font-black mb-3 group-hover:translate-x-1 transition-transform duration-300"
                  style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: '1.6' }}
                >
                  {story.title}
                </h2>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="bg-black text-white px-2 py-1 text-[10px] font-mono">
                    {story.date}
                  </div>
                  {story.time && (
                    <div className="bg-black text-white px-2 py-1 text-[10px] font-mono">
                      {story.time}
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-black pt-3">
                  <p className="text-xs sm:text-sm leading-relaxed font-medium line-clamp-3">
                    {story.summary}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty / loading state */}
        {stories.length === 0 && (
          <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-10 text-center">
            <p className="text-xs sm:text-sm font-black" style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: '1.8' }}>
              {loading ? 'LOADING...' : 'NO EVENTS YET'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth/firebase';
import { uploadImages } from '@/lib/cloudinary';
import { addStory } from '@/lib/firestoreStories';
import { isAdminEmail } from '@/lib/admins';

const MIN_IMAGES = 2;
const MAX_IMAGES = 10;

const PIXEL_FONT = { fontFamily: "'Press Start 2P', monospace" } as const;

export default function UploadPage() {
  const router = useRouter();

  // null = checking, true/false = resolved
  const [allowed, setAllowed] = useState<boolean | null>(null);

  // Only admins may open the upload page; everyone else is sent home.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const ok = isAdminEmail(user?.email);
      setAllowed(ok);
      if (!ok) router.replace('/');
    });
    return () => unsubscribe();
  }, [router]);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    // Append to any already-selected files instead of replacing them.
    const combined = [...files, ...selected];
    if (combined.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} pictures.`);
    } else {
      setError(null);
    }
    const limited = combined.slice(0, MAX_IMAGES);
    setFiles(limited);
    setPreviews(limited.map((f) => URL.createObjectURL(f)));
    // Reset the input so picking the same file again still fires onChange.
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  // Format the native yyyy-mm-dd value into the "Jan 15, 2026" style
  // used by the existing stories.
  const formatDate = (value: string) => {
    const d = new Date(value + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !date || !summary.trim()) {
      setError('Title, date and summary are all required.');
      return;
    }
    if (files.length < MIN_IMAGES) {
      setError(`Please add at least ${MIN_IMAGES} pictures.`);
      return;
    }
    if (files.length > MAX_IMAGES) {
      setError(`Please add no more than ${MAX_IMAGES} pictures.`);
      return;
    }

    try {
      setSubmitting(true);
      const urls = await uploadImages(files);
      await addStory({
        title: title.trim(),
        date: formatDate(date),
        summary: summary.trim(),
        images: urls,
      });
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setSubmitting(false);
    }
  };

  // Don't render the form until we've confirmed the user is an admin.
  if (allowed !== true) return null;

  return (
    <div
      className="min-h-screen text-black p-4 sm:p-6 md:p-8"
      style={{ backgroundColor: '#ffffff' }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      `}</style>

      <main className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={() => router.push('/')}
            className="text-xs sm:text-sm font-black border-2 sm:border-4 border-black px-3 py-2 sm:px-4 sm:py-3 bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={PIXEL_FONT}
          >
            ← BACK
          </button>

          <h1
            className="text-sm sm:text-xl md:text-2xl font-black border-4 sm:border-6 md:border-8 border-black px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            style={{ ...PIXEL_FONT, lineHeight: '1.6' }}
          >
            ADD EVENT
          </h1>

          <div className="w-20 sm:w-32 md:w-40"></div>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="border-2 sm:border-4 border-black bg-white p-4 sm:p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6"
        >
          {/* Title */}
          <div>
            <label
              className="block text-[10px] sm:text-xs font-black mb-2 pb-2 border-b-2 border-black"
              style={PIXEL_FONT}
            >
              [EVENT TITLE]
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
              placeholder="e.g. North Trip"
              className="w-full border-2 border-black px-3 py-2 text-sm font-bold focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
          </div>

          {/* Date */}
          <div>
            <label
              className="block text-[10px] sm:text-xs font-black mb-2 pb-2 border-b-2 border-black"
              style={PIXEL_FONT}
            >
              [DATE]
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-2 border-black px-3 py-2 text-sm font-bold focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
          </div>

          {/* Summary */}
          <div>
            <label
              className="block text-[10px] sm:text-xs font-black mb-2 pb-2 border-b-2 border-black"
              style={PIXEL_FONT}
            >
              [SUMMARY]
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={5}
              placeholder="What happened at this event?"
              className="w-full border-2 border-black px-3 py-2 text-sm font-bold leading-relaxed focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all resize-y"
            />
          </div>

          {/* Pictures */}
          <div>
            <label
              className="block text-[10px] sm:text-xs font-black mb-2 pb-2 border-b-2 border-black"
              style={PIXEL_FONT}
            >
              [PICTURES] {MIN_IMAGES}-{MAX_IMAGES}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="w-full border-2 border-black px-3 py-2 text-xs font-bold file:mr-3 file:border-2 file:border-black file:bg-black file:text-white file:px-3 file:py-1 file:font-black file:cursor-pointer cursor-pointer"
            />

            {previews.length > 0 && (
              <>
                <p
                  className="mt-3 text-[10px] sm:text-xs font-bold"
                  style={PIXEL_FONT}
                >
                  {previews.length} SELECTED
                </p>
                <div className="mt-2 grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {previews.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square border-2 border-black overflow-hidden group"
                    >
                      <Image
                        src={src}
                        alt={`Preview ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        aria-label={`Remove picture ${idx + 1}`}
                        className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center bg-black text-white border-2 border-white text-sm font-black leading-none hover:bg-white hover:text-black transition-colors"
                        style={PIXEL_FONT}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {error && (
            <div
              className="border-2 border-black bg-black text-white px-3 py-2 text-[10px] sm:text-xs font-bold"
              style={PIXEL_FONT}
            >
              ! {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="self-start text-xs sm:text-sm font-black border-2 sm:border-4 border-black px-4 py-3 sm:px-6 sm:py-3 bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={PIXEL_FONT}
          >
            {submitting ? 'UPLOADING...' : 'SAVE EVENT →'}
          </button>
        </form>
      </main>
    </div>
  );
}

import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/app/auth/firebase';
import { StoryData } from './stories';
import { COLOR_PALETTE } from './palette';

const STORIES_COLLECTION = 'events';

// The fields the upload form collects. Everything else on a StoryData
// (thumbnail, color, fullStory, ...) is derived when the story is created.
export interface NewStoryInput {
  title: string;
  date: string;
  summary: string;
  images: string[];
}

export async function addStory(input: NewStoryInput): Promise<string> {
  const color =
    COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];

  const docRef = await addDoc(collection(db, STORIES_COLLECTION), {
    title: input.title,
    date: input.date,
    summary: input.summary,
    fullStory: input.summary,
    images: input.images,
    thumbnail: input.images[0],
    color,
    time: '',
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getStories(): Promise<StoryData[]> {
  const q = query(
    collection(db, STORIES_COLLECTION),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(
    (d) => ({ id: d.id, ...(d.data() as Omit<StoryData, 'id'>) })
  );
}

export async function getStoryById(id: string): Promise<StoryData | null> {
  const ref = doc(db, STORIES_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<StoryData, 'id'>) };
}

export async function deleteStory(id: string): Promise<void> {
  await deleteDoc(doc(db, STORIES_COLLECTION, id));
}

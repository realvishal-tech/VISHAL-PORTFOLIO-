import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, setDoc
} from 'firebase/firestore';
import { db } from './config';

// ── Projects ──────────────────────────────────────────────
export const getProjects = async () => {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addProject = async (data) => {
  return addDoc(collection(db, 'projects'), { ...data, createdAt: serverTimestamp() });
};

export const updateProject = async (id, data) => {
  return updateDoc(doc(db, 'projects', id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteProject = async (id) => {
  return deleteDoc(doc(db, 'projects', id));
};

// ── About ─────────────────────────────────────────────────
export const getAbout = async () => {
  const snap = await getDoc(doc(db, 'settings', 'about'));
  return snap.exists() ? snap.data() : null;
};

export const updateAbout = async (data) => {
  return setDoc(doc(db, 'settings', 'about'), { ...data, updatedAt: serverTimestamp() });
};

// ── Skills ────────────────────────────────────────────────
export const getSkills = async () => {
  const q = query(collection(db, 'skills'), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addSkill = async (data) => {
  return addDoc(collection(db, 'skills'), { ...data, createdAt: serverTimestamp() });
};

export const updateSkill = async (id, data) => {
  return updateDoc(doc(db, 'skills', id), data);
};

export const deleteSkill = async (id) => {
  return deleteDoc(doc(db, 'skills', id));
};

// ── Messages ──────────────────────────────────────────────
export const getMessages = async () => {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addMessage = async (data) => {
  return addDoc(collection(db, 'messages'), { ...data, createdAt: serverTimestamp(), read: false });
};

export const deleteMessage = async (id) => {
  return deleteDoc(doc(db, 'messages', id));
};

export const markMessageRead = async (id) => {
  return updateDoc(doc(db, 'messages', id), { read: true });
};

// ── Social Links ──────────────────────────────────────────
export const getSocialLinks = async () => {
  const snap = await getDoc(doc(db, 'settings', 'socialLinks'));
  return snap.exists() ? snap.data() : null;
};

export const updateSocialLinks = async (data) => {
  return setDoc(doc(db, 'settings', 'socialLinks'), { ...data, updatedAt: serverTimestamp() });
};

// ── Site Settings ─────────────────────────────────────────
export const getSiteSettings = async () => {
  const snap = await getDoc(doc(db, 'settings', 'siteSettings'));
  return snap.exists() ? snap.data() : null;
};

export const updateSiteSettings = async (data) => {
  return setDoc(doc(db, 'settings', 'siteSettings'), { ...data, updatedAt: serverTimestamp() });
};

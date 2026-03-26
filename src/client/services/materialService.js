import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../config/Firebase';

const MATERIALS_COLLECTION = 'materials';

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeMaterial = (docSnap) => {
  const data = docSnap.data() || {};
  const createdAtRaw = data.createdAt;
  const createdAt = createdAtRaw?.toDate ? createdAtRaw.toDate().toISOString() : (createdAtRaw || new Date(0).toISOString());

  return {
    id: docSnap.id,
    _id: docSnap.id,
    materialCode: data.materialCode || '',
    yarnType: data.yarnType || '',
    color: data.color || '',
    pricePerMeter: toNumber(data.pricePerMeter),
    stock: toNumber(data.stock),
    description: data.description || '',
    imageURL: data.imageURL || '',
    createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : null,
  };
};

const parsePayload = (payload) => {
  if (!(payload instanceof FormData)) {
    return {
      materialCode: payload.materialCode || '',
      yarnType: payload.yarnType || '',
      color: payload.color || '',
      pricePerMeter: toNumber(payload.pricePerMeter),
      stock: toNumber(payload.stock),
      description: payload.description || '',
      imageFile: payload.image || null,
    };
  }

  return {
    materialCode: String(payload.get('materialCode') || ''),
    yarnType: String(payload.get('yarnType') || ''),
    color: String(payload.get('color') || ''),
    pricePerMeter: toNumber(payload.get('pricePerMeter')),
    stock: toNumber(payload.get('stock')),
    description: String(payload.get('description') || ''),
    imageFile: payload.get('image') instanceof File ? payload.get('image') : null,
  };
};

const uploadMaterialImage = async (imageFile, materialCode) => {
  if (!imageFile) return '';
  const safeCode = (materialCode || 'material').replace(/[^a-zA-Z0-9-_]/g, '-');
  const imageRef = ref(storage, `materials/${safeCode}-${Date.now()}-${imageFile.name}`);
  await uploadBytes(imageRef, imageFile);
  return getDownloadURL(imageRef);
};

export const getMaterials = async () => {
  const snapshot = await getDocs(collection(db, MATERIALS_COLLECTION));
  return snapshot.docs
    .map(normalizeMaterial)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const addMaterial = async (payload) => {
  const parsed = parsePayload(payload);

  if (!parsed.materialCode || !parsed.yarnType || !parsed.color) {
    throw new Error('Material code, yarn type and color are required.');
  }

  const existing = await getMaterials();
  if (existing.some((m) => m.materialCode.toLowerCase() === parsed.materialCode.toLowerCase())) {
    throw new Error('Material code already exists.');
  }

  const imageURL = await uploadMaterialImage(parsed.imageFile, parsed.materialCode);

  const docRef = await addDoc(collection(db, MATERIALS_COLLECTION), {
    materialCode: parsed.materialCode,
    yarnType: parsed.yarnType,
    color: parsed.color,
    pricePerMeter: parsed.pricePerMeter,
    stock: parsed.stock,
    description: parsed.description,
    imageURL,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    _id: docRef.id,
    id: docRef.id,
    ...parsed,
    imageURL,
  };
};

export const updateMaterial = async (id, payload) => {
  if (!id) throw new Error('Material id is required.');
  const parsed = parsePayload(payload);

  const updates = {
    materialCode: parsed.materialCode,
    yarnType: parsed.yarnType,
    color: parsed.color,
    pricePerMeter: parsed.pricePerMeter,
    stock: parsed.stock,
    description: parsed.description,
    updatedAt: serverTimestamp(),
  };

  if (parsed.imageFile) {
    updates.imageURL = await uploadMaterialImage(parsed.imageFile, parsed.materialCode);
  }

  await updateDoc(doc(db, MATERIALS_COLLECTION, id), updates);
  return { _id: id, id, ...updates };
};

export const deleteMaterial = async (id) => {
  if (!id) throw new Error('Material id is required.');
  await deleteDoc(doc(db, MATERIALS_COLLECTION, id));
  return { message: 'Material deleted successfully' };
};

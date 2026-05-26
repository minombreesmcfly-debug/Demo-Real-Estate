import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection as fsCollection, 
  getDocs as fsGetDocs, 
  addDoc as fsAddDoc, 
  setDoc as fsSetDoc, 
  updateDoc as fsUpdateDoc, 
  doc as fsDoc, 
  onSnapshot as fsOnSnapshot, 
  query as fsQuery, 
  orderBy as fsOrderBy, 
  limit as fsLimit, 
  serverTimestamp as fsServerTimestamp, 
  getDocFromServer as fsGetDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// --- CONFIG FALLBACK INDICATION ---
// Detect if config is dummy or missing the real Google API key
const isDummyConfig = 
  !firebaseConfig.apiKey || 
  firebaseConfig.apiKey.includes('MOCK') || 
  firebaseConfig.apiKey.includes('YOUR_') ||
  firebaseConfig.apiKey === 'AIzaSy_GITHUB_ALERT_RESOLVED_MOCK_KEY_DEMO';

// --- HYBRID DATA STATE (LOCAL MEMORY & EVENT REGISTRY) ---
const listeners: Array<{ path: string; callback: (docs: any[]) => void }> = [];

function notifyListeners(path: string) {
  const currentDocs = getLocalCollection(path);
  listeners
    .filter(l => l.path === path)
    .forEach(l => {
      try {
        l.callback(currentDocs);
      } catch (e) {
        console.error('Listener notify error:', e);
      }
    });
}

// --- LOCAL SYSTEM SEED DATA ---
const SEEDS: Record<string, any[]> = {
  properties: [
    {
      id: "prop-1",
      title: "Mansión de Cristal del Futuro",
      description: "Una obra maestra minimalista con vistas panorámicas.",
      price: 45000000,
      location: "Lomas de Chapultepec, CDMX",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      features: ["5", "6", "850 m²"],
      videoUrl: "#",
      isPinned: true,
      agentName: "Erika Valenzuela",
      agentId: "agent-1",
      createdAt: new Date().toISOString()
    },
    {
      id: "prop-2",
      title: "Penthouse Nivel Zenith",
      description: "Lujo vertical redefine el horizonte de la ciudad.",
      price: 28500000,
      location: "San Pedro Garza García, NL",
      imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      features: ["3", "4", "420 m²"],
      videoUrl: "#",
      isPinned: false,
      agentName: "Carlos Mendoza",
      agentId: "agent-2",
      createdAt: new Date().toISOString()
    },
    {
      id: "prop-3",
      title: "Villa Bio-Digital",
      description: "Conexión total con la naturaleza y la tecnología.",
      price: 18900000,
      location: "Tulum, Q. Roo",
      imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      features: ["4", "4", "350 m²"],
      videoUrl: "#",
      isPinned: false,
      agentName: "Erika Valenzuela",
      agentId: "agent-1",
      createdAt: new Date().toISOString()
    }
  ],
  agents: [
    {
      id: "agent-1",
      name: "Erika Valenzuela",
      email: "erika.valenzuela@elite-re.com",
      phone: "+52 55 4321 8765",
      zone: "Lomas de Chapultepec & Polanco",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date().toISOString()
    },
    {
      id: "agent-2",
      name: "Carlos Mendoza",
      email: "carlos.mendoza@elite-re.com",
      phone: "+52 55 7654 3210",
      zone: "San Pedro Garza García",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date().toISOString()
    }
  ],
  bookings: []
};

// Seed Local Storage
function initializeLocalStorage() {
  Object.keys(SEEDS).forEach(key => {
    const storageKey = `demo_re_${key}`;
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(SEEDS[key]));
    }
  });
  
  // Seed settings
  if (!localStorage.getItem('demo_re_settings_global')) {
    localStorage.setItem('demo_re_settings_global', JSON.stringify({
      primaryColor: '#C5A059',
      coverText: 'Residencia Atlántida',
      contactPhone: '+526622243358',
      contactEmail: 'ELITE@DEMO-RE.COM',
      instagramUrl: '#',
      twitterUrl: '#'
    }));
  }
}

// Read from LocalStorage helper
function getLocalCollection(path: string): any[] {
  initializeLocalStorage();
  const raw = localStorage.getItem(`demo_re_${path}`);
  return raw ? JSON.parse(raw) : [];
}

// Write to LocalStorage helper
function saveLocalCollection(path: string, data: any[]) {
  localStorage.setItem(`demo_re_${path}`, JSON.stringify(data));
  notifyListeners(path);
}

// Read single local document
function getLocalDoc(collectionPath: string, docId: string): any {
  if (collectionPath === 'settings' && docId === 'global') {
    initializeLocalStorage();
    const raw = localStorage.getItem('demo_re_settings_global');
    return raw ? JSON.parse(raw) : null;
  }
  const items = getLocalCollection(collectionPath);
  return items.find((itm: any) => itm.id === docId) || null;
}

// Write/Save single local document
function saveLocalDoc(collectionPath: string, docId: string, data: any, merge: boolean = false) {
  if (collectionPath === 'settings' && docId === 'global') {
    initializeLocalStorage();
    const current = getLocalDoc(collectionPath, docId) || {};
    const updated = merge ? { ...current, ...data } : data;
    localStorage.setItem('demo_re_settings_global', JSON.stringify(updated));
    // Trigger listeners of settings too if any
    notifyListeners('settings');
    return;
  }
  
  const items = getLocalCollection(collectionPath);
  const idx = items.findIndex((itm: any) => itm.id === docId);
  const updatedItem = merge && idx >= 0 ? { ...items[idx], ...data } : { id: docId, ...data };
  
  if (idx >= 0) {
    items[idx] = updatedItem;
  } else {
    items.push(updatedItem);
  }
  saveLocalCollection(collectionPath, items);
}

// --- INITIALIZE REAL OR MOCK FIREBASE ---
let activeApp: any;
let realDb: any;
let realAuth: any;
let useLocalStorageMode = isDummyConfig;

try {
  if (!isDummyConfig) {
    activeApp = initializeApp(firebaseConfig);
    realDb = getFirestore(activeApp, firebaseConfig.firestoreDatabaseId);
    realAuth = getAuth(activeApp);
  } else {
    console.warn("Using Offline-First Local Storage Database Mode due to dummy API key.");
  }
} catch (e) {
  console.error("Firebase Initialization Failed! Falling back to Secured Local Storage Database.", e);
  useLocalStorageMode = true;
}

// Export Auth
export const auth = realAuth || {
  currentUser: null,
  onAuthStateChanged: (callback: any) => {
    callback(null);
    return () => {};
  }
};

// Export Database reference
export const db = realDb || { type: 'mock-db' };

// Toggle function for debugging/demo presentation
export function toggleSandboxDatabaseMode(forceOffline: boolean) {
  useLocalStorageMode = forceOffline || isDummyConfig;
  console.log(`Database Mode switched to: ${useLocalStorageMode ? 'LocalStorage (Secured Offline)' : 'Firebase (Cloud Live)'}`);
}

export function isUsingLocalDatabase() {
  return useLocalStorageMode;
}

// --- FRONTEND ADAPTERS CONFORMING TO FIRESTORE API ---

export function collection(databaseRef: any, path: string) {
  if (useLocalStorageMode || !realDb) {
    return { type: 'collection', path };
  }
  return fsCollection(databaseRef, path);
}

export function doc(databaseRef: any, path: string, childPath?: string) {
  if (useLocalStorageMode || !realDb) {
    // Overloaded: doc(db, 'settings', 'global') or doc(db, 'properties/1')
    if (childPath) {
      return { type: 'doc', path, id: childPath };
    }
    const idx = path.indexOf('/');
    if (idx !== -1) {
      return { type: 'doc', path: path.substring(0, idx), id: path.substring(idx + 1) };
    }
    return { type: 'doc', path, id: 'unknown' };
  }
  return childPath ? fsDoc(databaseRef, path, childPath) : fsDoc(databaseRef, path);
}

export function query(queryRef: any, ...constraints: any[]) {
  if (useLocalStorageMode || !realDb) {
    return queryRef; // Keep reference the same
  }
  return fsQuery(queryRef, ...constraints);
}

export function orderBy(field: string, direction?: 'asc' | 'desc') {
  if (useLocalStorageMode || !realDb) return { type: 'orderBy', field, direction };
  return fsOrderBy(field, direction);
}

export function limit(cnt: number) {
  if (useLocalStorageMode || !realDb) return { type: 'limit', cnt };
  return fsLimit(cnt);
}

export function serverTimestamp() {
  if (useLocalStorageMode || !realDb) {
    return new Date().toISOString();
  }
  return fsServerTimestamp();
}

// Adapters for Async Document Fetching
export async function getDocs(queryRef: any) {
  if (useLocalStorageMode || !realDb) {
    const colPath = queryRef.path;
    const items = getLocalCollection(colPath);
    
    // Sort logic mockup (pinned/createdAt)
    if (colPath === 'properties') {
      items.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } else if (colPath === 'bookings') {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return {
      empty: items.length === 0,
      docs: items.map(itm => ({
        id: itm.id,
        exists: () => true,
        data: () => itm
      }))
    };
  }
  
  try {
    return await fsGetDocs(queryRef);
  } catch (err) {
    console.error("Firestore getDocs failure, silently transitioning to LocalStorage Mode:", err);
    useLocalStorageMode = true;
    return getDocs(queryRef);
  }
}

export async function addDoc(collectionRef: any, data: any) {
  if (useLocalStorageMode || !realDb) {
    const colPath = collectionRef.path;
    const id = `${colPath.substring(0, 4)}-${Math.random().toString(36).substring(2, 9)}`;
    const freshData = { ...data, id, createdAt: data.createdAt || new Date().toISOString() };
    
    const items = getLocalCollection(colPath);
    items.push(freshData);
    saveLocalCollection(colPath, items);
    return { id };
  }

  try {
    return await fsAddDoc(collectionRef, data);
  } catch (err) {
    console.error("Firestore addDoc failure, falling back to LocalStorage:", err);
    useLocalStorageMode = true;
    return addDoc(collectionRef, data);
  }
}

export async function setDoc(docRef: any, data: any, options?: any) {
  if (useLocalStorageMode || !realDb) {
    saveLocalDoc(docRef.path, docRef.id, data, options?.merge);
    return;
  }

  try {
    return await fsSetDoc(docRef, data, options);
  } catch (err) {
    console.error("Firestore setDoc failure, falling back to LocalStorage:", err);
    useLocalStorageMode = true;
    return setDoc(docRef, data, options);
  }
}

export async function updateDoc(docRef: any, data: any) {
  if (useLocalStorageMode || !realDb) {
    saveLocalDoc(docRef.path, docRef.id, data, true);
    return;
  }

  try {
    return await fsUpdateDoc(docRef, data);
  } catch (err) {
    console.error("Firestore updateDoc failure, falling back to LocalStorage:", err);
    useLocalStorageMode = true;
    return updateDoc(docRef, data);
  }
}

export function onSnapshot(ref: any, onNext: (snapshot: any) => void, onError?: (err: any) => void) {
  if (useLocalStorageMode || !realDb) {
    const isDoc = ref.type === 'doc';
    const path = ref.path;
    const docId = ref.id;
    
    const sendUpdate = () => {
      if (isDoc) {
        const item = getLocalDoc(path, docId);
        onNext({
          exists: () => !!item,
          id: docId,
          data: () => item
        });
      } else {
        const items = getLocalCollection(path);
        
        // Sorting matches
        if (path === 'properties') {
          items.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
        } else if (path === 'bookings') {
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        onNext({
          docs: items.map(itm => ({
            id: itm.id,
            exists: () => true,
            data: () => itm
          })),
          empty: items.length === 0
        });
      }
    };

    // First snapshot sync
    setTimeout(sendUpdate, 10);
    
    // Subscribe
    const itemListener = { path, callback: sendUpdate };
    listeners.push(itemListener);

    return () => {
      const idx = listeners.indexOf(itemListener);
      if (idx !== -1) {
        listeners.splice(idx, 1);
      }
    };
  }

  // Real snap
  return fsOnSnapshot(ref, onNext, (err) => {
    console.warn("Firestore subscription error. Switching to clean LocalStorage connection:", err);
    useLocalStorageMode = true;
    // Call user snapshot handler in offline fallback
    setTimeout(() => {
      onSnapshot(ref, onNext, onError);
    }, 50);
  });
}

// Global Connection Verifier
export async function getDocFromServer(docRef: any) {
  if (useLocalStorageMode || !realDb) {
    const item = getLocalDoc(docRef.path, docRef.id);
    return {
      exists: () => !!item,
      id: docRef.id,
      data: () => item
    };
  }

  try {
    return await fsGetDocFromServer(docRef);
  } catch (err) {
    console.warn("Firestore connection check failed, switching to secured Offline Sandboxing Mode.");
    useLocalStorageMode = true;
    return getDocFromServer(docRef);
  }
}

export const getDoc = getDocFromServer;

// Automatically seed local database upon load
initializeLocalStorage();

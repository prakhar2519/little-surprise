import LZString from 'lz-string';

// Encode surprise object into compact URL safe hash string (fallback)
export function encodeSurprise(data) {
  try {
    const jsonStr = JSON.stringify(data);
    return LZString.compressToEncodedURIComponent(jsonStr);
  } catch (err) {
    console.error('Failed to encode surprise:', err);
    return null;
  }
}

// Decode compressed hash string back to surprise object
export function decodeSurprise(hashStr) {
  try {
    if (!hashStr) return null;
    const cleanHash = hashStr.startsWith('#') ? hashStr.slice(1) : hashStr;
    const jsonStr = LZString.decompressFromEncodedURIComponent(cleanHash);
    if (!jsonStr) return null;
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('Failed to decode surprise:', err);
    return null;
  }
}

// Save surprise to local server API to produce ultra-short 6-char link
export async function createShortSurprise(data) {
  try {
    const response = await fetch('/api/surprises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.id) {
        return result.id;
      }
    }
  } catch (err) {
    console.warn('Local API save failed, falling back to hash', err);
  }
  return null;
}

// Fetch surprise by short ID from server API
export async function fetchShortSurprise(id) {
  try {
    const response = await fetch(`/api/surprises/${id}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.error('Failed to fetch short surprise', err);
  }
  return null;
}

// Upload photo to server to replace giant base64 strings with tiny URLs (/uploads/...)
export async function uploadPhotoToServer(base64Data) {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64Data }),
    });
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.url) {
        return result.url;
      }
    }
  } catch (e) {
    console.warn('Server photo upload failed, using local data', e);
  }
  return base64Data;
}

// Get public base URL so share links work on external phones
export async function getPublicBaseUrl() {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return window.location.origin + window.location.pathname;
  }
  try {
    const res = await fetch('/api/tunnel');
    if (res.ok) {
      const data = await res.json();
      if (data.publicUrl) {
        return data.publicUrl + '/';
      }
    }
  } catch (e) {}
  return window.location.origin + window.location.pathname;
}

// Generate shareable URL - generates a clean short link that works on mobile
export async function generateShareUrl(data) {
  const shortId = await createShortSurprise(data);
  const baseUrl = await getPublicBaseUrl();

  if (shortId) {
    return `${baseUrl}#s=${shortId}`;
  }

  // Fallback to compressed hash if API is unavailable
  const hash = encodeSurprise(data);
  return `${baseUrl}#experience=${hash}`;
}

// Client-side image compression
export function compressImage(file, maxWidth = 500, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Return compressed JPEG data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

// Local Storage for Creator's saved surprises
const STORAGE_KEY = 'littlesurprise_surprises_v1';
const LEGACY_STORAGE_KEY = 'koikoi_free_surprises_v1';

export function getSavedSurprises() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function saveSurpriseToHistory(surprise) {
  try {
    const existing = getSavedSurprises();
    const item = {
      ...surprise,
      id: surprise.id || 'surp_' + Date.now(),
      createdAt: surprise.createdAt || new Date().toISOString()
    };
    const index = existing.findIndex(s => s.id === item.id);
    if (index >= 0) {
      existing[index] = item;
    } else {
      existing.unshift(item);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return item;
  } catch (e) {
    console.error('Failed to save to localStorage', e);
    return surprise;
  }
}

export function deleteSurpriseFromHistory(id) {
  try {
    const existing = getSavedSurprises().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return existing;
  } catch (e) {
    console.error(e);
    return [];
  }
}

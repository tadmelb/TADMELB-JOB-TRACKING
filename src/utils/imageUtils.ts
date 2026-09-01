import { PhotoCategory } from '../types';

/**
 * Compresses an image file (e.g. from mobile camera or file picker)
 * into a lightweight Base64 JPEG data URL suitable for Firestore & localStorage storage.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<{ dataUrl: string; size: number; name: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scale
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw image onto canvas with anti-aliasing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp or jpeg (jpeg has universal support)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // Approximate size in bytes
        const stringLength = compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
        const sizeInBytes = Math.round(stringLength * 0.75);

        resolve({
          dataUrl: compressedDataUrl,
          size: sizeInBytes,
          name: file.name
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image file'));
      };

      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };

    reader.readAsDataURL(file);
  });
}

export interface PhotoCategoryMeta {
  id: PhotoCategory;
  label: string;
  labelEn: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  dotColor: string;
}

export const PHOTO_CATEGORIES: PhotoCategoryMeta[] = [
  {
    id: 'before',
    label: 'Trước Thi Công',
    labelEn: 'Before',
    badgeBg: 'bg-amber-50',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-300',
    dotColor: 'bg-amber-500'
  },
  {
    id: 'during',
    label: 'Đang Thi Công',
    labelEn: 'In Progress',
    badgeBg: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    dotColor: 'bg-blue-500'
  },
  {
    id: 'after',
    label: 'Hoàn Thiện / Nghiệm Thu',
    labelEn: 'After / Completed',
    badgeBg: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    dotColor: 'bg-emerald-500'
  },
  {
    id: 'drawing',
    label: 'Bản Vẽ & Mặt Bằng',
    labelEn: 'Plans & Drawings',
    badgeBg: 'bg-indigo-50',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-300',
    dotColor: 'bg-indigo-500'
  },
  {
    id: 'receipt',
    label: 'Hóa Đơn / Biên Nhận',
    labelEn: 'Receipts & Dockets',
    badgeBg: 'bg-purple-50',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-300',
    dotColor: 'bg-purple-500'
  },
  {
    id: 'general',
    label: 'Ảnh Khác',
    labelEn: 'General',
    badgeBg: 'bg-slate-50',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-300',
    dotColor: 'bg-slate-500'
  }
];

export function getPhotoCategoryMeta(category: PhotoCategory): PhotoCategoryMeta {
  return (
    PHOTO_CATEGORIES.find((c) => c.id === category) || {
      id: 'general',
      label: 'Ảnh Khác',
      labelEn: 'General',
      badgeBg: 'bg-slate-50',
      textColor: 'text-slate-800',
      borderColor: 'border-slate-300',
      dotColor: 'bg-slate-500'
    }
  );
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes === 0) return '';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

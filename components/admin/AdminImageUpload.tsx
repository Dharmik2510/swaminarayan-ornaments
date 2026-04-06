'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Upload, X, GripVertical, Star } from 'lucide-react';
import { uploadImageToStorage, compressImageToBlob } from '@/lib/firebase-upload';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function AdminImageUpload({ images, onChange, maxImages = 8 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draggingOver, setDraggingOver] = useState(false);
  const [processing, setProcessing] = useState(false);

  const processFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setProcessing(true);
    const toAdd = Array.from(files).slice(0, maxImages - images.length);
    const results: string[] = [];
    for (const file of toAdd) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const compressedBlob = await compressImageToBlob(file);
        const downloadUrl = await uploadImageToStorage(compressedBlob, file.name);
        results.push(downloadUrl);
      } catch (err) {
        console.error("Failed to upload image", err);
      }
    }
    onChange([...images, ...results]);
    setProcessing(false);
  }, [images, maxImages, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggingOver(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const setPrimary = (index: number) => {
    if (index === 0) return;
    const copy = [...images];
    [copy[0], copy[index]] = [copy[index], copy[0]];
    onChange(copy);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
          onDragLeave={() => setDraggingOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-2.5 py-9 px-4
            border border-dashed rounded-xl transition-all duration-200 cursor-pointer
            ${draggingOver || processing
              ? 'border-[rgba(212,175,55,0.4)] bg-[rgba(212,175,55,0.04)]'
              : 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.015]'}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => processFiles(e.target.files)}
          />
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 ${
            draggingOver ? 'bg-[rgba(212,175,55,0.12)]' : 'bg-white/[0.04]'
          }`}>
            <Upload className={`w-4 h-4 ${draggingOver ? 'text-[#D4AF37]' : 'text-white/25'}`} />
          </div>
          <div className="text-center">
            <p className="text-white/50 text-sm">
              {processing ? 'Processing…' : 'Drop images or click to upload'}
            </p>
            <p className="text-white/25 text-xs mt-0.5">
              JPEG · PNG · WebP — auto-compressed &middot; {images.length}/{maxImages}
            </p>
          </div>
        </div>
      )}

      {/* Image grid with drag-to-reorder */}
      {images.length > 0 && (
        <Reorder.Group
          axis="x"
          values={images}
          onReorder={onChange}
          className="flex flex-wrap gap-3"
        >
          <AnimatePresence>
            {images.map((src, i) => (
              <Reorder.Item key={src} value={src} className="relative group">
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className={`
                    relative w-24 h-24 rounded-xl overflow-hidden border-2 transition-colors duration-200
                    ${i === 0 ? 'border-[#D4AF37]/70' : 'border-white/[0.08] hover:border-white/20'}
                  `}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Product image ${i + 1}`} className="w-full h-full object-cover" />

                  {i === 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black text-[8px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap tracking-wider">
                      MAIN
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-1">
                    {i !== 0 && (
                      <button
                        type="button"
                        onClick={() => setPrimary(i)}
                        title="Set as primary"
                        className="p-1 bg-white/10 hover:bg-[rgba(212,175,55,0.25)] rounded transition-colors"
                      >
                        <Star className="w-3 h-3 text-white" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      title="Remove"
                      className="p-1 bg-white/10 hover:bg-red-500/40 rounded transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                    <div className="p-1 cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-3 h-3 text-white/50" />
                    </div>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}
    </div>
  );
}

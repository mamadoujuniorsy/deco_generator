"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import CreateLayoutForm from "./CreateLayoutForm";

function CreateLayoutContent() {
  const [img, setImg] = useState<{ src: string; file: File } | null>(null);

  const chooseFile = (file: File | null) => {
    if (file) {
      const src = URL.createObjectURL(file);
      setImg({ src, file });
    }
  };

  return (
    <div className="py-2">
      <div className="flex flex-col md:flex-row gap-1">
        {/* Left side: Image preview */}
        <div className="flex-1 bg-gray-100 rounded-lg shadow-lg flex items-center justify-center">
          {img ? (
            <Image
              src={img.src}
              alt="Uploaded preview"
              width={500}
              height={500}
              className="object-contain rounded-lg"
              style={{ width: "auto", height: "auto" }}
            />
          ) : (
            <p className="text-gray-500">Votre rendu apparaitra ici</p>
          )}
        </div>

        {/* Right side: Form */}
        <div className="rounded-lg shadow-lg bg-black/80">
          <CreateLayoutForm chooseFile={chooseFile!} />
        </div>
      </div>
    </div>
  );
}

export default function CreateLayoutMainSection() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateLayoutContent />
    </Suspense>
  );
}

"use client";

import { translations } from "@/lib/supabase/translations";
import { useLanguage } from "./LanguageProvider";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const galleryImages = [
  {
    src: `${supabaseUrl}/storage/v1/object/public/church-images/home/gallery-1.jpg`,
    alt: "Our Lady of Holy Rosary Church",
  },
  {
    src: `${supabaseUrl}/storage/v1/object/public/church-images/home/gallery-2.jpg`,
    alt: "Church interior",
  },
  {
    src: `${supabaseUrl}/storage/v1/object/public/church-images/home/gallery-3.jpg`,
    alt: "Church altar",
  },
  {
    src: `${supabaseUrl}/storage/v1/object/public/church-images/home/gallery-4.jpg`,
    alt: "Our Lady statue",
  },
  {
    src: `${supabaseUrl}/storage/v1/object/public/church-images/home/gallery-5.jpg`,
    alt: "Church prayer space",
  },
];

export default function AnimatedGallery() {
  const { language } = useLanguage();

  const t = translations[language];

  return (
    <section className="animated-gallery-section">
      <div className="container">
        <div className="gallery-heading">
          <span className="section-eyebrow">
            {t.home.gallery.eyebrow}
          </span>

          <h2 className="serif">
            {t.home.gallery.title}
          </h2>

          <p>
            {t.home.gallery.description}
          </p>
        </div>

        <div className="animated-gallery-track">
          {[...galleryImages, ...galleryImages].map((image, index) => (
            <div
              className="animated-gallery-card"
              key={`${image.src}-${index}`}
            >
              <img
                src={image.src}
                alt={image.alt}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
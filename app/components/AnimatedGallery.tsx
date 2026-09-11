"use client";

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
  return (
    <section className="animated-gallery-section">
      <div className="container">
        <div className="gallery-heading">
          <span className="section-eyebrow">
            Our Church in Pictures
          </span>

          <h2 className="serif">
            Moments of Faith and Community
          </h2>

          <p>
            Explore the beauty, prayer, celebrations and memories
            of our parish community.
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
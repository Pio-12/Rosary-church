"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Images,
  Sparkles,
} from "lucide-react";
import { getGalleryItems } from "../../lib/supabase/gallery";

type GalleryItem = {
  id: string;
  title?: string | null;
  description?: string | null;
  image_url: string;
  category_id?: string | null;
};

const categories = [
  "All",
  "Church",
  "Holy Mass",
  "Feasts",
  "Processions",
  "Events",
  "Community",
];

const stripWords = [
  "FAITH",
  "HOPE",
  "LOVE",
  "PRAYER",
  "COMMUNITY",
  "GRACE",
  "TOGETHERNESS",
];

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] =
    useState<GalleryItem | null>(null);

  /*
   * Load gallery images from Supabase
   */
  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await getGalleryItems();

        setPhotos(data || []);
      } catch (error) {
        console.error("Gallery loading error:", error);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  /*
   * Automatically change the top showcase image
   */
  useEffect(() => {
    if (photos.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % photos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [photos.length]);

  /*
   * Close lightbox when Escape is pressed
   */
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const activePhoto = photos[activeIndex];

  /*
   * Filter gallery images
   */
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === "All") {
      return photos;
    }

    return photos.filter((photo) => {
      const searchableText = `
        ${photo.title || ""}
        ${photo.description || ""}
        ${photo.category_id || ""}
      `.toLowerCase();

      return searchableText.includes(selectedCategory.toLowerCase());
    });
  }, [photos, selectedCategory]);

  /*
   * Top showcase controls
   */
  const previousSlide = () => {
    if (!photos.length) return;

    setActiveIndex((previous) =>
      previous === 0 ? photos.length - 1 : previous - 1
    );
  };

  const nextSlide = () => {
    if (!photos.length) return;

    setActiveIndex((previous) => (previous + 1) % photos.length);
  };

  /*
   * Reset active image when category changes
   */
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <main className="gallery-page">
      {/* =====================================================
          1. TOP ANIMATED GALLERY SHOWCASE
      ====================================================== */}

      <section className="gallery-showcase">
        <div className="gallery-showcase-background">
          {activePhoto ? (
            <img
              key={activePhoto.id}
              src={activePhoto.image_url}
              alt={activePhoto.title || "Church gallery image"}
            />
          ) : (
            <div className="gallery-showcase-placeholder" />
          )}
        </div>

        <div className="gallery-showcase-overlay" />

        <div className="container gallery-showcase-content">
          <div className="gallery-showcase-copy">
            <div className="eyebrow gallery-light-eyebrow">
              <Sparkles size={14} />
              Life of our parish
            </div>

            <h1 className="gallery-showcase-title">
              Moments of
              <span>Faith & Grace</span>
            </h1>

            <p>
              A collection of beautiful memories, celebrations, prayers and
              moments from Our Lady of Holy Rosary Church.
            </p>

            <a
              href="#church-pictures"
              className="button gallery-showcase-button"
            >
              Explore the gallery
              <ArrowRight size={16} />
            </a>
          </div>

          {activePhoto && (
            <div className="showcase-caption">
              <span className="showcase-caption-number">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>

              <div>
                <strong>
                  {activePhoto.title || "Moments of Grace"}
                </strong>

                <span>
                  {activePhoto.description ||
                    "Memories from our parish community"}
                </span>
              </div>
            </div>
          )}

          <div className="showcase-controls">
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous gallery image"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="showcase-dots">
              {photos.slice(0, 8).map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  className={activeIndex === index ? "active" : ""}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show gallery image ${index + 1}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next gallery image"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          2. MOVING TEXT STRIP
      ====================================================== */}

      <section
        className="gallery-marquee"
        aria-label="Parish values"
      >
        <div className="gallery-marquee-track">
          {[...stripWords, ...stripWords].map((word, index) => (
            <span key={`${word}-${index}`}>
              {word}
              <b>✦</b>
            </span>
          ))}
        </div>
      </section>

      {/* =====================================================
          3. EVERY MOMENT TELLS A STORY
      ====================================================== */}

      <section className="section gallery-story-section">
        <div className="container gallery-story-grid">
          <div className="gallery-story-visual">
            {photos.length > 0 ? (
              <>
                <div className="story-image-main">
                  <img
                    src={
                      photos[(activeIndex + 1) % photos.length]?.image_url ||
                      photos[0].image_url
                    }
                    alt="Parish moment"
                    loading="lazy"
                  />
                </div>

                <div className="story-image-small">
                  <img
                    src={
                      photos[(activeIndex + 2) % photos.length]?.image_url ||
                      photos[0].image_url
                    }
                    alt="Church celebration"
                    loading="lazy"
                  />
                </div>
              </>
            ) : (
              <div className="story-image-placeholder" />
            )}

            <div className="story-floating-label">
              <Images size={18} />
              <span>Moments of grace</span>
            </div>

            <div className="story-circle story-circle-one" />
            <div className="story-circle story-circle-two" />
          </div>

          <div className="gallery-story-content">
            <div className="eyebrow">Life of our parish</div>

            <h2 className="section-title">
              Every Moment
              <span>Tells a Story</span>
            </h2>

            <p className="body-copy">
              From Holy Mass and processions to parish celebrations and
              community gatherings, every photograph reflects the faith,
              devotion and togetherness of our church family.
            </p>

            <div className="story-stats">
              <div>
                <strong>{photos.length || "12"}+</strong>
                <span>Memories</span>
              </div>

              <div>
                <strong>1</strong>
                <span>Faith community</span>
              </div>

              <div>
                <strong>∞</strong>
                <span>Grace-filled moments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          4. OUR CHURCH IN PICTURES
      ====================================================== */}

      <section
        className="section gallery-pictures-section"
        id="church-pictures"
      >
        <div className="container">
          <div className="gallery-heading-row">
            <div>
              <div className="eyebrow">Moments of faith</div>

              <h2 className="section-title">
                Our Church in Pictures
              </h2>
            </div>

            <p className="body-copy gallery-heading-copy">
              Explore moments from the life of Our Lady of Holy Rosary Church,
              from worship and celebrations to community life.
            </p>
          </div>

          {/* =================================================
              5. FILTER BUTTONS
          ================================================== */}

          <div
            className="gallery-filter-row"
            role="tablist"
            aria-label="Gallery categories"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category}
                className={`gallery-filter ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* =================================================
              6. ANIMATED IMAGE GRID / MOBILE SWIPE GALLERY
          ================================================== */}

          {loading ? (
            <div className="gallery-loading">
              <div className="gallery-loader" />
              <p>Loading beautiful memories...</p>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="empty-state">
              <p>No gallery images available for this category.</p>
            </div>
          ) : (
            <>
              <div className="animated-gallery-grid">
                {filteredPhotos.map((photo, index) => (
                  <button
                    type="button"
                    className={`animated-gallery-card gallery-card-${
                      index % 6
                    }`}
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    aria-label={`View ${
                      photo.title || "gallery image"
                    }`}
                  >
                    <div className="animated-gallery-image">
                      <img
                        src={photo.image_url}
                        alt={
                          photo.title ||
                          "Our Lady of Holy Rosary Church, Madurai"
                        }
                        loading={index < 3 ? "eager" : "lazy"}
                      />

                      <div className="animated-gallery-overlay">
                        <span>View memory</span>
                        <ArrowRight size={17} />
                      </div>

                      <div className="gallery-card-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    {(photo.title || photo.description) && (
                      <div className="animated-gallery-caption">
                        {photo.title && <h3>{photo.title}</h3>}

                        {photo.description && (
                          <p>{photo.description}</p>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Mobile swipe instruction */}
              <div className="gallery-swipe-hint">
                <span>Swipe to explore more moments</span>
                <span className="gallery-swipe-arrow">→</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* =====================================================
          7. MOVING IMAGE STRIP
      ====================================================== */}

      {!loading && photos.length > 0 && (
        <section
          className="moving-image-strip"
          aria-label="Gallery highlights"
        >
          <div className="moving-image-track">
            {[...photos, ...photos].map((photo, index) => (
              <div
                className="moving-strip-image"
                key={`${photo.id}-${index}`}
              >
                <img
                  src={photo.image_url}
                  alt={photo.title || "Parish gallery"}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          8. VIRTUAL TOUR
      ====================================================== */}

      <section className="section virtual-tour-section">
        <div className="container">
          <div className="virtual-tour-grid">
            <div className="virtual-tour-content">
              <div className="eyebrow">Explore the church</div>

              <h2 className="section-title">
                Take a 360°
                <span>Virtual Tour</span>
              </h2>

              <p className="body-copy">
                Experience Our Lady of Holy Rosary Church from wherever you
                are. Explore the church through Google Maps and discover its
                sacred spaces, architecture and surroundings.
              </p>

              <a
                href="https://maps.app.goo.gl/u3AGkmedtFd44oqJ7"
                target="_blank"
                rel="noopener noreferrer"
                className="button"
              >
                Open 360° Virtual Tour
                <ExternalLink size={16} />
              </a>
            </div>

            <div className="virtual-tour-map">
              <iframe
                src="https://www.google.com/maps?q=Our%20Lady%20of%20Holy%20Rosary%20Church%2C%20Madurai&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Lady of Holy Rosary Church, Madurai"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          9. IMAGE LIGHTBOX
      ====================================================== */}

      {selectedPhoto && (
        <div
          className="gallery-lightbox"
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
        >
          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Close image preview"
          >
            ×
          </button>

          <div
            className="gallery-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedPhoto.image_url}
              alt={selectedPhoto.title || "Gallery image"}
            />

            {(selectedPhoto.title || selectedPhoto.description) && (
              <div className="gallery-lightbox-caption">
                {selectedPhoto.title && (
                  <h3>{selectedPhoto.title}</h3>
                )}

                {selectedPhoto.description && (
                  <p>{selectedPhoto.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
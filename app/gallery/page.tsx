"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { PageHero } from "../components/site";
import { getGalleryItems } from "../../lib/supabase/gallery";

type GalleryItem = {
  id: string;
  title?: string | null;
  description?: string | null;
  image_url: string;
  category_id?: string | null;
};

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      const data = await getGalleryItems();

      setPhotos(data || []);
      setLoading(false);
    }

    loadGallery();
  }, []);

  const categories = [
    "All",
    "Church",
    "Holy Mass",
    "Feasts",
    "Processions",
    "Events",
    "Community",
  ];

  const filteredPhotos =
    selectedCategory === "All"
      ? photos
      : photos.filter(
          (photo) =>
            photo.title
              ?.toLowerCase()
              .includes(selectedCategory.toLowerCase()) ||
            photo.description
              ?.toLowerCase()
              .includes(selectedCategory.toLowerCase())
        );

  return (
    <main>
      <PageHero title="Gallery" crumb="Gallery" />

      {/* Photo Gallery */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Moments of faith</div>

          <h2 className="section-title">
            Our Church in Pictures
          </h2>

          <p className="body-copy">
            Explore moments from the life of Our Lady of Holy Rosary Church,
            from worship and celebrations to community life.
          </p>

          {/* Filters */}
          <div className="filter-row">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`filter ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery */}
          {loading ? (
            <div className="empty-state">
              <p>Loading gallery...</p>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="empty-state">
              <p>No gallery images available.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filteredPhotos.map((photo) => (
                <div className="gallery-item" key={photo.id}>
                  <img
                    src={photo.image_url}
                    alt={
                      photo.title ||
                      "Our Lady of Holy Rosary Church, Madurai"
                    }
                  />

                  {(photo.title || photo.description) && (
                    <div className="gallery-caption">
                      {photo.title && <h3>{photo.title}</h3>}

                      {photo.description && (
                        <p>{photo.description}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Virtual Tour */}
      <section className="section">
        <div className="container">
          <div className="two-col">
            <div>
              <div className="eyebrow">Explore the church</div>

              <h2 className="section-title">
                Take a 360° Virtual Tour
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

            <div
              className="map"
              style={{
                minHeight: 360,
                overflow: "hidden",
                borderRadius: "12px",
              }}
            >
              <iframe
                src="https://www.google.com/maps?q=Our%20Lady%20of%20Holy%20Rosary%20Church%2C%20Madurai&output=embed"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  minHeight: 360,
                }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Lady of Holy Rosary Church, Madurai"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
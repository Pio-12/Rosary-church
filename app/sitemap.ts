import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://rosarychurchmadurai.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/mass-timings`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/history`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/virtual-tour`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/donations`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/prayer-request`,
      lastModified: new Date(),
    },
  ];
}

import { useEffect } from "react";

export default function HelmetComponent({
  title = "Every Color Universe",
  description = "Every Color Universe",
  keywords = "",
  image = "",
  url = typeof window !== "undefined" ? window.location.href : "",
}) {
  useEffect(() => {
    // Update page title
    if (title) document.title = title;

    // Update description meta
    if (description) {
      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement("meta");
        descTag.setAttribute("name", "description");
        document.head.appendChild(descTag);
      }
      descTag.setAttribute("content", description);
    }

    // Update keywords meta
    if (keywords) {
      let keyTag = document.querySelector('meta[name="keywords"]');
      if (!keyTag) {
        keyTag = document.createElement("meta");
        keyTag.setAttribute("name", "keywords");
        document.head.appendChild(keyTag);
      }
      keyTag.setAttribute("content", keywords);
    }

    // Open Graph meta tags
    const setOGTag = (property, content) => {
      if (!content) return;
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setOGTag("og:title", title);
    setOGTag("og:description", description);
    setOGTag("og:image", image);
    setOGTag("og:url", url);
    setOGTag("og:type", "website");

    // Twitter meta tags
    const setTwitterTag = (name, content) => {
      if (!content) return;
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setTwitterTag("twitter:card", "summary_large_image");
    setTwitterTag("twitter:title", title);
    setTwitterTag("twitter:description", description);
    setTwitterTag("twitter:image", image);
  }, [title, description, keywords, image, url]);

  return null; 
}

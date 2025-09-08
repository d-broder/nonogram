import { useEffect, useState, useRef } from "react";
import styles from "./AdBanner.module.css";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className }: AdBannerProps) {
  const [showFallback, setShowFallback] = useState(true);
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Push the ad to Google AdSense
        (window.adsbygoogle = window.adsbygoogle || []).push({});

        // Check if ad loaded successfully after a delay
        setTimeout(() => {
          const adElement = adRef.current;
          if (adElement && adElement.innerHTML.trim() !== "") {
            setShowFallback(false);
          }
        }, 1000);
      } catch (error) {
        console.error("AdSense error:", error);
        setShowFallback(true);
      }
    }, 100);

    // Fallback timer - se o anúncio não carregar em 5 segundos, mantém fallback
    const fallbackTimer = setTimeout(() => {
      const adElement = adRef.current;
      if (!adElement || adElement.innerHTML.trim() === "") {
        setShowFallback(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <div className={`${styles.adBanner} ${className || ""}`}>
      {/* Bloco principal do AdSense */}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7085420530915023"
        data-ad-slot="8757079846"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>

      {/* Fallback quando anúncio não está disponível */}
      {showFallback && (
        <div className={styles.fallback}>Advertisement Banner</div>
      )}
    </div>
  );
}

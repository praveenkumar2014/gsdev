import { useEffect, useRef, useState } from "react"
import Hls from "hls.js"

interface VideoBackgroundProps {
  src: string
  poster?: string
  darkMode?: boolean
  overlayOpacity?: number
  className?: string
}

export function VideoBackground({
  src,
  poster,
  darkMode = true,
  overlayOpacity = 0.6,
  className = "",
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Check if HLS is supported
    if (Hls.isSupported() && src.endsWith(".m3u8")) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      })

      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(console.error)
        setIsLoaded(true)
      })

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError()
              break
            default:
              hls.destroy()
              break
          }
        }
      })

      hlsRef.current = hls

      return () => {
        hls.destroy()
      }
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = src
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(console.error)
        setIsLoaded(true)
      })

      return () => {
        video.pause()
        video.src = ""
      }
    } else {
      // Regular video file
      video.src = src
      video.addEventListener("loadeddata", () => {
        video.play().catch(console.error)
        setIsLoaded(true)
      })

      return () => {
        video.pause()
        video.src = ""
      }
    }
  }, [src])

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
      />

      {/* Gradient Overlay - Dark Mode */}
      {darkMode && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950/50 to-blue-950/50"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Gradient Overlay - Light Mode */}
      {!darkMode && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-white via-blue-100/50 to-purple-100/50"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Additional Gradient for depth */}
      <div
        className={`absolute inset-0 ${darkMode
            ? "bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"
            : "bg-gradient-to-t from-white/80 via-transparent to-transparent"
          }`}
      />

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Fallback Animated Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-xy" />

          {/* Additional gradient for depth */}
          <div
            className={`absolute inset-0 ${darkMode
                ? "bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"
                : "bg-gradient-to-t from-white/80 via-transparent to-transparent"
              }`}
          />

          {/* Loading dots */}
          <div className="relative flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full animate-pulse ${darkMode ? "bg-blue-500" : "bg-blue-600"
                  }`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

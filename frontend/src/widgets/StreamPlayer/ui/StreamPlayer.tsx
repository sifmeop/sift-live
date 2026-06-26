import HLS, { ErrorTypes, Events } from "hls.js";
import { TvIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { useClient } from "urql";

import { ChannelDocument } from "~/shared/api/graphql/__generated__/graphql";
import { useSocket } from "~/shared/api/socket";
import { Spinner } from "~/shared/ui/Spinner";

interface Quality {
  height: number;
  bitrate: number;
  name: string;
}

interface StreamPlayerProps {
  isLive: boolean;
  chanelId: string;
  username: string;
}

export const StreamPlayer = ({
  isLive,
  chanelId,
  username,
}: StreamPlayerProps) => {
  const t = useIntlayer("stream-player");

  const socket = useSocket();

  const client = useClient();

  const [isLoading, setIsLoading] = useState(isLive);
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1);
  const [error, setError] = useState<string | null>(null);

  const hlsRef = useRef<HLS>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!socket) return;

    const handleOnline = (payload: { channelId: string }) => {
      if (payload.channelId === chanelId) {
        client
          .query(
            ChannelDocument,
            { username },
            { requestPolicy: "network-only" },
          )
          .toPromise();
      }
    };

    const handleOffline = (payload: { channelId: string }) => {
      if (payload.channelId === chanelId) {
        client
          .query(
            ChannelDocument,
            { username },
            { requestPolicy: "network-only" },
          )
          .toPromise();
      }
    };

    socket.on("channel:online", handleOnline);
    socket.on("channel:offline", handleOffline);

    return () => {
      socket.off("channel:online", handleOnline);
      socket.off("channel:offline", handleOffline);
    };
  }, [chanelId, username, socket, client]);

  useEffect(() => {
    if (!isLive) return;

    const video = videoRef.current;

    if (!video) return;

    const src = `http://localhost:8888/${username}/index.m3u8`;

    if (HLS.isSupported()) {
      const hls = new HLS({ lowLatencyMode: true });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Events.MANIFEST_PARSED, () => {
        setIsLoading(false);

        const levelQualities = hls.levels.map((level, index) => ({
          height: level.height,
          bitrate: level.bitrate,
          name: level.height ? `${level.height}p` : `Level ${index}`,
          index,
        }));

        setQualities(levelQualities);

        console.debug("levelQualities", levelQualities);

        if (levelQualities.length > 0) {
          setSelectedQuality(hls.currentLevel);
        }

        video.play().catch(() => {});
      });

      hls.on(Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case ErrorTypes.NETWORK_ERROR:
              setError("Ошибка сети. Проверьте подключение.");
              break;
            case ErrorTypes.MEDIA_ERROR:
              setError("Ошибка воспроизведения медиа.");
              break;
            default:
              setError("Ошибка при загрузке видео.");
          }
        }
      });

      const onPlay = () => {
        const livePos = hls.liveSyncPosition;

        if (!video || !livePos) return;

        video.currentTime = livePos;
      };

      video.addEventListener("play", onPlay);

      return () => {
        hls.destroy();
        hlsRef.current = null;

        video.removeEventListener("play", onPlay);
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
  }, [username, isLive]);

  return (
    <div className="group/player bg-muted relative aspect-video w-full overflow-hidden">
      {isLoading && <Spinner variant="full-absolute" />}

      {isLive ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full"
          aria-label="asda"
        >
          <track kind="captions" />
        </video>
      ) : (
        <div className="from-muted via-muted/80 to-accent/10 absolute inset-0 grid place-items-center bg-linear-to-br">
          <div className="text-muted-foreground flex flex-col items-center gap-3">
            <TvIcon className="size-16 opacity-60" />
            <p className="text-sm font-medium">{t.placeholder}</p>
          </div>
        </div>
      )}
    </div>
  );
};

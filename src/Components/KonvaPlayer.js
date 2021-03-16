import { useCallback, useEffect, useRef } from "react";
import { Image } from "react-konva";
import Konva from "konva";

const KonvaPlayer = ({ video, width, height, loopTill }) => {
  const anim = useRef(null);
  const imageRef = useRef(null);
  const videoInit = useRef(true);

  const startVideo = useCallback(() => {
    video.play();
    anim.current.start();
  }, [video]);

  const stopVideo = useCallback(() => {
    video.pause();
    anim.current.stop();
  }, [video]);

  // convert video frame to konva canvas
  useEffect(() => {
    anim.current = new Konva.Animation(() => {}, imageRef.current.getLayer());
  }, [video]);

  // Auto play canvas once the video loaded. This will happen only once
  useEffect(() => {
    if (videoInit.current) {
      startVideo();
      videoInit.current = false;
    }
  }, [video, startVideo]);

  // Video looper
  useEffect(() => {
    console.log("Video duration=", video.duration, "sec");
    console.log("Video cutTime=", loopTill, "sec");
    let loopCount = 0;

    let totalTimeSpent = 0;
    const loopVideo = () => {
      // check time reached the stop point. If so stop the video.
      if (totalTimeSpent >= loopTill) {
        clearInterval(runCount);
        stopVideo();
        return;
      }

      // Restart the video again once video end and haven't reached the stop point
      if (video.currentTime === video.duration) {
        video.currentTime = 0;
        startVideo();

        /** Ignore this part this is only for log */
        loopCount = loopCount + 1;
        console.log("Video loop count=", loopCount, "times");
      }
      totalTimeSpent = totalTimeSpent + 1;
    };

    // Start counter with interval of 1sec and determine when to stop the video.
    const runCount = setInterval(loopVideo, 1000);
  }, [video, startVideo, stopVideo, loopTill]);

  return (
    <>
      <Image
        ref={imageRef}
        image={video}
        x={20}
        y={20}
        stroke="red"
        width={width}
        height={height}
      />
    </>
  );
};

export default KonvaPlayer;

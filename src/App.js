import { Stage, Layer, Image } from "react-konva";
import Konva from "konva";

import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";

// const videos = [
//   {
//     src: "https://www.w3schools.com/html/mov_bbb.mp4", // laggy one
//   },
//   {
//     src:
//       "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//   },
//   {
//     //  small video
//     src:
//       "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
//   },
//   {
//     src:
//       "https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/Physicsworks.ogv/Physicsworks.ogv.240p.vp9.webm",
//   },
// ];
// const videoSrc = videos[2].src;

// Change value here
// const loopTill = 35; // in seconds

const Video = ({ video, width, height, loopTill }) => {
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

  useEffect(() => {
    anim.current = new Konva.Animation(() => {
      imageRef.current.image(video);
    }, imageRef.current.getLayer());
  }, [video]);

  useEffect(() => {
    if (videoInit.current) {
      startVideo();
      videoInit.current = false;
    }
  }, [video, startVideo]);

  useEffect(() => {
    console.log("Video duration=", video.duration, "sec");
    console.log("Video cutTime=", loopTill, "sec");
    let loopCount = 0;

    let totalTimeSpent = 0;
    const loopVideo = () => {
      if (totalTimeSpent >= loopTill) {
        clearInterval(runCount);
        stopVideo();
        return;
      }

      if (video.currentTime === video.duration) {
        video.currentTime = 0;
        loopCount = loopCount + 1;
        console.log("Video loop count=", loopCount, "times");
        startVideo();
      }
      totalTimeSpent = totalTimeSpent + 1;
    };

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
        // draggable
      />
    </>
  );
};
export default function App() {
  const [formValues, setFormValues] = useState({
    videoSrc: "",
    time: 0,
  });
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [videoSize, setVideoSize] = useState({
    width: 0,
    height: 0,
  });
  const tt = () => {
    if (formValues.videoSrc !== "" && parseInt(formValues.time) > 0) {
      setDataSubmitted(true);
    }
  };
  return (
    <div className="App">
      http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4
      <br />
      <input
        type="text"
        placeholder="video url"
        onChange={(e) => {
          setFormValues((formValues) => ({
            ...formValues,
            videoSrc: e.target.value,
          }));
        }}
      />
      <input
        type="text"
        placeholder="time is sec"
        onChange={(e) =>
          setFormValues((formValues) => ({
            ...formValues,
            time: parseInt(e.target.value),
          }))
        }
      />
      <button type="button" onClick={tt}>
        start
      </button>
      {dataSubmitted && (
        <video
          style={{ display: "none" }}
          ref={videoRef}
          onLoadedData={(el) => {
            setVideoSize({
              width: el.target.videoWidth,
              height: el.target.videoHeight,
            });
            setLoading(false);
          }}
          src={formValues.videoSrc}
          muted
        />
      )}
      {!loading ? (
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <Video
              width={videoSize.width}
              height={videoSize.height}
              video={videoRef.current}
              loopTill={formValues.time}
            />
          </Layer>
        </Stage>
      ) : (
        dataSubmitted && <p>Video loading...</p>
      )}
    </div>
  );
}

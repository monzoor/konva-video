import { Stage, Layer, Image } from "react-konva";
import Konva from "konva";

import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";

const videos = [
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: 10.026667, // laggy one
  },
  {
    src:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: 653.804263,
  },
  {
    //  small video
    src:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: 15.023311,
  },
  {
    src:
      "https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/Physicsworks.ogv/Physicsworks.ogv.240p.vp9.webm",
    duration: 203.341,
  },
];

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
    anim.current = new Konva.Animation(() => {}, imageRef.current.getLayer());
  }, [video]);

  useEffect(() => {
    if (videoInit.current) {
      startVideo();
      videoInit.current = false;
    }
  }, [video, startVideo]);

  useEffect(() => {
    if (video && loopTill) {
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
    }
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

  const startVideo = () => {
    if (formValues.videoSrc !== "" && formValues.time > 0) {
      setDataSubmitted(true);
    }
  };
  const resetVideo = () => {
    setFormValues({
      videoSrc: "",
      time: 0,
    });
    setDataSubmitted(false);
    setLoading(true);
    setVideoSize({
      width: 0,
      height: 0,
    });
  };

  return (
    <div className="App">
      <ul>
        {videos.map((item, index) => (
          <li key={index}>
            <p>
              {item.src} <b> {item.duration} sec</b>
            </p>
          </li>
        ))}
      </ul>
      <br />
      <input
        type="text"
        placeholder="video url"
        value={formValues.videoSrc}
        onChange={(e) => {
          setDataSubmitted(false);
          setFormValues((formValues) => ({
            ...formValues,
            videoSrc: e.target.value,
          }));
        }}
      />
      <input
        type="number"
        placeholder="time is sec"
        value={formValues.time}
        onChange={(e) => {
          setDataSubmitted(false);
          setFormValues((formValues) => ({
            ...formValues,
            time: isNaN(parseInt(e.target.value))
              ? ""
              : parseInt(e.target.value),
          }));
        }}
      />
      <button type="button" onClick={startVideo}>
        start
      </button>
      <button type="button" onClick={resetVideo}>
        Reset
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
      {!loading && dataSubmitted ? (
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

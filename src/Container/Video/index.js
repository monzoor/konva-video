import { useRef, useState } from "react";
import { Stage, Layer } from "react-konva";

import KonvaPlayer from "../../Components/KonvaPlayer";
import VideoUrls from "../../Components/VideoUrlsView";
import Controllers from "../../Components/Controllers";

const KonvaVideoPlayer = () => {
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

  /**
   *
   * @param {string} value
   * @param {string} key
   * Set and get values form input fields
   */
  const onChangeValues = (value, key) => {
    setDataSubmitted(false);
    setFormValues((formValues) => ({
      ...formValues,
      [key]: value,
    }));
  };

  return (
    <div className="App">
      <VideoUrls />
      <br />
      <Controllers
        dataSubmitted={dataSubmitted}
        resetVideo={resetVideo}
        startVideo={startVideo}
        formValues={formValues}
        onChangeValues={onChangeValues}
      />

      {/* Create HTML5 video element. */}
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
        />
      )}

      {!loading && dataSubmitted ? (
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <KonvaPlayer
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
};

export default KonvaVideoPlayer;

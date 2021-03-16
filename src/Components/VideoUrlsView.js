import videos from "../constants/videoUrls";

const VideoUrls = () => {
  return (
    <ul>
      {videos.map((item, index) => (
        <li key={index}>
          <p>
            {item.src} <b> {item.duration} sec</b>
          </p>
        </li>
      ))}
    </ul>
  );
};

export default VideoUrls;

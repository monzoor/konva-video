const Controllers = ({
  dataSubmitted,
  formValues,
  startVideo,
  resetVideo,
  onChangeValues,
}) => {
  return (
    <>
      <input
        disabled={dataSubmitted}
        type="text"
        placeholder="video url"
        value={formValues.videoSrc}
        onChange={(e) => {
          onChangeValues(e.target.value, "videoSrc");
        }}
      />
      <input
        type="number"
        disabled={dataSubmitted}
        placeholder="time is sec"
        value={formValues.time}
        onChange={(e) => {
          const timeValue = isNaN(parseInt(e.target.value))
            ? ""
            : parseInt(e.target.value);
          onChangeValues(timeValue, "time");
        }}
      />
      <button type="button" disabled={dataSubmitted} onClick={startVideo}>
        start
      </button>
      <button type="button" onClick={resetVideo}>
        Reset
      </button>
    </>
  );
};

export default Controllers;

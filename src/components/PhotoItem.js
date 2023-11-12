import PropTypes from "prop-types";

const PhotoItem = ({ photo }) => {
  PhotoItem.propTypes = {
    photo: PropTypes.object,
  }
    
  return (
    <div className="relative flex justify-center items-center my-4"
      data-tooltip-id={photo.id} data-tooltip-content={photo.title}>
      <img className="rounded-lg drop-shadow-lg border border-black w-32 h-32"
        src={photo.thumbnailUrl} alt={photo.title} />
      <p className="absolute text-black font-bold text-sm text-center break-words line-clamp-4 -rotate-45 max-w-[80%]">
        {photo.title}
      </p>
    </div>
  );
};


export default PhotoItem;

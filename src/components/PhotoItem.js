import PropTypes from "prop-types";

const PhotoItem = ({ photo, isLoading }) => {
  PhotoItem.propTypes = {
    photo: PropTypes.object,
    isLoading: PropTypes.bool
  }

  return (
    <div className="relative flex justify-center items-center my-4"
      data-tooltip-id={photo.id} data-tooltip-content={photo.title}>
      {isLoading? 
        <div className="flex items-center justify-center w-32 h-32 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">loading...</div>
        </div>
        :
        <>
          <img className="rounded-lg drop-shadow-lg border border-black w-32 h-32"
            src={photo.thumbnailUrl} alt={photo.title} />
          <p className="absolute text-black font-bold text-sm text-center break-words line-clamp-4 -rotate-45 max-w-[75%]">
            {photo.title}
          </p>
        </>
      }
    </div>
  );
};


export default PhotoItem;

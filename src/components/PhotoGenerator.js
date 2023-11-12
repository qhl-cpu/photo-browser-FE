import { useState, useEffect } from 'react';
import PhotoItem from './PhotoItem';
import { Tooltip } from 'react-tooltip';

const PHOTO_URL = 'http://jsonplaceholder.typicode.com/photos';

const fetchPhotos = async () => {
  const response = await fetch(`${PHOTO_URL}?_limit=50`);
  const data = await response.json();
  return data;
};
  
const PhotoGenerator = () => {

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchPhotos().then((data) => {
      setPhotos(data);
    });
  }, []);


  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='flex overflow-x-auto p-4 space-x-4 bg-gray-300 max-w-[80%]'>
        {photos.map((photo, index) => {
          if (index % 2 === 0) { // Only render for even indices (0, 2, 4, ...)
            return (
              <div className='flex-shrink-0'
                key={"photoMap" + photo.id} >
                <Tooltip id={photo.id} place='top'/>
                <PhotoItem photo={ photo }/>

                <Tooltip id={photo.id + 1} place='bottom'/>
                {index + 1 < photos.length && (
                  <PhotoItem photo={ photos[index + 1] } />
                )}
              </div>
            )
          }
          return null;
        })}
      </div>
      <button className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Shuffle Photos
      </button>
      <button className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Generate New Photos
      </button>
    </div>
  );
}

export default PhotoGenerator;
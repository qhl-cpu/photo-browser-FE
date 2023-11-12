import { useState, useEffect } from 'react';
import PhotoItem from './PhotoItem';
import { Tooltip } from 'react-tooltip';

const PHOTO_URL = 'http://jsonplaceholder.typicode.com/photos';

// A recursive function to randomize the photo list
const randomizeArray = (array) => {
  const randomize = (arr, index) => {
    if (index === 0) return arr;
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]];
    return randomize(arr, index - 1);
  };
  return randomize([...array], array.length - 1);
};

// generate 50 unique number from 1-5000
const generateUniqueIds = () => {
  const initialSet = new Set();
  while (initialSet.size < 50) {
    const randomNumber = Math.floor(Math.random() * 5000) + 1;
    initialSet.add(randomNumber);
  } 
  const initialArray = Array.from(initialSet);
  return initialArray;
}
  
const PhotoGenerator = () => {
  const [photos, setPhotos] = useState([]);
  const [photoIds, setPhotoIds] = useState(generateUniqueIds());

  const fetchPhotos = async () => {
    try{
      const photoPromises = photoIds.map(id => fetch(`${PHOTO_URL}/${id}`).then(res => res.json()));
      const data = await Promise.all(photoPromises);
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [photoIds]);

  const handleShuffle = () => {
    const newArray = randomizeArray(photos);
    setPhotos(newArray);
  };

  const regeneratePhotos = () => {
    setPhotoIds(generateUniqueIds());
  }

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

                {index + 1 < photos.length && (
                  <>
                    <Tooltip id={photos[index + 1].id} place='bottom'/>
                    <PhotoItem photo={ photos[index + 1] } />
                  </>
                )}
              </div>
            )
          }
          return null;
        })}
      </div>
      <button className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={handleShuffle}>
          Shuffle Photos
      </button>
      <button className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={regeneratePhotos}>
          Regenerate Photos
      </button>
    </div>
  );
}

export default PhotoGenerator;
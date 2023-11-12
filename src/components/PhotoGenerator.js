import { useState, useEffect } from 'react';
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
        {photos.map((photo) => (
          <div key={photo.id} className="flex-shrink-0 relative flex justify-center items-center">
            <img  className="rounded-lg drop-shadow-lg border border-black w-32 h-32"
              src={photo.thumbnailUrl} alt={photo.title} />
            <p className="absolute text-black font-bold text-sm text-center break-words line-clamp-4 -rotate-45 max-w-[80%]">{photo.title}</p>
          </div>
        ))}
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
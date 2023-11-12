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
    <div>
      <div className="photo-container">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <img src={photo.thumbnailUrl} alt={photo.title} />
            <p className="photo-title">{photo.title}</p>
          </div>
        ))}
      </div>
      <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Shuffle Photos
      </button>
      <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Generate New Photos
      </button>
    </div>
  );
}

export default PhotoGenerator;
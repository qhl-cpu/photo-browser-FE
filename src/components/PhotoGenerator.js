import { useState, useEffect, useRef } from 'react';
import PhotoItem from './PhotoItem';
import { Tooltip } from 'react-tooltip';
import confetti from "canvas-confetti";

const PHOTO_URL = 'http://jsonplaceholder.typicode.com/photos';

// Cache photos in local storage
const cachePhotos = (photos) => {
  localStorage.setItem('photos', JSON.stringify(photos));
};

/**
 * Retrieve cached photos from local storage
 * @return {Array} an array contains the cachedPhotos.
 * @return {null} if no photos were found.
 */
const getCachedPhotos = () => {
  const cachedPhotos = JSON.parse(localStorage.getItem('photos'));
  return cachedPhotos && cachedPhotos.length>0 ? cachedPhotos : null;
};

/**
 * Randomly shuffle an array using the Fisher-Yates (Knuth) Shuffle algorithm.
 * 
 * @param {Array} array - The array to shuffle.
 * @return {Array} The shuffled array.
 */
const randomizeArray = (array) => {
  const randomize = (arr, index) => {
    if (index === 0) return arr;
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]];
    return randomize(arr, index - 1);
  };
  return randomize([...array], array.length - 1);
};

/**
 * generate an array of 50 unique random numbers between 1 and 5000
 * 
 * @return {Array} An array contains the generated results.
 */
const generateUniqueIds = () => {
  const initialSet = new Set();
  while (initialSet.size < 50) {
    const randomNumber = Math.floor(Math.random() * 5000) + 1;
    initialSet.add(randomNumber);
  } 
  const initialArray = Array.from(initialSet);
  return initialArray;
}

/**
 * generate an array of 50 unique random numbers between 1 and 5000
 * @param {Array} url - The url for http request
 * @param {number} retries - number of request
 * @param {number} delay - amount of time for delay
 * @return {Promise<Object>} A promise that resolves to the JSON response from the fetch request if successful.
 *                           If all retries fail, the function will throw an error.
 */
const fetchWithRetry = async (url, retries, delay) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * add confetti to the button's location
 * @param {Ref} buttonRef - The ref of a button
 */
const triggerConfetti = (buttonRef) => {
  if (buttonRef.current) {
    const rect = buttonRef.current.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    
    confetti({
      origin: {
        x: originX / window.innerWidth,
        y: originY / window.innerHeight
      },
      particleCount: 150
    });
  }
};

const PhotoGenerator = () => {
  const [photos, setPhotos] = useState([]);
  const [photoIds, setPhotoIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const shuffleRef = useRef(null);
  const regenerateRef = useRef(null);

  const fetchPhotos = async () => {
    try{
      // can also use PHOTO_URL/albums/albumId/photos for fetching all 50 photos in a album
      const photoPromises = photoIds.map(id => fetchWithRetry(`${PHOTO_URL}/${id}`, 3, 1000));
      const data = await Promise.all(photoPromises);
      setPhotos(data);
      cachePhotos(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  useEffect(() => {
    const cachedPhotos = getCachedPhotos();
    if (cachedPhotos) {
      setPhotos(cachedPhotos);
    } else {
      setPhotoIds(generateUniqueIds());
    }
  }, []);

  // Run fetchPhotos whenever photoIds changes
  useEffect(() => {
    setIsLoading(true);
    if (photoIds.length > 0) {
      fetchPhotos();
    }
  }, [photoIds]);

  // Event handler for shuffling photos
  const handleShuffle = () => {
    const newArray = randomizeArray(photos);
    setPhotos(newArray);
    cachePhotos(newArray);
    triggerConfetti(shuffleRef);
  };

  // Event handler for regenerating photo IDs and fetching new photos
  const regeneratePhotos = () => {
    setPhotoIds(generateUniqueIds());
    triggerConfetti(regenerateRef);
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-gradient-to-br from-teal-500 via-blue-500 to-green-300'>
      <div className='grid grid-flow-col grid-rows-2 grid-cols-none overflow-x-scroll overflow-y-hidden rounded-xl bg-white bg-opacity-30 border-[15px] border-transparent p-4 max-w-[80%]'>
        {photos.map((photo, index) => {
          return (
            <div className='w-32 y-32 mx-2' key={"photoMap" + photo.id} >
              <Tooltip id={ photo.id } place={ index % 2 == 0 ? 'top' : 'bottom' }/>
              <PhotoItem photo={ photo } isLoading= { isLoading }/>
            </div>
          )
        })}
      </div>
      <div className='flex flex-col sm:flex-row items-center mt-4'>
        <button ref={shuffleRef}
          className='mt-4 mx-5 w-48 h-16 bg-gradient-to-r from-teal-200 to-lime-200 rounded-lg cursor-pointer select-none
            active:translate-y-2 active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 [box-shadow:0_10px_0_0_#ffffff,5px_10px_0_0_#ffffff]
            border-b-[1px] border-blue-400'
          onClick={handleShuffle}>
          Shuffle Photos
        </button>
        <button ref={regenerateRef}
          className='mt-4 mx-5 w-48 h-16 bg-gradient-to-r from-teal-200 to-lime-200 rounded-lg cursor-pointer select-none
            active:translate-y-2 active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 [box-shadow:0_10px_0_0_#ffffff,5px_10px_0_0_#ffffff]
            border-b-[1px] border-blue-400'
          onClick={regeneratePhotos}>
          Regenerate Photos
        </button>
      </div>
    </div>
  );
}

export default PhotoGenerator;
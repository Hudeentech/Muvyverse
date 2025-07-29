import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonSolid, ButtonRegular } from './Button.jsx';
import images from '../../assets/img.js';

function MovieCardComponent({ title, rating, year, image, id }) {
  const navigate = useNavigate();
  const imgSrc = images[image] || image || 'https://via.placeholder.com/';
  const handleClick = () => {
    if (id) navigate(`/movie/${id}`);
  };
  return (
    <div
      className='w-[200px] md:w-auto px-2 pt-2 relative pb-4 space-y-2 my-4 bg-gradient-to-b from-[#2d2d2d] to-transparent border-gray-700 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-150'
      onClick={handleClick}
      title={title}
    >
      <img
        src={imgSrc}
        alt="No Thumbnail"
        className="min-w-[100%] h-[100%]  rounded-lg lg:h-[380px] object-fit bg-gray-500 "
      />
      <div className='absolute flex flex-row justify-center items-center top-4 right-4 rounded-lg bg-[#2e2e2e5f] backdrop-blur-md shadow space-x-2 px-4 py-2'>
        <i className='fas fa-star text-yellow-500 text-sm'></i>
        <p className='text-sm font-normal'>({rating})</p>
      </div>
      <p className="text-sm md:text-base  font-medium">{title}. ({year})</p>
    </div>
  );
}

export default MovieCardComponent;
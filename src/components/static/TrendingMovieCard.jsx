import React, { useEffect, useState } from 'react';


const API_BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
};


export default function TrendingCardComponent({title, rating, year, image}) {

        const [data, setData] = useState([])
        const [loading, setLoading] = useState(null)
        const [error, setError] = useState(null)

    return (
           <div className='px-2 pt-2 relative pb-4 space-y-4 my-4 bg-[#3b3b3b38] border border-gray-700 rounded-lg'>

           <img 
           src={image} 
           alt="placeholder" 
           className="min-w-68 h-[420px] lg:min-w-[380px]  rounded-lg lg:h-[460px] object-fit inset-0 -z-10 bg-amber-300 " />

           <div className='absolute flex flex-row justify-center items-center top-4 right-4 rounded-lg bg-[#2e2e2e5f] backdrop-blur-md shadow space-x-2 px-4 py-2'>
                <i className='fas fa-star text-yellow-500 text-sm'></i>
                <p className='text-sm font-normal'>({rating})</p>
           </div>

           <h1 className="text-md font-bold lg:text-lg">{title}. ({year})</h1>

           </div>

    );
    
}

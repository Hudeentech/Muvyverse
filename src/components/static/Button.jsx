export function ButtonSolid({ text }) {

    return (
        <button className="text-gray-800 duration-75  hover:outline hover:outline-yellow-500
        hover:text-yellow-500 bg-yellow-500 hover:bg-transparent font-medium py-2 px-6 rounded-md">
            {text}

        </button>
    );
    
}

export function ButtonRegular({ text}) {

    return (
        <button className="text-yellow-500  duration-75 outline outline-yellow-500 hover:bg-yellow-500
         hover:text-gray-800 font-medium py-2 px-6 rounded-md">
            {text}

        </button>
    );
    
}

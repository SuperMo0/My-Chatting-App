import React from 'react'

export default function SearchInput() {
    return (
        <div className='w-full rounded-4xl h-18 overflow-hidden '>
            <label className="input border-0 outline-0 w-full h-full ml-1 rounded-4xl  bg-slate-300 glass dark:bg-base-300">
                <svg className="h-[2em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input id='search' className='focus:outline-0 focus:border-0 text-[1.6em] bg-slate-300 glass dark:bg-base-300' type="search" required placeholder="Search" />
            </label>
        </div>
    )
}

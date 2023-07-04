// import React from 'react'
import { Link } from 'react-router-dom'

function Admintest() {
  return (
    <div className='bg-white h-screen'>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-white dark:text-white">
       
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link to="/">Dashboard /</Link>
          </li>
          <li className="text-primary">{}</li>
        </ol>
      </nav>
    </div>
    </div>
  )
}

export default Admintest

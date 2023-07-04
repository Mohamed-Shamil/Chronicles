/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      [{ code: "code-block" }], 
    ],
  };


function EditPost(props) {
    const {posts} = props
    
  return (
    <div className='bg-blue-400'>
        (
  <div className="fixed inset-0 z-10 ">
    <div className="fixed inset-0 w-full h-full bg-black opacity-90 transition-opacity" onClick={() => setShowEditModal(false)}></div>
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-md shadow-lg">
        <div className="mt-3 sm:flex justify-center">
          <div className="text-center sm:text-left">
            <h4 className="text-2xl font-bold text-gray-800">Edit Blog</h4>
            <form action="">
              <div className="md:flex p-1 flex flex-col rounded-lg bg-gray-200 md:items-center mb-6">
                
                  <img className="p-1 rounded-xl h-40 w-[60%] flex" src={posts?.imageUrl} />
                  <input type="file" name="file" id="file" className="hidden" />
                  <label htmlFor="file" className="text-md font-medium text-white bg-gray-700 hover:bg-gray-950 inline-block cursor-pointer p-2.5 rounded-md">
                    Change Cover Image
                  </label>
                </div>
            

              <div className="md:flex md:items-center mb-6">
               
               
                  <input
                    className="bg-gray-200 p-2 h-16 font-bold appearance-none text-3xl border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-gray-400 focus:border-purple-500"
                    id="inline-full-name"
                    type="text"
                    value={posts?.title}
                  />
              
              </div>

              <div className="md:flex md:items-center mb-6">
               
                  <input
                     className="bg-gray-200 font-semibold appearance-none text-2xl border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-gray-400 focus:border-purple-500"
                     id="inline-full-name"
                    type="text"
                    value={posts?.subTitle}
                  />
                </div>
           

              <div className="md:flex md:items-center mb-6">
               
             

             
                <ReactQuill
  theme="snow"
  name="content"
  className="bg-gray-200 overflow-y-scroll max-h-44 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-gray-600"
  id="inline-password"
  type="text"
  value={posts?.content}
  readOnly={false}
  modules={modules}
/>




              </div>

              <div className="items-center gap-2 mt-3 sm:flex justify-center">
                <button className="w-44 mt-2 p-2.5 flex-1 text-white bg-violet-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2" onClick={() => editHandler(posts._id)}>
                  Save Changes
                </button>
                <button onClick={() => setShowEditModal(false)} className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
) 
    </div>
  )
}

export default EditPost

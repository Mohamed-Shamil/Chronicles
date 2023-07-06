// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import authAPI from "../../Api/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userReducer } from "../../redux/Slices/userSlice";
import { ToastContainer } from "react-toastify";
import toastifyNotifications from "../../Config/toastifyConfig";
import ReactQuill from "react-quill";

const { followSuccessToast, followErrorToast, updatePostToast } =
  toastifyNotifications();
import "react-quill/dist/quill.snow.css";

const {
  getBlog,
  likeBlog,
  followUser,
  unfollowUser,
  userProfile,
  deletePost,
  getComments,
  postComments,
  reportBlog
} = authAPI();

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

const FullContent = () => {
  // eslint-disable-next-line no-unused-vars
  const [unfollowResponse, setUnfollowResponse] = useState("");
  const [posts, setPosts] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [followResponse, setFollowResponse] = useState("");
  const [deletedPost, setDeletedPost] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [content, setContent] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = useSelector(userReducer);
  const userId = userDetails.id;
  const { postId } = location.state;
  const { editPost } = authAPI();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(postId);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [updateTrigger]);

  const submitComment = async (event) => {
    event.preventDefault();

    try {
      const response = await postComments(postId, {
        content: newComment,
        author: userId,
      });

      setComments((prevComments) => [response.data, ...prevComments]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      const { postId } = location.state;
      const response = await getBlog(postId);
      const userData = await userProfile(response[0].authorId);
      const post = response[0];
      setUser(userData);

      setPosts(post);
      setLikeCount(post?.likes?.length || 0);
      setIsLiked(post.likes?.includes(userId));
    };
    fetchPost();
  }, [location.state, userId]);
  useEffect(() => {
    if (deletedPost) {
      navigate("/home");
    }
  }, [deletedPost, navigate]);

  const followHandler = async (authorId, userId) => {
    try {
      const response = await followUser(authorId, userId);
      setFollowResponse(response);
      followSuccessToast();
    } catch (error) {
      if (error.response) {
        console.log(error.response.data, "data");
        console.log(error.response.status, "status");
        console.log(error.response.headers, "header");
      } else if (error.request) {
        console.log(error.request, "requestError");
      } else {
        console.log("Error", error.message, "message");
      }
      console.log(error.config, "config");
    }
  };

  const unfollowHandler = async (authorId, userId) => {
    try {
      const response = await unfollowUser(authorId, userId);
      console.log(response);
      followErrorToast(response);
      setUnfollowResponse(response);
    } catch (err) {
      throw { err };
    }
  };
  const likeHandler = async (postId) => {
    const response = await likeBlog(postId, userId);
    const updatedPost = {
      ...posts,
      likes: response.data.likes,
    };
    setPosts(updatedPost);
    setLikeCount(updatedPost.likes?.length || 0);
    setIsLiked(updatedPost.likes?.includes(userId));
  };

  const showButton = posts && posts.authorId === userId;
  const deleteHandler = async (postId) => {
    if (postId) {
      const deleteResponse = await deletePost(postId);
      if (deleteResponse) {
        setShowModal(false);
        setDeletedPost(true);
      }
    }
  };

  const handleTitle = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setTitle(e.target.value);
  };

  const handleSubtitle = (e) => {
    if (e.target.value === "") {
      console.log(e.target.value);

      setSubtitle(""); // Clear the subtitle value
    } else {
      console.log(e.target.value);

      setSubtitle(e.target.value); // Update the subtitle value
    }
  };

  const handleContent = (value) => {
    setContent(value);
  };

  const handleImageChange = (file) => {
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const editHandler = async (e) => {
    try {
      e.preventDefault();
      let formData = new FormData();

      if (title) {
        
        formData.append("title", title);
      } else {
        formData.append("title", posts?.title);
      }

      if (subtitle) {
        
        formData.append("subTitle", subtitle);
      } else {
        formData.append("subTitle", posts?.subTitle);
      }

      if (image) {
        formData.append("image", image);
      } else {
        formData.append("image", posts?.image);
      }

      if (content) {
        formData.append("content", content);
      } else {
        formData.append("content", posts?.content);
      }

      formData.append("autherId", userDetails.id);
      formData.append("postId", postId);

      const editedPost = await editPost(formData);
      if (editedPost) {
        setShowEditModal(false);
        setUpdateTrigger((prev) => !prev);
        updatePostToast();
      }
    } catch (err) {
      throw { err };
    }
  };

  const handleReport =async (e) => {
    e.preventDefault()
    setShowReportModal(false)
    const reason = await e.target.elements.reason.value

    let reportData = {"postId":postId,
                      "userId":userDetails.id,
                      "reason":reason}
  
  
      const response = await reportBlog(reportData)
      if(response){
        console.log(response);
      }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row h-full p-4 sm:ml-36">
        <ToastContainer />
        <div className="w-full sm:w-3/4 flex-col pt-14  overflow-y-scroll justify-center">
          <h1 className="font-semibold font-serif w-full xl:w-[90%] sm:w-[80%] text-4xl">
            {posts?.title}
          </h1>
          <p className=" text-gray-500 ml-2 mt-2">
            Created at: {new Date(posts?.createdAt).toDateString()}
          </p>
          <div className="flex mt-4 p-2">
            <img
              src={user?.image ? user.image : "Images/user.png"}
              className="w-14 mt-2 rounded-full h-14"
              alt="Profile"
            />
            <div className="flex-col  text-blackyteal ml-4">
              <p className="font-semibold text-lg">{posts?.author}</p>

              <h6 className="text-green-700 font-medium">Follow +</h6>
            </div>
          </div>

          <img
            className="p-3 h-3/4 w-[80%] rounded-lg flex"
            src={posts?.imageUrl}
          />
          <p className="text-lg mr-[25%] font-semibold ">{posts?.subTitle}</p>
          <hr className="bg-black my-5 border-1" />
          <div className="flex justify-between">
            <div className="flex">
              <button onClick={() => likeHandler(posts._id)}>
                <img
                  src={isLiked ? "Images/like (1).png" : "Images/like (2).png"}
                  className="w-8 h-8 mr-5"
                  alt=""
                />
                <span>{likeCount} Likes</span>
              </button>
              <img src="Images/comment.png" className="w-8 h-8" alt="" />
            </div>

            {showButton && (
              <div
                className="inline-flex rounded-md mr-36 shadow-sm"
                role="group"
              >
                <button
                  onClick={() => setShowEditModal(true)}
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-l-lg hover:bg-exteal hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                >
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 mr-2 fill-current"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-r-md hover:bg-exteal hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                >
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 12V17"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 12V17"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 7H20"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
          <hr className="bg-black my-3 border-1" />
          <div
            className="text-gray-700 p-5 w-full font-serif text-lg sm:w-[70%] break-normal mb-4"
            dangerouslySetInnerHTML={{ __html: posts?.content }}
          ></div>
          <div className="border p-1 hover:bg-opacity-75 bg-sideclr Class bg-opacity-50 h-25">
            <div className="flex">
              <svg
                fill="#000000"
                className="mt-2 ml-5"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="15px"
                height="15px"
                viewBox="0 0 512 512"
                enableBackground="new 0 0 512 512"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M256,0C114.609,0,0,114.609,0,256s114.609,256,256,256s256-114.609,256-256S397.391,0,256,0z M256,472
	                    	c-119.297,0-216-96.703-216-216S136.703,40,256,40s216,96.703,216,216S375.297,472,256,472z"
                  />
                  <polygon points="240,234.656 246.234,320 265.781,320 272,233.875 272,128 240,128 	" />
                  <rect x="240" y="352" width="32" height="32" />
                </g>
              </svg>
              <h3 className="mt-[.2%] font-bold ml-5">Report Blog</h3>
            </div>
            <p className="ml-14 text-green-950 font-medium">
              Find anything inappropriate. You can report blog by adding your
              reason
            </p>
            <div onClick={() => setShowReportModal(true)} className="border ml-14 w-36 rounded-sm focus:bg-blackyteal hover:bg-exteal hover:text-white cursor-pointer items-center justify-center mt-2 flex mb-2 h-10 border-exteal ">
              <a
                
                className="text-center font-semibold hover:text-white hover:shadow-xl hover:font-bold"
              >
                Report Blog !
              </a>
            </div>
          </div>
          <div className="mt-2 h-40">
            <section className="bg-sideclr dark:bg-gray-900  lg:py-8">
              <div className="max-w-2xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                    Add Your thoughts
                  </h2>
                </div>
                <form className="mb-1" onSubmit={submitComment}>
                  <div className="py-2 px-4 mb-2 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label htmlFor="comment" className="sr-only">
                      Your comment
                    </label>
                    <textarea
                      id="comment"
                      rows="2"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                      placeholder="Write a comment..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center py-2 px-4 text-xs font-medium text-center text-white bg-exteal rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                  >
                    Post comment
                  </button>
                </form>
              </div>
              <div className="mt-3 ">
                {comments.map((comment) => (
                  <div className="" key={comment.id}>
                    <div className=" ml-5 h-max rounded-md   w-[50%] bg-gray-10 p-2 mb-2">
                      <div className="flex p-3 gap-2">
                        <img
                          src="Images/user.png"
                          className="w-10 mt-2 h-10"
                          alt=""
                        />
                        <div>
                          <p className="text-lg font-semibold">
                            {comment.commenter}
                          </p>
                          <p className="text-gray-500">
                            {new Date(comment.createdAt).toDateString()}
                          </p>
                        </div>
                      </div>

                      <p className="ml-10 border border-gray-200 p-2 rounded-sm font-medium text-gray-700">
                        {comment.content}
                      </p>
                    </div>
                    {/* Display other comment details as needed */}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div
          className="border-l-2  border-gray-200 w-full sm:w-1/4 items-center flex flex-col"
        >
          <img
          onClick={() => navigate("/profile")}
            src={user?.image ? user.image : "Images/user.png"}
            className="w-14 mt-3 rounded-full hover:cursor-pointer h-14"
            alt="Profile"
          />

          <h1 onClick={() => navigate("/profile")} className="font-semibold  hover:cursor-pointer text-center text-xl">{posts?.author}</h1>
          <p>{user?.followers.length} followers</p>

          <p className="text-center font-medium p-2">{user?.bio}</p>
         {userId==posts?.authorId ?(""): (
           <div className="grid grid-cols-2 gap-4">
           {followResponse &&
           followResponse.data.followers.includes(userId) ? (
             <button
               onClick={() => unfollowHandler(posts?.authorId, userId)}
               className="border bg-slate-800 mr-4 p-1 rounded-md text-yellow-300 w-20"
             >
               Unfollow
             </button>
           ) : (
             <button
               onClick={() => followHandler(posts?.authorId, userId)}
               className="border bg-slate-800 mr-4 p-1 rounded-md text-yellow-300 w-20"
             >
               Follow
             </button>
           )}
           <button className="border bg-slate-800 p-1 text-yellow-300 rounded-md w-20">
             Chat
           </button>
         </div>
         )}
        </div>
      </div>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={() => setShowModal(false)}
            ></div>
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                <div className="mt-3 sm:flex">
                  <div className="flex items-center justify-center flex-none w-12 h-12 mx-auto bg-red-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-red-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="mt-2 text-center sm:ml-4 sm:text-left">
                    <h4 className="text-lg font-medium text-gray-800">
                      Delete Post ?
                    </h4>
                    <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                      Are you sure you want to delete this post? You won`t be
                      able to recover that again !
                    </p>
                    <div className="items-center gap-2 mt-3 sm:flex">
                      <button
                        className="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                        onClick={() => deleteHandler(posts._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Edit Modal */}

      {showEditModal && (
        <div className="fixed inset-0 z-10">
          <div
            className="fixed inset-0 w-full h-full bg-black opacity-90 transition-opacity"
            onClick={() => setShowEditModal(false)}
          ></div>
          <div className="flex items-center justify-center min-h-screen">
            <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-md shadow-lg">
              <div className="mt-3 sm:flex justify-center">
                <div className="text-center sm:text-left">
                  <h4 className="text-2xl font-bold text-gray-800">
                    Edit Blog
                  </h4>
                  <form onSubmit={editHandler}>
                    <div className="md:flex p-1 flex flex-col rounded-lg bg-gray-200 md:items-center mb-6">
                      <img
                        className="p-1 rounded-xl h-32 w-[50%] flex"
                        src={selectedImage ? selectedImage : posts?.imageUrl}
                      />
                      <input
                        type="file"
                        onChange={(e) => handleImageChange(e.target.files[0])}
                        accept="image/x-png,image/gif,image/jpeg"
                        name="file"
                        id="file"
                        className="hidden"
                      />
                      <label
                        htmlFor="file"
                        className="text-md font-medium text-white bg-gray-700 hover:bg-gray-950 inline-block cursor-pointer p-2.5 rounded-md"
                      >
                        Change Cover Image
                      </label>
                    </div>

                    <div className="md:flex md:items-center mb-6">
                      <input
                        className="bg-gray-200 p-2 h-16 font-bold appearance-none text-3xl border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-gray-400 focus:border-purple-500"
                        id="inline-full-name"
                        type="text"
                        value={title ? title : posts?.title}
                        onChange={handleTitle}
                      />
                    </div>

                    <div className="md:flex md:items-center mb-6">
                      <input
                        className="bg-gray-200 font-semibold appearance-none text-2xl border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-gray-400 focus:border-purple-500"
                        id="inline-full-name"
                        type="text"
                        value={subtitle ? subtitle : posts?.subTitle}
                        onChange={handleSubtitle}
                      />
                    </div>

                    <div className="md:flex md:items-center mb-6">
                      <ReactQuill
                        theme="snow"
                        name="content"
                        className="bg-gray-200 overflow-y-scroll max-h-44 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-gray-600"
                        id="inline-password"
                        type="text"
                        value={content ? content : posts?.content}
                        onChange={(value) => handleContent(value)}
                        readOnly={false}
                        modules={modules}
                      />
                    </div>

                    <div className="items-center gap-2 mt-3 sm:flex justify-center">
                      <button
                        type="submit"
                        className="w-44 mt-2 p-2.5 flex-1 text-white bg-violet-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                        onClick={() => setShowEditModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Report Modal */}
      {showReportModal ? (
  <>
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-40"
        onClick={() => setShowReportModal(false)}
      ></div>
      <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-lg p-4 mx-auto bg-sideclr rounded-md shadow-lg">
          <div className="mt-3 sm:flex">
            <div className="mt-2 text-center sm:ml-4 sm:text-left">
              <h4 className="text-lg mb-2 font-bold text-gray-800">
                Report Blog
              </h4>
              <form onSubmit={handleReport}>
                <label className="font-medium" htmlFor="">
                  Please type the reason or the issue for report
                </label>
                <input
                  className="w-full p-2 border border-none mt-3 h-10 rounded-md bg-gray-300"
                  type="text"
                  name="reason"
                />
                <div className="items-center gap-2 mt-3 sm:flex">
                  <button
                    className="w-full mt-2 p-2.5 flex-1 font-medium text-gray-700 hover:bg-gray-400 hover:text-gray-200 bg-gray-300 rounded-md outline-none ring-offset-2 ring-red-600 focus:bg-gray-600 focus:text-white"
                    onClick={() => setShowReportModal(false)}
                    type="button"
                  >
                    close
                  </button>
                  <button
                    type="submit"
                    className="w-full mt-2 p-2.5 flex-1 text-gray-200 bg-exteal rounded-md outline-none hover:bg-teal-950 hover:text-white  focus:bg-blackyteal"
                  >
                    Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
) : null}

    </>
  );
};

export default FullContent;

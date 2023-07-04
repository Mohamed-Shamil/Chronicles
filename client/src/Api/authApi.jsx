
import axiosConfig from "../Config/axiosAuth";

const authAPI = () => {
  const doSignup = async (signupData) => {
    try {
      const response = await axiosConfig.post("/signup", signupData);
      return response;
    } catch (err) {
      throw { msg: err.response.data.message };
    }
  };

  const createNewAccessToken = async () => {
    try {
      const response = await axiosConfig.get("/token");
      return response.data;
    } catch (error) {
      throw { msg: error.response.data.msg };
    }
  };

  const verifyUser = async (loginData) => {
    try {
      const response = await axiosConfig.post("/login", loginData);
      return response;
    } catch (err) {
      throw { msg: err.response.data.message };
    }
  };

  const emailLogin = async (emailData) => {
    try {
      const response = await axiosConfig.post("/emailLogin", emailData);
      return response.data;
    } catch (err) {
      throw { msg: err.response.data.message };
    }
  };

  const createPost = async (formData) => {
    try {
      const response = await axiosConfig.post("/createPost", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response;
    } catch (err) {
      throw { msg: err.message, err };
    }
  };

  const getPost = async () => {
    try {
      const response = await axiosConfig.get("/home");
      return response.data;
    } catch (err) {
      throw { msg: err.message, err };
    }
  };

  const getBlog = async (postId) => {
    try {
      if (postId) {
        const response = await axiosConfig.get(`/getBlog/${postId}`);
        return response.data;
      }
    } catch (error) {
      throw { error };
    }
  };

  const likeBlog = async (postId, userId) => {
    try {
      const response = await axiosConfig.put(`/like/${postId}/${userId}`);
      return response;
    } catch (err) {
      throw { msg: err.message };
    }
  };

  const followUser = async (id, myId) => {
    const response = await axiosConfig.post(`/follow/${id}/${myId}`);
    return response;
  };

  const unfollowUser = async (id, myId) => {
    const response = await axiosConfig.post(`/unfollow/${id}/${myId}`);
    return response;
  };

  const userProfile = async (userId) => {
    const response = await axiosConfig.get(`/profile/${userId}`);

    return response.data;
  };

  const editedUserData = async (formData) => {
    const response = await axiosConfig.post("/editProfile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  };

  const getUserPosts = async (userId) => {
    const response = await axiosConfig.get(`/getUserPosts/${userId}`);

    return response;
  };

  const deletePost = async (postId) => {
    const response = await axiosConfig.delete(`/deletePost/${postId}`);
    return response;
  };

  const getComments = async (postId) => {
    const response = await axiosConfig.get(`/comments/${postId}`);

    return response;
  };

  const postComments = async (postId, commentData) => {
    try {
      const response = await axiosConfig.post(
        `/comment/${postId}`,
        commentData
      );
      return response;
    } catch (error) {
      console.error("Error posting comment:", error);
      throw error;
    }
  };

  const getFollowing = async (userId) => {
    try {
      const response = await axiosConfig.get(`/following/${userId}`);
      return response.data;
    } catch (err) {
      throw { err };
    }
  };

  const getFollowers = async (userId) => {
    try{
      const response = await axiosConfig.get(`/followers/${userId}`);
      return response.data;
    }catch(err) {
      throw{err}
    }
  }

  const editPost = async (formData) => {
    try {
      
      const response = await axiosConfig.post('/editBlog',formData)
      console.log(response);
      return response
    } catch (error) {
      throw {error}
    }
  }

  const reportBlog = async (formData) => {
    let a = []
    try {
      for (const [key, value] of formData.entries()) {
        a.push(value)
        console.log(`${key}: ${value}`);
      }
      console.log(formData);
      const response = await axiosConfig.post('/reportBlog',a)
      console.log(response,"sssssssss");
      return response
    } catch (error) {
      throw {error}
    }
  }

  return {
    doSignup,
    verifyUser,
    getComments,
    postComments,
    createNewAccessToken,
    createPost,
    getPost,
    getBlog,
    likeBlog,
    followUser,
    unfollowUser,
    userProfile,
    editedUserData,
    getUserPosts,
    deletePost,
    emailLogin,
    getFollowers,
    getFollowing,
    editPost,
    reportBlog
  };
};

export default authAPI;

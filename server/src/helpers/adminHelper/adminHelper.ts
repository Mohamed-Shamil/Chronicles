import { reportModel } from "../../model/postModel/reportModel";
import { adminRepository } from "../../repostitories/adminRepository/adminService";

const adminAuthRepo = new adminRepository();

const {
  loginAdmin,
  getAllUserFromDb,
  getAllPostsFromDb,
  blockUserService,
  unBlockUserService,
  getReportFomDb,
  reportBlog,
  unblockPost,
} = adminAuthRepo;

export class adminHelpers {
  async doAdminLogin(loginDetails: any) {
    try {
      if (loginDetails.email && loginDetails.password) {
        const response = await loginAdmin(loginDetails);
        if (response) {
          return {
            email: response.email,
            id: response._id,
          };
        } else {
          throw { msg: "Incorrect Password" };
        }
      } else throw new Error("Require Every Fields");
    } catch (error: object | any) {
      const EmptyError = error.message;
      if (EmptyError) throw EmptyError;
      else throw error;
    }
  }

  async getAllUsers() {
    try {
      const response = await getAllUserFromDb();
      return response;
    } catch (error) {
      throw error;
    }
  }
  async getAllPosts() {
    try {
      const response = await getAllPostsFromDb();
      return response;
    } catch (error) {
      throw error;
    }
  }
  async blockUserHelper(userId: string) {
    try {
      const response = await blockUserService(userId);
      return response;
    } catch (err) {
      throw err; 
    }
  }
  async unblockUserHelper(userId: string) {
    try {
      const response = await unBlockUserService(userId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async checkReport(postId: string) {
    try {
      const response = await reportBlog(postId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async getReports() {
    try {
      const reports = await getReportFomDb();
      return reports;
    } catch (error) {
      throw error;
    }
  }

  async checkUnblock(postId: string) {
    try {
      const response = await unblockPost(postId);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

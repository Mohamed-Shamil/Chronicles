import { userModel } from "../../model/userModel/user";
import { postModel } from "../../model/postModel/postModel";
import { adminModel } from "../../model/adminModel/adminModel";
import { reportModel } from "../../model/postModel/reportModel";

export class adminRepository {
  async loginAdmin(loginDetails: any) {
    try {
      const response = await adminModel.findOne({
        email: loginDetails.email,
        password: loginDetails.password,
      });

      if (response) {
        return response;
      } else {
        throw { msg: "Invalid Credentials" };
      }
    } catch (error: any) {
      const InvalidError = error.msg;
      if (InvalidError) throw InvalidError;
      else throw { error };
    }
  }

  async getAllUserFromDb() {
    try {
      const users = userModel.find();
      return users;
    } catch (error) {
      throw { error };
    }
  }

  async getAllPostsFromDb() {
    try {
      const posts = await postModel
        .aggregate([
          {
            $addFields: {
              authorId: {
                $convert: {
                  input: "$authorId",
                  to: "objectId",
                  onError: null,
                  onNull: null,
                },
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "authorId",
              foreignField: "_id",
              as: "authorDetails",
            },
          },
          {
            $unwind: {
              path: "$authorDetails",
              preserveNullAndEmptyArrays: true,
              includeArrayIndex: "authorIndex",
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              content: 1,
              subTitle: 1,
              image: 1,
              createdAt: 1,
              author: "$authorDetails.name",
            },
          },
        ])
        .sort({ createdAt: -1 });
      return posts;
    } catch (err) {
      throw err;
    }
  }
  async blockUserService(userId: string) {
    try {
      const blockUser = await userModel.findByIdAndUpdate(
        { _id: userId },
        {
          $set: { blocked: true },
        }
      );

      return blockUser;
    } catch (err) {
      throw err;
    }
  }
  async unBlockUserService(userId: string) {
    try {
      const unblockUser = await userModel.findByIdAndUpdate(
        { _id: userId },
        {
          $set: { blocked: false },
        }
      );
      return unblockUser;
    } catch (err) {
      throw err;
    }
  }
  async reportBlog(postId: string) {
    try {
      const ReportedPost = await postModel.findById(postId);

      if (!ReportedPost) {
        return { msg: "blog post not found" };
      }

      const reports = await reportModel.find({ postId });
      if (reports.length === 0) {
        return { message: "No reports found for this blog post" };
      }

      ReportedPost.blocked = true;
      await ReportedPost.save();

      return { message: "Blog post blocked successfully" };
    } catch (error) {}
  }

  async getReportFomDb() {
    try {
      const reports = await reportModel.find();
      return reports;
    } catch (err) {
      throw err;
    }
  }

  async unblockPost(postId: string) {
    try {
      const post = await postModel.findById(postId);
      if (!post) {
        return { message: "Blog post not found" };
      }
      if (!post.blocked) {
        return { message: "Blog post is not blocked" };
      }

      post.blocked = false;
      await post.save();
      
      return { message: "Blog post unblocked successfully" };
    } catch (err) {
      throw err;
    }
  }
}

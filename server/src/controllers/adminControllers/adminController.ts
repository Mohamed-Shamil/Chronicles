import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { adminHelpers } from "../../helpers/adminHelper/adminHelper";
import { createAccessToken } from "../../Auth/jwtAuth";

const adminHelper = new adminHelpers();

const {
  doAdminLogin,
  getAllUsers,
  getAllPosts,
  blockUserHelper,
  unblockUserHelper,
  checkReport,
  getReports,
  checkUnblock
} = adminHelper;

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  try {
    const response = await doAdminLogin(req.body);
    const adminId = response.id.toString();

    const adminAccessToken = createAccessToken(adminId);
    res.cookie("adminAccessToken", adminAccessToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({
      adminId: adminId,
      adminAccessToken,
      msg: "Admin Logined",
    });
  } catch (error) {
    res.status(401).json(error);
  }
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const response = await getAllUsers();
    res.status(200).json(response);
  } catch (error) {
    throw error;
  }
});

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const response = await getAllPosts();
    res.status(200).json(response);
  } catch (error) {
    throw error;
  }
});

export const blockUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const response = await blockUserHelper(userId);
    res.status(200).json(response);
  } catch (err) {
    throw err;
  }
});

export const unblockUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const response = await unblockUserHelper(userId);
    res.status(200).json(response);
  } catch (err) {
    throw err;
  }
});

export const getBlogReports = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const response = await getReports();
      res.send(response);
    } catch (err) {
      throw err;
    }
  }
);

export const blogReport = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const report = await checkReport(postId);
    res.json(report);
  } catch (err) {
    
  }
});

export const unblockPost = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {postId} = req.params
    const unblockResponse = await checkUnblock (postId)
    res.json(unblockResponse )
  } catch (err) {
    throw err;
  }
});

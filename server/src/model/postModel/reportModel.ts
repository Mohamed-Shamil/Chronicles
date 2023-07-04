import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      ref: "post",
      required: true,
    },
    userId: {
      type: String,
      ref: "user",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type typeOfReportSchema = typeof reportModel;

export const reportModel = mongoose.model("report", reportSchema);

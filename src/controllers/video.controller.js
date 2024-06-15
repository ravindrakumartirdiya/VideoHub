import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "asc",
    userId,
  } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  let matchStage = {};
  if (query) {
    matchStage.$text = { $search: query };
  }

  if (userId) {
    matchStage.owner = mongoose.Types.ObjectId(userId);
  }

  let sortStage = {};
  sortStage[sortBy] = sortType === "asc" ? 1 : -1;
  const pipeline = [{ $match: matchStage }, { $sort: sortStage }];

  try {
    const options = {
      page: pageNum,
      limit: limitNum,
    };

    const result = await Video.aggregatePaginate(
      Video.aggregate(pipeline),
      options
    );

    res.json(
      new ApiResponse(
        result.docs,
        result.page,
        result.totalPages,
        result.totalDocs
      )
    );
  } catch (error) {
    throw new ApiError(500, "Server error", error);
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const videoFile = req.files?.videoFile?.[0]?.path;
  const thumbnail = req.files?.thumbnail?.[0]?.path;

  if (!title || !description || !videoFile || !thumbnail) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const [videoUploads, thumbnailUpload] = await Promise.all([
      uploadOnCloudinary(videoFile),
      uploadOnCloudinary(thumbnail),
    ]);

    if (!videoUploads || !thumbnailUpload) {
      throw new ApiError(500, "Error uploading files");
    }

    const video = new Video({
      title,
      description,
      videoFile: videoUploads.secure_url,
      thumbnail: thumbnailUpload.secure_url,
      duration: videoUploads.duration,
      owner: req.user._id,
    });

    await video.save();
    if (!req.user || !req.user._id) {
      console.log("User not logged in");
      throw new ApiError(401, "User not authenticated");
    } else {
      res.status(201).json(new ApiResponse(201, video));
    }
  } catch (error) {
    throw new ApiError(500, "Server error", error);
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).populate("owner", "username");

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  res.json(new ApiResponse(video));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const thumbnail = req.files?.thumbnail?.[0];

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (title) video.title = title;
  if (description) video.description = description;
  if (thumbnail) {
    const thumbnailUpload = await uploadOnCloudinary(thumbnail.path, "image");
    video.thumbnail = thumbnailUpload.secure_url;
  }

  await video.save();

  res.json(new ApiResponse(video));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  await video.remove();

  res.status(204).send();
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    return res
      .status(400)
      .json({ available: false, message: "Invalid video ID" });
  }

  const video = await Video.findById(videoId);

  if (!video) {
    return res
      .status(404)
      .json({ available: false, message: "Video not available" });
  }

  video.isPublished = !video.isPublished;
  await video.save();

  res.status(200).json({
    available: true,
    message: `Video is now ${video.isPublished ? "published" : "unpublished"}`,
  });
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};

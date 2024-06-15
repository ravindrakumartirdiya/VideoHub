import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle like on a video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { userId } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID');
    }

    const existingLike = await Like.findOne({ video: videoId, user: userId });

    if (existingLike) {
        await existingLike.remove();
        return res.json(new ApiResponse(null, "Like removed"));
    } else {
        const like = new Like({ video: videoId, user: userId });
        await like.save();
        return res.json(new ApiResponse(like, "Like added"));
    }
});

// Toggle like on a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, 'Invalid comment ID');
    }

    const existingLike = await Like.findOne({ comment: commentId, user: userId });

    if (existingLike) {
        await existingLike.remove();
        return res.json(new ApiResponse(null, "Like removed"));
    } else {
        const like = new Like({ comment: commentId, user: userId });
        await like.save();
        return res.json(new ApiResponse(like, "Like added"));
    }
});

// Toggle like on a tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { userId } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, 'Invalid tweet ID');
    }

    const existingLike = await Like.findOne({ tweet: tweetId, user: userId });

    if (existingLike) {
        await existingLike.remove();
        return res.json(new ApiResponse(null, "Like removed"));
    } else {
        const like = new Like({ tweet: tweetId, user: userId });
        await like.save();
        return res.json(new ApiResponse(like, "Like added"));
    }
});

// Get all liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const likedVideos = await Like.find({ user: userId, video: { $exists: true } }).populate('video');

    res.json(new ApiResponse(likedVideos));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};

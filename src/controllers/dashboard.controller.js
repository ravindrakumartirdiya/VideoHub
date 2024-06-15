import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Calculate total videos
    const totalVideos = await Video.countDocuments({ owner: channelId });

    // Calculate total views
    const totalViewsResult = await Video.aggregate([
        { $match: { owner: mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = totalViewsResult[0]?.totalViews || 0;

    // Calculate total likes
    const totalLikes = await Like.countDocuments({ videoOwner: channelId });

    // Calculate total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    res.json(new ApiResponse({
        totalVideos,
        totalViews,
        totalLikes,
        totalSubscribers
    }, "Channel statistics retrieved successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Find all videos by the channel
    const videos = await Video.find({ owner: channelId });

    res.json(new ApiResponse(videos, "Channel videos retrieved successfully"));
});

export {
    getChannelStats,
    getChannelVideos
};

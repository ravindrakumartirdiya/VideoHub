import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a tweet
const createTweet = asyncHandler(async (req, res) => {
    const { userId, content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required to create a tweet");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const tweet = new Tweet({
        content,
        owner: userId
    });

    await tweet.save();

    res.status(201).json(new ApiResponse(tweet, "Tweet created successfully"));
});

// Get user tweets
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const tweets = await Tweet.find({ owner: userId });

    res.json(new ApiResponse(tweets, "Tweets retrieved successfully"));
});

// Update a tweet
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { userId, content } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== userId) {
        throw new ApiError(403, "You can only update your own tweets");
    }

    tweet.content = content || tweet.content;
    await tweet.save();

    res.json(new ApiResponse(tweet, "Tweet updated successfully"));
});

// Delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { userId } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== userId) {
        throw new ApiError(403, "You can only delete your own tweets");
    }

    await tweet.remove();

    res.json(new ApiResponse(null, "Tweet deleted successfully"));
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
};

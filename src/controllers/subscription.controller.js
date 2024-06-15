import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle subscription
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { userId } = req.body; // assuming userId is sent in the body

    if (!isValidObjectId(channelId) || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user or channel ID");
    }

    const user = await User.findById(userId);
    const channel = await User.findById(channelId);

    if (!user || !channel) {
        throw new ApiError(404, "User or Channel not found");
    }

    const subscription = await Subscription.findOne({ subscriber: userId, channel: channelId });

    if (subscription) {
        // If subscription exists, remove it (unsubscribe)
        await Subscription.deleteOne({ _id: subscription._id });
        res.json(new ApiResponse(null, "Unsubscribed successfully"));
    } else {
        // If subscription does not exist, create it (subscribe)
        const newSubscription = new Subscription({
            subscriber: userId,
            channel: channelId
        });
        await newSubscription.save();
        res.json(new ApiResponse(newSubscription, "Subscribed successfully"));
    }
});

// Get user channel subscribers
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const subscribers = await Subscription.find({ channel: channelId }).populate('subscriber', 'username email');

    res.json(new ApiResponse(subscribers, "Subscribers retrieved successfully"));
});

// Get subscribed channels
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const user = await User.findById(subscriberId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const subscriptions = await Subscription.find({ subscriber: subscriberId }).populate('channel', 'username email');

    res.json(new ApiResponse(subscriptions, "Subscribed channels retrieved successfully"));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};

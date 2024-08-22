import ContestSubmissions from "../models/contest-submissions-model.js";
import Contest from "../models/contest-model.js";
import User from "../models/user.js";
import mongoose from "mongoose";

const getLeaderboard = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const contestId = req.query.contestId;

        if (!contestId) {
            return res.status(400).json({ message: "contestId is required" });
        }

        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }

        const participantsData = await Contest.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(contestId) } },
            { $unwind: '$participants' }, // Deconstructs the participants array
            { $sort: { 'participants.score': -1, 'participants.submittedAt': 1 } }, // Sort by score descending and submission time ascending
            { $skip: (page - 1) * limit }, // Skip documents for the current page
            { $limit: limit }, // Limit the number of documents per page
            { $project: { _id: 0, schedule: 1, participants: 1 } } // Project only the participants field
        ]);

        const index = (page - 1) * limit;
        participantsData.forEach((p, index) => {
            p.participants.rank = index + 1;
        });
        const userIds = participantsData.map(p => p.participants.user);

        const users = await User.find({ _id: { $in: userIds } }).select('username _id');
        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = user.username;
        });

        const enrichedParticipants = participantsData.map(p => ({
            ...p,
            participants: {
                ...p.participants,
                username: userMap[p.participants.user], // Add username here
            }
        }));

        return res.status(200).json({ status: "ok", data: enrichedParticipants });
    } catch (error) {
        return res.status(500).json({ status: "failed", data: error.message });
    }
}

export { getLeaderboard };
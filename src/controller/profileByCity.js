const profileModel = require("../model/ProfileSchema");


// const profileByCity = async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         console.log("Request for userId:", userId);

//         // Find the current user's profile
//         const currentUser = await profileModel.findOne({ userId });
//         console.log("Current user profile:", currentUser);

//         if (!currentUser) {
//             return res.status(404).json({ message: "No user profile found." });
//         }

//         // Find other users in the same city, excluding the current user
//         const usersInSameCity = await profileModel.find({
//             city: currentUser.city,
//             userId: { $ne: userId },
//         }).populate("userId");

//         if (!usersInSameCity || usersInSameCity.length === 0) {
//             return res.status(404).json({ message: "No users found in this city." });
//         }

//         return res.status(200).json({ users: usersInSameCity });
//     } catch (error) {
//         console.error("Error fetching profiles by city:", error);
//         return res.status(500).json({
//             message: "Something went wrong.",
//             error: error.message,
//         });
//     }
// };

// const profileByCity = async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         console.log("Request for userId:", userId);

//         // Find the current user's profile
//         const currentUser = await profileModel.findOne({ userId });
//         console.log("Current user profile:", currentUser);

//         if (!currentUser) {
//             return res.status(404).json({ message: "No user profile found." });
//         }

//         // Find other users in the same city, excluding the current user
//         const usersInSameCity = await profileModel.find({
//             city: currentUser.city,
//             userId: { $ne: userId },
//         }).populate("userId");

//         // Always return 200, with users array (empty if none found)
//         return res.status(200).json({ users: usersInSameCity });
//     } catch (error) {
//         console.error("Error fetching profiles by city:", error);
//         return res.status(500).json({
//             message: "Something went wrong.",
//             error: error.message,
//         });
//     }
// };


const profileByCity = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("Request for userId:", userId);

        // Get the current user's profile and populate user data (to access gender)
        const currentUserProfile = await profileModel.findOne({ userId }).populate("userId");
        console.log(currentUserProfile);
        

        if (!currentUserProfile) {
            return res.status(404).json({ message: "No user profile found." });
        }

        const currentUserGender = currentUserProfile.userId.gender;
        const currentUserCity = currentUserProfile.city;

        // Build gender filter based on current user's gender
        let genderFilter = {};
        if (currentUserGender === "Male") {
            genderFilter["userId.gender"] = "Female";
        } else if (currentUserGender === "Female") {
            genderFilter["userId.gender"] = "Male";
        } else if (currentUserGender === "Other") {
            genderFilter["userId.gender"] = { $in: ["Male", "Female"] };
        }

        // Find other users in the same city, excluding current user, and apply gender filter
        const usersInSameCity = await profileModel.find({
            city: currentUserCity,
            userId: { $ne: userId }
        })
        .populate({
            path: "userId",
            match: genderFilter["userId.gender"] ? { gender: genderFilter["userId.gender"] } : {},
        });

        // Filter out null userId (those that didn't match gender in populate)
        const filteredUsers = usersInSameCity.filter(u => u.userId !== null);

        return res.status(200).json({ users: filteredUsers });

    } catch (error) {
        console.error("Error fetching profiles by city:", error);
        return res.status(500).json({
            message: "Something went wrong.",
            error: error.message,
        });
    }
};


module.exports = { profileByCity };
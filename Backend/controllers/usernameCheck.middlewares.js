import prisma from "../config/db.config.js";
import { ApiError } from "../utils/ApiError.js";

export const checkUsernameAvailability = async (req, res, next) => {
    const { username } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        if (user) {
            return res.status(200).json({ message: "Username is already taken" });
        }

        res.status(200).json({ message: "Username is available" });

        next();
    } catch (error) {
        console.error("Error checking username availability:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
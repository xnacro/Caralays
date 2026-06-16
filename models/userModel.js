const db = require("../config/db");


class User {
    
    static async findbyUser(username) {
        try {
         const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
         return rows[0];
        } catch (error) {
            console.error("Error in findByUser:", error);
            throw error;
        }
    };
};
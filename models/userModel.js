const db = require("../config/db");

class User {
    
    // find user by identifier (email or username)
    static async findByIdentifiers(identifier) {
        try {
            const [rows] =await db.execute("SELECT * FROM users WHERE email = ? or username = ?", [identifier, identifier]);
            return rows[0]; 
        } catch (error) {
            console.error("Error in findByIdentifiers:", error);
            throw error;
        }
    }

     // find user by username
    static async findByUser(username) {
        try {
            const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
            return rows[0];
        } catch (error) {
            console.error("Error in findByUser:", error);
            throw error;
        }
    }

    // find user by email
    static async findByEmail(email) {
        try {
            const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
            return rows[0];
        } catch (error) {
            console.error("Error in findByEmail:", error);
            throw error;
        }
    }

    // create new user
    static async create({ username, email, password }) {
        try {
            const [user] = await db.execute(
                "INSERT INTO users (username, email, password) VALUES(?, ?, ?)",[username, email, password]
            );
            return { 
                id: user.insertId, 
                username, 
                email
            };
        } catch(error) {
            console.error("Account create error");
            throw error;
        }
    }
};

module.exports = User;
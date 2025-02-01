import { Client, Account, ID } from "appwrite";
import config from "../config/config";

export class AuthService {
    // Create an instance of the Appwrite client
    client = new Client();
    account;

    constructor() {
        // Set up the Appwrite client with endpoint and project ID from config
        this.client.setEndpoint(config.appWriteUrl);
        this.client.setProject(config.appWriteProjectId);

        // Initialize the Account service for authentication
        this.account = new Account(this.client);
    }

    /**
     * Creates a new user account with the given name, email, and password.
     * After successful signup, it automatically logs in the user.
     *
     * @param {Object} param0 - User details
     * @param {string} param0.name - Name of the user
     * @param {string} param0.email - Email of the user
     * @param {string} param0.password - Password of the user
     * @returns {Promise<Object>} - The user session object after login
     * @throws {Error} - If account creation fails
     */
    async createAccount({ name, email, password }) {
        try {
            // Create a new user account with a unique ID
            const userAccount = await this.account.create(ID.unique(), email, password, name);

            if (userAccount) {
                // Automatically log in the user after successful registration
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Logs in a user with email and password.
     *
     * @param {Object} param0 - Login credentials
     * @param {string} param0.email - User's email
     * @param {string} param0.password - User's password
     * @returns {Promise<Object>} - User session object
     * @throws {Error} - If login fails
     */
    
    async login({ email, password }) {
        try {
            // Create an email-password session for authentication
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Fetches details of the currently logged-in user.
     *
     * @returns {Promise<Object|null>} - The authenticated user's details or null if no user is logged in
     * @throws {Error} - If fetching the user fails
     */
    async getUser() {
        try {
            return await this.account.get();
        } catch (error) {
            throw error;
        }

        return null;
    }

    /**
     * Logs out the currently authenticated user by deleting all active sessions.
     *
     * @returns {Promise<void>}
     * @throws {Error} - If logout fails
     */
    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            throw error;
        }
    }
}

// Create a singleton instance of AuthService
const authService = new AuthService();
export default authService;

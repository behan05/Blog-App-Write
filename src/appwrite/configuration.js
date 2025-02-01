
import { Client, Databases, ID, Storage, Query } from "appwrite";
import config from "../config/config";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client.setEndpoint(config.appWriteUrl)
        this.client.setProject(config.appWriteProjectId)

        // create services for further use.
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                config.appWriteDatabaseId,
                config.appWriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }

            )
        } catch (error) {
            console.error("Appwrite serve :: createPost :: error", error);

        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                config.appWriteDatabaseId,
                config.appWriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.error("Appwrite serve :: updatePost :: error", error);

        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                config.appWriteDatabaseId,
                config.appWriteDatabaseId,
                slug
            )
            return true;

        } catch (error) {
            console.error("Appwrite serve :: deletePost :: error", error)
            return false;
        }
    }

    async getPost(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                config.appWriteDatabaseId,
                config.appWriteCollectionId,
                queries
            )

        } catch (error) {
            console.error("Appwrite serve :: getPost :: error", error);
            return false;
        }
    }

    // File upload service

    async uploadFile(file) {
        try {
            return await this.bucket.updateFile(
                config.appWriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.error("Appwrite serve :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            this.bucket.deleteFile(
                config.appWriteBucketId,
                fileId
            )
        } catch (error) {
            console.error("Appwrite serve :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            config.appWriteBucketId,
            fileId
        )
    }

}

const service = new Service();

export default service;
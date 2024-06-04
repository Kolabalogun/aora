import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.ibrahim.aora",
  projectId: "665dce7f000a2fe7fe2e",
  databaseId: "665dd061003a8c79c229",
  userCollectionId: "665dd081001ce4dfee80",
  videosCollectionId: "665dd09c0000cdbdfd10",
  storageId: "665dd1c3001ebb1bc09f",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);

// for avatars

const avatars = new Avatars(client);

// database
const database = new Databases(client);

// storage
const storage = new Storage(client);

// Register User
export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await database.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await database.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error: any) {
    console.log(error);
    return null;
  }
}

export async function getAllPosts() {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function getLatestPosts() {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query: string) {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get video posts created by user
export async function getUserPosts(userId: string) {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file: any, type: string) {
  if (!file) return;

  const asset = {
    type: file.mimeType,
    name: file.fileName,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId: string, type: string) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Create Video Post
export async function createVideoPost(form: any) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await database.createDocument(
      config.databaseId,
      config.videosCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error: any) {
    throw new Error(error);
  }
}

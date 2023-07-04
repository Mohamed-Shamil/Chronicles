
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const bucket = {
  region: process.env.AWS_BUCKET_REGION,
  bucketName: process.env.S3_BUCKET,
  accessKey: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

export const s3 = new S3Client({
  credentials: {
    accessKeyId: bucket.accessKey!,
    secretAccessKey: bucket.secretAccessKey!,
  },
  region: bucket.region!,
});

export const post = (response: any) => {
  const imageUrl = response.map(async (post: any) => {
    const getObjectParams = {
      Bucket: bucket.bucketName,
      Key: post.image,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    post.imageUrl = url;
    const posts = await { ...post, imageUrl: url };
    return posts;
  });
  return imageUrl;
};

export const posts = async (response: any) => {
  try {
    const imageUrlPromises = await response.map(async (post: any) => {
      

      

      if (post.authorImage) {
        const getObjectAuthorParams = {
          Bucket: bucket.bucketName,
          Key: post?.authorImage,
        };

        const commandAuthor = new GetObjectCommand(getObjectAuthorParams);
        const authorUrl = await getSignedUrl(s3, commandAuthor, {
          expiresIn: 3600,
        });
        post.authorImageUrl = authorUrl;
      }

      const getObjectPostParams = {
        Bucket: bucket.bucketName,
        Key: post.image,
      };

      const commandPost = new GetObjectCommand(getObjectPostParams);
      const postUrl = await getSignedUrl(s3, commandPost, { expiresIn: 3600 });

      post.imageUrl = postUrl;
     return post;
    });
    

    const imageUrlResults = await Promise.all(imageUrlPromises);
    return imageUrlResults; // Return an array of post objects with imageUrl and authorImageUrl
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getOneImage = async (response: any) => {
  const getObjectParams = {
    Bucket: bucket.bucketName,
    Key: response[0].image,
  };

  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  response[0].imageUrl = url;

  return response;
};

export const getProfileImage = async (response: any) => {
  const getObjectParams = {
    Bucket: bucket.bucketName,
    Key: response.image,
  };

  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  response.image = url;

  return response;
};

export const deletePost = async (response: any) => {
  try {
    if (!response.image) {
      throw new Error("Image URL not provided");
    }
    const params = {
      Bucket: bucket.bucketName,
      Key: response.image,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    return response; 
  } catch (error) {
    console.error("An error occurred during post deletion:", error);
  }
};

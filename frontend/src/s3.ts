import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3ParseUrl from "s3-url-parser";

export const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_S3_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export const createPresignedUrlWithClient = async (dbUri: string) => {
  const uri =
    dbUri ||
    `https://wanitooo-discord-clone.s3.ap-southeast-1.amazonaws.com/aws-test-img.png`;

  const { bucket, _, key } = s3ParseUrl(uri);

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  //   console.log("Bucket: " + bucket + " / Key: " + key);
  // TODO: Cache url / image if it is not expired yet?
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

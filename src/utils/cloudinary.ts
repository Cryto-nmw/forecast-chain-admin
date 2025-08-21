"use server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import {
  CLOUDINARYKEY,
  CLOUDINARYSECRET,
  CLOUDINARYNAME,
  CLOUDINARY_FOLDER,
} from "@/utils/config";
import { connectToDB } from "@/utils/db";
import { mapMimeToFileType } from "@/utils/syn-type-misc";

cloudinary.config({
  cloud_name: CLOUDINARYNAME,
  api_key: CLOUDINARYKEY,
  api_secret: CLOUDINARYSECRET,
  secure: true,
});

async function fileToStream(file: File): Promise<Readable> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function uploadFilesAndSave(files: File[], agentId: number) {
  const conn = await connectToDB();

  try {
    const uploadPromises = files.map(async (file) => {
      return new Promise<string>(async (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: CLOUDINARY_FOLDER },
          async (error, result) => {
            if (error || !result) {
              reject(error);
            } else {
              try {
                // Insert into DB
                const fileType = mapMimeToFileType(file.type);
                await conn.query(
                  "INSERT INTO agent_files (agent_id, filename, file_type, url, public_id) VALUES (?, ?, ?, ?)",
                  [
                    agentId,
                    file.name,
                    fileType,
                    result.secure_url,
                    result.public_id,
                  ],
                );
                resolve(result.secure_url);
              } catch (dbError) {
                reject(dbError);
              }
            }
          },
        );

        (await fileToStream(file)).pipe(uploadStream);
      });
    });

    const urls = await Promise.all(uploadPromises);
    return urls; // returned here
  } finally {
    // conn.release();
  }
}

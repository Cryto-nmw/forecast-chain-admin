export const CLOUDINARYURL: string = process.env.CLOUDINARY_URL ?? "";
export const CLOUDINARYKEY: string = process.env.CLOUDINARY_KEY ?? "";
export const CLOUDINARYSECRET: string = process.env.CLOUDINARY_SECRET ?? "";
export const CLOUDINARYNAME: string = process.env.CLOUDINARY_NAME ?? "";
export const CLOUDINARY_FOLDER: string = process.env.CLOUDINARY_FOLDER ?? "";
export const DBHST: string = process.env.MARIADB_HOST ?? "";
export const DBUSR: string = process.env.MARIADB_USER ?? "";
export const DBPS: string = process.env.MARIADB_PASSWORD ?? "";
export const DB: string = process.env.MARIADB_DBNME ?? "";
export const OUTLOOK_ADDRESS: string = process.env.EMAIL_USER ?? "";
export const OUTLOOK_PASS: string = process.env.EMAIL_PASS ?? "";

export const OVERALL_PAGINATION_PER_PAGE_SIZE: string =
  process.env.OVERALL_PAGINATION_PER_PAGE_SIZE ?? "10";

export const DOMAIN_NAME: string =
  process.env.DOMAIN_NAME ?? "http://localhost:3000";

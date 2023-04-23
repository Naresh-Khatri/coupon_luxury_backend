import "dotenv/config";
import { Client, Account } from "node-appwrite";

const client = new Client();

const account = new Account(client);

client
  .setProject("coupon_luxury")
  .setEndpoint("https://cloud.appwrite.io/v1")
  // .setKey(process.env.APPWRITE_API_KEY);

export { account, client };

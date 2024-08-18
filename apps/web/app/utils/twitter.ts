'use server';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

const rwClient = twitterClient.readWrite;

export async function tweetMessage (message: string) {
  try {
    await rwClient.v2.tweet(message);
    console.log('Tweeted:', message);
  } catch (error) {
    console.error('Error tweeting message:', error);
  }
};

import dotenv from 'dotenv';
dotenv.config();

export const NOT_FOUND_MESSAGE = 'The requested resource cannot be found.';
export const GENERIC_ERROR_MESSAGE = 'Something went wrong, please try again later. If the problem persists, contact support.';
export const APPLICATION_ENVIRONMENT = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 8000;
export const COOKIE_SETTINGS = { httpOnly: true, secure: true };
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_token_secret_key';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret_key';
export const MAILER_API = process.env.MAILER_API || 'http://localhost:8000';
export const MAILER_API_KEY = process.env.MAILER_API_KEY || 'mailer_api_key';
export const FE_URL = process.env.FE_URL || 'http://localhost:3000';
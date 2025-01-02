import axios from "axios";
import jwt from "jsonwebtoken";
import { MAILER_API, MAILER_API_KEY } from "../constants";
import { CustomError } from "../lib/error/custom.error";

const generateToken = ({ receiverMail }: { receiverMail: string }) => {
  const payload = { to: receiverMail, from: "Pianifica" };
  const options = { expiresIn: "5min" };
  return jwt.sign(payload, MAILER_API_KEY, options);
};

const sendMail = async (
  receiverMail: string,
  subject: string,
  content: string
) => {
  try {
    const token = generateToken({ receiverMail });
    const headers = {
      "Content-Type": "application/json",
      "x-auth-token": token,
    };
    const requestBody = { subject, html: content };
    const response = await axios.post(`${MAILER_API}/send-email`, requestBody, {
      headers,
    });

    return { status: response.status, data: response.data };
  } catch (error) {
    throw new CustomError(500, "Mail not sent!", "Error sending mail.");
  }
};

export default sendMail;

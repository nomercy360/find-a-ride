import hmacSHA256 from "crypto-js/hmac-sha256";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "@/server/db/client";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { auth_date, query_id, user, hash } = req.query;


  if (auth_date && query_id && user && hash) {
    const data = 'auth_date=' + auth_date + '\nquery_id=' + query_id + '\nuser=' + user;
    const secret = process.env.TELEGRAM_BOT_TOKEN;
    const secretKey = hmacSHA256(secret || '', 'WebAppData');
    const secretKeyHash = hmacSHA256(data, secretKey);

    const username = JSON.parse(user as string).username;
    if (username) {
      if (secretKeyHash.toString() === hash) {
        const apiUser = await prisma.user.findUnique({
          where: {
            username: username
          }
        })
        if (apiUser) {
          const token = jwt.sign({ sub: apiUser.id }, process.env.JWT_SECRET || '', { expiresIn: '1d' })
          res.status(200).json({ token })
        } else {
          res.status(401).json({ message: 'User not found' })
        }
      } else {
        res.status(401).json({ message: 'Invalid hash' })
      }
    }
  } else {
    res.status(401).json({ message: 'Invalid request' })
  }
}
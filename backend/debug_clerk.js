import { createClerkClient } from '@clerk/backend';
import dotenv from 'dotenv';
dotenv.config();

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

console.log('Clerk Client Keys:', Object.keys(clerkClient));
// Also check common ones
console.log('verifyToken exists:', !!clerkClient.verifyToken);
console.log('verifyJwt exists:', !!clerkClient.verifyJwt);
console.log('authenticateRequest exists:', !!clerkClient.authenticateRequest);

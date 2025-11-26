import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createErrorResponse } from './create-response';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Middleware to authenticate requests using Supabase JWT tokens
 */
export async function authenticateRequest(request: NextRequest): Promise<{ user: any; token: string } | Response> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse({
        errorMessage: 'Authorization header with Bearer token required',
        status: 401,
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return createErrorResponse({
        errorMessage: 'JWT token is required',
        status: 401,
      });
    }

    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return createErrorResponse({
        errorMessage: 'Invalid or expired token',
        status: 401,
      });
    }

    return { user, token };
  } catch (error) {
    console.error('Authentication error:', error);
    return createErrorResponse({
      errorMessage: 'Authentication failed',
      status: 401,
    });
  }
}

/**
 * Higher-order function that wraps route handlers with authentication
 */
export function withAuth(
  handler: (request: NextRequest, context: { user: any; token: string }) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    const authResult = await authenticateRequest(request);

    if (authResult instanceof Response) {
      return authResult;
    }

    const { user, token } = authResult;

    try {
      return await handler(request, { user, token });
    } catch (error) {
      console.error('Handler error:', error);

      const anyError = error as any;
      const errorMessage: string =
        typeof anyError?.message === "string"
          ? anyError.message
          : "Internal server error";
      const status: number =
        typeof anyError?.statusCode === "number"
          ? anyError.statusCode
          : 500;

      return createErrorResponse({
        errorMessage,
        status,
      });
    }
  };
}
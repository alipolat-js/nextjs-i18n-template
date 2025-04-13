import { IMiddlewareContext } from '@/interfaces/middleware';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware type definition with context
export type Middleware = (request: NextRequest, context: IMiddlewareContext) => Promise<NextResponse | null>;

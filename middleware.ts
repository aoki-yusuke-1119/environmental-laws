import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // IP制限チェック
  const clientIp = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
  const allowedIps = process.env.ALLOWED_IPS?.split(',').map(ip => ip.trim()) || [];

  // 許可IPリストが設定されている場合はチェック
  if (allowedIps.length > 0 && clientIp) {
    const isAllowed = allowedIps.some(allowedIp => {
      // CIDR記法対応（例: 192.168.1.0/24）または完全一致
      if (allowedIp.includes('/')) {
        // 簡易的なCIDRチェック（完全な実装ではないが基本的なケースに対応）
        const [network, bits] = allowedIp.split('/');
        const prefix = network.split('.').slice(0, parseInt(bits) / 8).join('.');
        return clientIp.startsWith(prefix);
      }
      return clientIp === allowedIp;
    });

    if (!isAllowed) {
      return new NextResponse('アクセスが拒否されました。許可されたIPアドレスからのみアクセス可能です。', {
        status: 403,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  }

  // Basic認証チェック
  const basicAuth = request.headers.get('authorization');
  const url = request.nextUrl;

  // Basic認証が設定されている場合のみチェック
  const authUsername = process.env.BASIC_AUTH_USER;
  const authPassword = process.env.BASIC_AUTH_PASSWORD;

  if (authUsername && authPassword) {
    if (!basicAuth) {
      return new NextResponse('認証が必要です', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      });
    }

    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    if (user !== authUsername || pwd !== authPassword) {
      return new NextResponse('認証に失敗しました', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      });
    }
  }

  return NextResponse.next();
}

// API routes と static files 以外に適用
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

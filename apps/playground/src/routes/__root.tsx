import { createRootRoute, Outlet, HeadContent, Scripts } from '@tanstack/solid-router';
import { HydrationScript } from 'solid-js/web';
import { Suspense } from 'solid-js';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Viviana UI - Playground' },
      { name: 'description', content: 'Interactive playground for Viviana UI components' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument(props: { children: any }) {
  return (
    <html lang="en">
      <head>
        <HydrationScript />
        <HeadContent />
      </head>
      <body class="min-h-screen bg-bg-50 text-bg-900 antialiased">
        <Suspense fallback={<div class="p-8">Loading...</div>}>
          {props.children}
        </Suspense>
        <Scripts />
      </body>
    </html>
  );
}

/// <reference types="vite/client" />
import { Suspense, type JSX } from "solid-js";
import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/solid-router";
import { HydrationScript } from "solid-js/web";
import appStyles from "@/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Proyecto Viviana" },
      {
        name: "description",
        content: "Beautiful, accessible SolidJS components inspired by React Spectrum",
      },
    ],
    links: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Sen:wght@400..800&display=swap",
      },
      { rel: "stylesheet", href: appStyles },
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

function RootDocument(props: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <HydrationScript />
        <HeadContent />
      </head>
      <body class="font-jost antialiased">
        <Suspense>{props.children}</Suspense>
        <Scripts />
      </body>
    </html>
  );
}

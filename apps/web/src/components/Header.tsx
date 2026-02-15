import { Link, useLocation } from "@tanstack/solid-router";
import { Button, Logo, GitHubIcon } from "@proyecto-viviana/ui";
import { createSignal, onMount, Show } from "solid-js";

export function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);

  // Check if we're on the landing page - only landing gets transparent header
  const isLandingPage = () => location().pathname === "/";

  onMount(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  });

  const isActive = (path: string) => {
    const current = location().pathname;
    if (path === "/") return current === "/";
    return current.startsWith(path);
  };

  // Header should be solid on all pages except landing (when not scrolled)
  const shouldShowSolidHeader = () => scrolled() || !isLandingPage();

  return (
    <header
      class={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldShowSolidHeader()
          ? "glass-strong border-b border-accent/30 shadow-lg shadow-black/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div class="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          class={`flex items-center transition-all duration-500 ${
            mounted() ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          <Logo size="lg" />
        </Link>

        {/* Navigation */}
        <nav
          class={`flex items-center gap-1 transition-all duration-500 delay-100 ${
            mounted() ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <NavLink href="/docs" isActive={isActive("/docs")}>
            Docs
          </NavLink>
          <NavLink href="/playground" isActive={isActive("/playground")}>
            Playground
          </NavLink>
          <NavLink href="/ecosystem" isActive={isActive("/ecosystem")}>
            Ecosystem
          </NavLink>

          {/* Divider */}
          <div class="w-px h-5 bg-primary-700/50 mx-2" />

          {/* GitHub */}
          <a
            href="https://github.com/proyecto-viviana/proyecto-viviana"
            class="p-2 text-primary-400 hover:text-primary-200 hover:bg-primary-700/30 rounded-lg transition-all"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon size={20} />
          </a>

          {/* CTA Button */}
          <Link to="/docs" class="ml-2">
            <Button
              variant="accent"
              size="sm"
              class="relative overflow-hidden group"
            >
              <span class="relative z-10">Get Started</span>
              {/* Shimmer effect on hover */}
              <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/20 to-transparent" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink(props: {
  href: string;
  isActive: boolean;
  children: string;
}) {
  return (
    <Link
      to={props.href}
      class={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
        props.isActive
          ? "text-accent"
          : "text-primary-300 hover:text-primary-100 hover:bg-primary-700/30"
      }`}
    >
      {props.children}

      {/* Active indicator */}
      <Show when={props.isActive}>
        <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent animate-pulse-glow" />
      </Show>
    </Link>
  );
}

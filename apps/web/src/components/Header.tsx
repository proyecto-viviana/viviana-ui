import { Link, useLocation } from "@tanstack/solid-router";
import { Button, Logo, Icon, GitHubIcon } from "@proyecto-viviana/ui";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    const current = location().pathname;
    if (path === "/") return current === "/";
    return current.startsWith(path);
  };

  return (
    <header class="vui-header">
      <div class="vui-header__container">
        <Link to="/" class="flex items-center">
          <Logo size="lg" />
        </Link>
        <nav class="vui-header__nav">
          <Link
            to="/docs"
            class={`vui-header__link ${isActive("/docs") ? "vui-header__link--active" : ""}`}
          >
            Docs
          </Link>
          <Link
            to="/playground"
            class={`vui-header__link ${isActive("/playground") ? "vui-header__link--active" : ""}`}
          >
            Playground
          </Link>
          <Link
            to="/ecosystem"
            class={`vui-header__link ${isActive("/ecosystem") ? "vui-header__link--active" : ""}`}
          >
            Ecosystem
          </Link>
          <a
            href="https://github.com/proyecto-viviana/proyecto-viviana"
            class="vui-header__link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Icon icon={GitHubIcon} size={20} withShadow />
          </a>
          <Link to="/docs">
            <Button variant="primary" style="fill">
              Get Started
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

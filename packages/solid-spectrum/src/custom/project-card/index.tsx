import type { JSX } from "solid-js";

export type ProjectCardSize = "sm" | "md" | "lg";

export interface ProjectCardProps {
  /** Project name shown in tooltip on hover */
  name: string;
  /** Image source for the project logo */
  imageSrc: string;
  /** Alt text for the image */
  imageAlt?: string;
  /** Optional link to the project */
  href?: string;
  /** Size of the card */
  size?: ProjectCardSize;
  /** Whether the project is inactive/greyed out */
  inactive?: boolean;
  /** Additional CSS class */
  class?: string;
}

/**
 * Project card with logo and hover tooltip.
 * Used for showcasing ecosystem projects.
 */
export function ProjectCard(props: ProjectCardProps): JSX.Element {
  const size = () => props.size ?? "sm";
  const inactive = () => props.inactive ?? false;

  const cardContent = () => (
    <>
      <div class="vui-project-card__tooltip">
        <span>{props.name}</span>
      </div>
      <img
        class="vui-project-card__image"
        src={props.imageSrc}
        alt={props.imageAlt ?? props.name}
      />
    </>
  );

  const cardClasses = () =>
    `vui-project-card vui-project-card--${size()} ${inactive() ? "vui-project-card--inactive" : ""} ${props.class ?? ""}`;

  if (props.href) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer" class={cardClasses()}>
        {cardContent()}
      </a>
    );
  }

  return <div class={cardClasses()}>{cardContent()}</div>;
}

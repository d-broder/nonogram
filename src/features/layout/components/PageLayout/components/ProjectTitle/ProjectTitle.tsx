interface ProjectTitleProps {
  onClick?: () => void;
  className?: string;
}

export function ProjectTitle({ onClick, className = "" }: ProjectTitleProps) {
  const title = "NonoParty";

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {title}
      </button>
    );
  }

  return <div className={className}>{title}</div>;
}

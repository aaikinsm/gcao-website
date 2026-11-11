import type { ReactNode } from "react";

export type CmsIconName =
  | "bold"
  | "italic"
  | "underline"
  | "list"
  | "pencil"
  | "code"
  | "image"
  | "clock"
  | "check"
  | "eye"
  | "copy"
  | "trash"
  | "chevron"
  | "paperclip"
  | "video"
  | "star"
  | "group"
  | "link"
  | "mic";

export function CmsIcon({
  name,
  className = "h-4 w-4",
}: {
  name: CmsIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {shape(name)}
    </svg>
  );
}

export function IconLabel({
  icon,
  htmlFor,
  className = "",
  children,
}: {
  icon: CmsIconName;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}) {
  const content = (
    <>
      <CmsIcon name={icon} className="h-4 w-4 shrink-0 opacity-70" />
      <span>{children}</span>
    </>
  );
  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={`inline-flex items-center gap-2 ${className}`}>
        {content}
      </label>
    );
  }
  return <span className={`inline-flex items-center gap-2 ${className}`}>{content}</span>;
}

function shape(name: CmsIconName) {
  switch (name) {
    case "bold":
      return (
        <>
          <path d="M4.5 2.75h4.1a2.35 2.35 0 0 1 0 4.7H4.5z" />
          <path d="M4.5 7.45h4.8a2.5 2.5 0 0 1 0 5H4.5z" />
        </>
      );
    case "italic":
      return (
        <>
          <path d="M10 2.75H6.25" />
          <path d="M9.4 2.75 6.6 13.25" />
          <path d="M5.75 13.25H9.5" />
        </>
      );
    case "underline":
      return (
        <>
          <path d="M4.75 2.75v5.1a3.25 3.25 0 0 0 6.5 0v-5.1" />
          <path d="M3.75 13.25h8.5" />
        </>
      );
    case "list":
      return (
        <>
          <path d="M6.25 4h7" />
          <path d="M6.25 8h7" />
          <path d="M6.25 12h7" />
          <circle cx="3.25" cy="4" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="3.25" cy="8" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="3.25" cy="12" r="0.6" fill="currentColor" stroke="none" />
        </>
      );
    case "pencil":
      return (
        <>
          <path d="M9.2 3.1 12.9 6.8 5.4 14.3 1.8 14.2 1.7 10.6z" />
          <path d="M8 4.3 11.7 8" />
        </>
      );
    case "code":
      return (
        <>
          <path d="M6 4 2.5 8 6 12" />
          <path d="M10 4 13.5 8 10 12" />
        </>
      );
    case "image":
      return (
        <>
          <rect x="2" y="3" width="12" height="10" rx="1.5" />
          <circle cx="5.5" cy="6.2" r="1" />
          <path d="m3.2 11.5 3.1-3.2 2.2 2.1 1.5-1.4 2.8 2.5" />
        </>
      );
    case "clock":
      return (
        <>
          <circle cx="8" cy="8" r="5.25" />
          <path d="M8 5.1V8l2.3 1.5" />
        </>
      );
    case "check":
      return <path d="M3.2 8.3 6.4 11.5 12.8 4.5" />;
    case "eye":
      return (
        <>
          <path d="M1.8 8S4.2 3.8 8 3.8 14.2 8 14.2 8 11.8 12.2 8 12.2 1.8 8 1.8 8z" />
          <circle cx="8" cy="8" r="1.7" />
        </>
      );
    case "copy":
      return (
        <>
          <rect x="5.25" y="2.25" width="8" height="9.5" rx="1.25" />
          <path d="M10.5 13.75H3.25a1 1 0 0 1-1-1V5.5" />
        </>
      );
    case "trash":
      return (
        <>
          <path d="M3 4.25h10" />
          <path d="M6.25 4.25V2.75h3.5v1.5" />
          <path d="M4.4 4.25 5 13.25h6l.6-9" />
        </>
      );
    case "chevron":
      return <path d="m4 6 4 4 4-4" />;
    case "paperclip":
      return <path d="M10.6 7.2 6.7 11.1a2.2 2.2 0 0 1-3.1-3.1l5-5a3.1 3.1 0 0 1 4.4 4.4l-5 5a1.6 1.6 0 0 1-2.3-2.2l4.4-4.3" />;
    case "video":
      return (
        <>
          <rect x="1.75" y="4" width="8.5" height="8" rx="1.25" />
          <path d="M10.25 6.7 14.25 4.6v6.8l-4-2.1z" />
        </>
      );
    case "star":
      return <path d="m8 2.4 1.5 3.2 3.5.4-2.6 2.4.7 3.5L8 10.2 4.9 12l.7-3.5L3 6l3.5-.4z" />;
    case "group":
      return (
        <>
          <circle cx="6" cy="5.2" r="1.7" />
          <circle cx="10.6" cy="5.8" r="1.3" />
          <path d="M2.8 12.4c.4-2 1.8-3 3.2-3s2.8 1 3.2 3" />
          <path d="M9.2 9.6c1.1-.2 2.2.2 2.8 1.6.4.9.6 1.6.6 2.2" />
        </>
      );
    case "link":
      return (
        <>
          <path d="M7 9.2 6.1 10a2.3 2.3 0 0 1-3.2-3.2L4.6 5" />
          <path d="M9 6.8 9.9 6a2.3 2.3 0 0 1 3.2 3.2L11.4 11" />
          <path d="M6.6 9.4 9.4 6.6" />
        </>
      );
    case "mic":
      return (
        <>
          <rect x="6" y="1.75" width="4" height="7.5" rx="2" />
          <path d="M4.25 7.25a3.75 3.75 0 0 0 7.5 0" />
          <path d="M8 11v2.25" />
          <path d="M5.75 13.25h4.5" />
        </>
      );
  }
}

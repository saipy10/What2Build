import { MessageSquare } from "lucide-react";

const FEEDBACK_FORM_URL = "https://forms.gle/zXGLnZCo1MMwcJHm6";

export function FeedbackButton() {
  return (
    <a
      href={FEEDBACK_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Send feedback"
      title="Send feedback"
      className="group fixed bottom-5 left-5 z-50 inline-flex items-center rounded-full border border-border bg-background/95 p-3 text-sm font-medium text-foreground shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:px-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <MessageSquare className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-24 group-hover:opacity-100">
        Feedback
      </span>
    </a>
  );
}

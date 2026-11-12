import { useEffect } from "react";

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Excellent AI Academy` : "Excellent AI Academy";
  }, [title]);
}

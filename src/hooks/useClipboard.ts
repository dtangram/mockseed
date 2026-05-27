import { useState, useCallback } from "react";

const useClipboard = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return [copied, copy] as const;
};

export default useClipboard;

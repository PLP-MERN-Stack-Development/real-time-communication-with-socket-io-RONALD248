import { useRef, useCallback } from 'react';

export const useTypingIndicator = (onStartTyping, onStopTyping, delay = 1000) => {
  const typingTimeoutRef = useRef();
  const isTypingRef = useRef(false);

  const startTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onStartTyping();
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onStopTyping();
    }, delay);
  }, [onStartTyping, onStopTyping, delay]);

  const stopTyping = useCallback(() => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      clearTimeout(typingTimeoutRef.current);
      onStopTyping();
    }
  }, [onStopTyping]);

  return { startTyping, stopTyping };
};
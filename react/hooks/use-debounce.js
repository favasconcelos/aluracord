import { useState, useEffect } from 'react';

const DEFAULT_TIMEOUT = 1000;

export default function useDebounce(value, timeout = DEFAULT_TIMEOUT) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, timeout);

    return () => clearTimeout(handler);
  }, [value, timeout]);

  return debouncedValue;
}

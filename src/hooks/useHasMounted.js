import { useEffect, useState } from 'react';

/** False on the first render; used to avoid flashing persisted values before the UI settles. */
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

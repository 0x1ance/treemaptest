import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type SizeObserverProviderProps = {
  innerWidth: number;
};

const SizeObserverContext = createContext<SizeObserverProviderProps>({
  innerWidth: 0,
});

export const SizeObserverProvider: FC<PropsWithChildren> = ({ children }) => {
  const [innerWidth, setInnerWidth] = useState<number>(0);
  const handleResize = useCallback(() => {
    setInnerWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);
 
  return (
    <SizeObserverContext.Provider value={{ innerWidth }}>
      {children}
    </SizeObserverContext.Provider>
  );
};

export function useSizeObserver() {
  return useContext(SizeObserverContext);
}

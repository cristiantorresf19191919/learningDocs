import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface SidebarSection {
  id: string;
  label: string;
}

interface SidebarContextType {
  sections: SidebarSection[];
  title: string;
  setSidebar: (title: string, sections: SidebarSection[]) => void;
  clearSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  sections: [],
  title: '',
  setSidebar: () => {},
  clearSidebar: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<SidebarSection[]>([]);
  const [title, setTitle] = useState('');

  const setSidebar = useCallback((t: string, s: SidebarSection[]) => {
    setTitle(t);
    setSections(s);
  }, []);

  const clearSidebar = useCallback(() => {
    setTitle('');
    setSections([]);
  }, []);

  return (
    <SidebarContext.Provider value={{ sections, title, setSidebar, clearSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

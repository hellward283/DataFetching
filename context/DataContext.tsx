import React, { createContext, ReactNode, useState } from "react";
import { Product } from "../types/types"; // Import Product type

interface DataContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const DataContext = createContext<DataContextType>({} as DataContextType);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <DataContext.Provider value={{ products, setProducts }}>
      {children}
    </DataContext.Provider>
  );
};

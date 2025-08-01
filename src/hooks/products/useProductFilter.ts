import { useState } from "react";

export const useProductFilter = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showPreparation, setShowPreparation] = useState(false);

  const handleFilterChange = (filter: string, onFilterAll?: () => void) => {
    if (filter !== "all") {
      setShowPreparation(true);
      return;
    }
    setActiveFilter(filter);
    setShowPreparation(false);
    if (onFilterAll) {
      onFilterAll();
    }
  };

  return {
    activeFilter,
    showPreparation,
    handleFilterChange,
  };
};
import { useState, useCallback } from "react";
import type { FilterAdjustments } from "@/lib/advanced-filters";

interface HistoryEntry {
  adjustments: FilterAdjustments;
  filterName: string;
  timestamp: number;
}

const MAX_HISTORY = 20;

/**
 * Hook for managing filter change history with undo/redo
 */
export function useFilterHistory(initialFilter: string) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      adjustments: {},
      filterName: initialFilter,
      timestamp: Date.now(),
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Add a new adjustment to history
   */
  const addToHistory = useCallback(
    (adjustments: FilterAdjustments, filterName: string) => {
      // Remove any future history if we're not at the end
      const newHistory = history.slice(0, currentIndex + 1);

      // Add new entry
      newHistory.push({
        adjustments,
        filterName,
        timestamp: Date.now(),
      });

      // Limit history size
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      } else {
        setCurrentIndex(newHistory.length - 1);
      }

      setHistory(newHistory);
    },
    [history, currentIndex]
  );

  /**
   * Undo to previous state
   */
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  /**
   * Redo to next state
   */
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  /**
   * Get current state
   */
  const getCurrentState = useCallback(() => {
    return history[currentIndex];
  }, [history, currentIndex]);

  /**
   * Check if undo is available
   */
  const canUndo = currentIndex > 0;

  /**
   * Check if redo is available
   */
  const canRedo = currentIndex < history.length - 1;

  /**
   * Clear history
   */
  const clearHistory = useCallback(() => {
    setHistory([
      {
        adjustments: {},
        filterName: initialFilter,
        timestamp: Date.now(),
      },
    ]);
    setCurrentIndex(0);
  }, [initialFilter]);

  return {
    history,
    currentIndex,
    addToHistory,
    undo,
    redo,
    getCurrentState,
    canUndo,
    canRedo,
    clearHistory,
  };
}

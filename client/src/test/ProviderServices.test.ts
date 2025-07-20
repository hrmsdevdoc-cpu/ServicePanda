/**
 * Test Cases for Provider Service Selection
 * Tests the deduplication and selection/deselection functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';

interface ServiceData {
  id: number;
  categoryId: number;
  name: string;
  icon: string;
}

interface FormData {
  selectedServices: number[];
}

// Mock service categories for testing
const mockCategories = [
  { id: 1, name: 'Domestic Cleaning', icon: 'sparkles' },
  { id: 2, name: 'Bond Cleaning', icon: 'building' },
  { id: 3, name: 'Carpet Cleaning', icon: 'home' },
  { id: 15, name: 'Electrical', icon: 'zap' }
];

// Mock provider services with duplicates (simulating the bug)
const mockProviderServicesWithDuplicates: ServiceData[] = [
  { id: 1, categoryId: 1, name: 'Domestic Cleaning', icon: 'sparkles' },
  { id: 2, categoryId: 1, name: 'Domestic Cleaning', icon: 'sparkles' }, // Duplicate
  { id: 3, categoryId: 2, name: 'Bond Cleaning', icon: 'building' },
  { id: 4, categoryId: 2, name: 'Bond Cleaning', icon: 'building' }, // Duplicate
  { id: 5, categoryId: 3, name: 'Carpet Cleaning', icon: 'home' }
];

// Simulate the deduplication logic from ProviderServices.tsx
function extractUniqueServiceIds(providerServices: ServiceData[]): number[] {
  const serviceIds = providerServices.map(service => service.categoryId);
  return Array.from(new Set(serviceIds));
}

// Simulate the selection logic from ProviderServices.tsx
function updateServiceSelection(
  currentSelection: number[], 
  categoryId: number, 
  isCurrentlySelected: boolean
): number[] {
  let newSelectedServices;
  
  if (isCurrentlySelected) {
    // Remove the service (filter out all instances)
    newSelectedServices = currentSelection.filter(id => id !== categoryId);
  } else {
    // Add the service only if not already present (prevent duplicates)
    newSelectedServices = currentSelection.includes(categoryId)
      ? currentSelection
      : [...currentSelection, categoryId];
  }
  
  // Additional safety: remove any duplicates
  return Array.from(new Set(newSelectedServices));
}

describe('Provider Service Selection Tests', () => {
  let formData: FormData;

  beforeEach(() => {
    formData = { selectedServices: [] };
  });

  describe('Initial Service Loading with Deduplication', () => {
    it('should remove duplicate category IDs when loading existing services', () => {
      const uniqueIds = extractUniqueServiceIds(mockProviderServicesWithDuplicates);
      
      expect(uniqueIds).toEqual([1, 2, 3]);
      expect(uniqueIds.length).toBe(3);
      // Verify no duplicates by checking length matches unique set
      expect(new Set(uniqueIds).size).toBe(uniqueIds.length);
    });

    it('should handle empty provider services', () => {
      const uniqueIds = extractUniqueServiceIds([]);
      
      expect(uniqueIds).toEqual([]);
      expect(uniqueIds.length).toBe(0);
    });
  });

  describe('Service Selection Logic', () => {
    it('should add a service when not currently selected', () => {
      const initialSelection = [1, 2];
      const result = updateServiceSelection(initialSelection, 3, false);
      
      expect(result).toEqual([1, 2, 3]);
      expect(result.length).toBe(3);
    });

    it('should remove a service when currently selected', () => {
      const initialSelection = [1, 2, 3];
      const result = updateServiceSelection(initialSelection, 2, true);
      
      expect(result).toEqual([1, 3]);
      expect(result.length).toBe(2);
    });

    it('should not add duplicate services', () => {
      const initialSelection = [1, 2, 3];
      const result = updateServiceSelection(initialSelection, 2, false);
      
      expect(result).toEqual([1, 2, 3]); // Should remain unchanged
      expect(result.length).toBe(3);
    });

    it('should remove all instances of a service ID', () => {
      const initialSelectionWithDuplicates = [1, 2, 2, 3, 2]; // Multiple 2s
      const result = updateServiceSelection(initialSelectionWithDuplicates, 2, true);
      
      expect(result).toEqual([1, 3]);
      expect(result).not.toContain(2);
    });

    it('should deduplicate the result array', () => {
      const initialSelectionWithDuplicates = [1, 1, 2, 3, 3];
      const result = updateServiceSelection(initialSelectionWithDuplicates, 4, false);
      
      expect(result).toEqual([1, 2, 3, 4]);
      expect(result.length).toBe(4);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty selection when adding first service', () => {
      const result = updateServiceSelection([], 1, false);
      
      expect(result).toEqual([1]);
      expect(result.length).toBe(1);
    });

    it('should handle removing the only selected service', () => {
      const result = updateServiceSelection([1], 1, true);
      
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle trying to remove a service that is not selected', () => {
      const initialSelection = [1, 2, 3];
      const result = updateServiceSelection(initialSelection, 4, true);
      
      expect(result).toEqual([1, 2, 3]); // Should remain unchanged
      expect(result.length).toBe(3);
    });
  });

  describe('Server-side Deduplication', () => {
    it('should deduplicate category IDs array', () => {
      const duplicatedArray = [1, 2, 2, 3, 1, 4, 3, 2];
      const deduplicated = Array.from(new Set(duplicatedArray));
      
      expect(deduplicated).toEqual([1, 2, 3, 4]);
      expect(deduplicated.length).toBe(4);
    });

    it('should handle empty array', () => {
      const emptyArray: number[] = [];
      const deduplicated = Array.from(new Set(emptyArray));
      
      expect(deduplicated).toEqual([]);
      expect(deduplicated.length).toBe(0);
    });
  });
});
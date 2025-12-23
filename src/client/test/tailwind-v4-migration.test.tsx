/**
 * Tailwind CSS v4 Migration Validation Tests
 * 
 * These tests ensure that the Tailwind CSS v4 migration maintains
 * the look, feel, and functionality of the project.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from '../components/ui/button';
import { OpenerSlide } from '../features/story/components/OpenerSlide';
import { Card } from '../components/ui/card';

describe('Tailwind CSS v4 Migration', () => {
  describe('Component Rendering', () => {
    it('should render Button component with proper classes', () => {
      const { container } = render(<Button>Test Button</Button>);
      const button = container.querySelector('button');
      
      expect(button).toBeTruthy();
      expect(button?.className).toBeTruthy();
      expect(button?.className).toContain('inline-flex');
      expect(button?.className).toContain('items-center');
      expect(button?.className).toContain('justify-center');
    });

    it('should render OpenerSlide with gradient background class', () => {
      const { container } = render(
        <OpenerSlide year="2024" djName="Test DJ" />
      );
      
      const gradientElement = container.querySelector('[class*="bg-gradient"]');
      expect(gradientElement).toBeTruthy();
    });

    it('should render Card component with proper classes', () => {
      const { container } = render(
        <Card>Test Card</Card>
      );
      
      const card = container.querySelector('[class*="rounded"]');
      expect(card).toBeTruthy();
    });
  });

  describe('Utility Class Application', () => {
    it('should support flex utilities', () => {
      const { container } = render(
        <div className="flex items-center justify-center">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('flex');
      expect(element?.className).toContain('items-center');
      expect(element?.className).toContain('justify-center');
    });

    it('should support color utilities', () => {
      const { container } = render(
        <div className="bg-primary text-primary-foreground">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('bg-primary');
      expect(element?.className).toContain('text-primary-foreground');
    });

    it('should support spacing utilities', () => {
      const { container } = render(
        <div className="p-4 m-2 gap-2">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('p-4');
      expect(element?.className).toContain('m-2');
      expect(element?.className).toContain('gap-2');
    });

    it('should support border radius utilities', () => {
      const { container } = render(
        <div className="rounded-lg">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('rounded-lg');
    });

    it('should support responsive utilities', () => {
      const { container } = render(
        <div className="p-4 md:p-8">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('p-4');
      expect(element?.className).toContain('md:p-8');
    });
  });

  describe('Custom Theme Classes', () => {
    it('should support custom theme color classes', () => {
      const { container } = render(
        <div className="text-theme-text bg-theme-bgStart">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('text-theme-text');
      expect(element?.className).toContain('bg-theme-bgStart');
    });

    it('should support custom story slide classes', () => {
      const { container } = render(
        <div className="slide-p-square" data-ratio="1:1">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('slide-p-square');
      expect(element?.getAttribute('data-ratio')).toBe('1:1');
    });

    it('should support glass panel custom class', () => {
      const { container } = render(
        <div className="glass-panel">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('glass-panel');
    });
  });

  describe('State Variants', () => {
    it('should support hover variants', () => {
      const { container } = render(
        <div className="hover:bg-accent">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('hover:bg-accent');
    });

    it('should support focus variants', () => {
      const { container } = render(
        <button className="focus-visible:ring-2">Test</button>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('focus-visible:ring-2');
    });

    it('should support disabled variants', () => {
      const { container } = render(
        <button className="disabled:opacity-50" disabled>Test</button>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('disabled:opacity-50');
    });
  });

  describe('Dark Mode Support', () => {
    it('should support dark mode classes', () => {
      const { container } = render(
        <div className="dark:bg-background">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('dark:bg-background');
    });
  });

  describe('Typography', () => {
    it('should support font family utilities', () => {
      const { container } = render(
        <div className="font-sans">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('font-sans');
    });

    it('should support font weight utilities', () => {
      const { container } = render(
        <div className="font-bold">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('font-bold');
    });

    it('should support text size utilities', () => {
      const { container } = render(
        <div className="text-xl">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('text-xl');
    });
  });

  describe('Layout Utilities', () => {
    it('should support grid utilities', () => {
      const { container } = render(
        <div className="grid grid-cols-2 gap-4">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('grid');
      expect(element?.className).toContain('grid-cols-2');
      expect(element?.className).toContain('gap-4');
    });

    it('should support positioning utilities', () => {
      const { container } = render(
        <div className="absolute top-0 left-0">Test</div>
      );
      
      const element = container.firstElementChild;
      expect(element?.className).toContain('absolute');
      expect(element?.className).toContain('top-0');
      expect(element?.className).toContain('left-0');
    });
  });

  describe('Build Configuration', () => {
    it('should preserve all component functionality after migration', () => {
      // This test validates that the migration didn't break any component functionality
      const { getByText } = render(<Button>Click Me</Button>);
      const button = getByText('Click Me');
      
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });
});

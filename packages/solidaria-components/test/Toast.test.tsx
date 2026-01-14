/**
 * Toast tests
 *
 * Tests for Toast component functionality including:
 * - Rendering
 * - Toast sub-components
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import {
  ToastProvider,
  ToastTitle,
  ToastDescription,
} from '../src/Toast';

// User event instance - created per test
let user: ReturnType<typeof userEvent.setup>;

describe('Toast', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanup();
  });

  // ============================================
  // TOAST PROVIDER
  // ============================================

  describe('ToastProvider', () => {
    it('should render children', () => {
      render(() => (
        <ToastProvider>
          <div data-testid="child">Child content</div>
        </ToastProvider>
      ));

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(() => (
        <ToastProvider>
          <div data-testid="child1">First</div>
          <div data-testid="child2">Second</div>
        </ToastProvider>
      ));

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });
  });

  // ============================================
  // TOAST TITLE
  // ============================================

  describe('ToastTitle', () => {
    it('should render title', () => {
      render(() => <ToastTitle>My Title</ToastTitle>);

      expect(screen.getByText('My Title')).toBeInTheDocument();
    });

    it('should apply custom class', () => {
      render(() => <ToastTitle class="my-title">Title</ToastTitle>);

      const title = screen.getByText('Title');
      expect(title).toHaveClass('my-title');
    });

    it('should apply custom style', () => {
      render(() => <ToastTitle style={{ color: 'red' }}>Title</ToastTitle>);

      const title = screen.getByText('Title');
      expect(title).toHaveAttribute('style');
    });
  });

  // ============================================
  // TOAST DESCRIPTION
  // ============================================

  describe('ToastDescription', () => {
    it('should render description', () => {
      render(() => <ToastDescription>My Description</ToastDescription>);

      expect(screen.getByText('My Description')).toBeInTheDocument();
    });

    it('should apply custom class', () => {
      render(() => <ToastDescription class="my-desc">Description</ToastDescription>);

      const desc = screen.getByText('Description');
      expect(desc).toHaveClass('my-desc');
    });

    it('should apply custom style', () => {
      render(() => <ToastDescription style={{ 'font-size': '14px' }}>Description</ToastDescription>);

      const desc = screen.getByText('Description');
      expect(desc).toHaveAttribute('style');
    });

    it('should render complex content', () => {
      render(() => (
        <ToastDescription>
          <span>Part 1</span>
          <span>Part 2</span>
        </ToastDescription>
      ));

      expect(screen.getByText('Part 1')).toBeInTheDocument();
      expect(screen.getByText('Part 2')).toBeInTheDocument();
    });
  });

  // ============================================
  // COMBINED USAGE
  // ============================================

  describe('combined usage', () => {
    it('should render title and description together', () => {
      render(() => (
        <div>
          <ToastTitle>Alert Title</ToastTitle>
          <ToastDescription>Alert Description</ToastDescription>
        </div>
      ));

      expect(screen.getByText('Alert Title')).toBeInTheDocument();
      expect(screen.getByText('Alert Description')).toBeInTheDocument();
    });

    it('should render within provider', () => {
      render(() => (
        <ToastProvider>
          <div class="toast-content">
            <ToastTitle>Notification</ToastTitle>
            <ToastDescription>You have a new message</ToastDescription>
          </div>
        </ToastProvider>
      ));

      expect(screen.getByText('Notification')).toBeInTheDocument();
      expect(screen.getByText('You have a new message')).toBeInTheDocument();
    });
  });
});

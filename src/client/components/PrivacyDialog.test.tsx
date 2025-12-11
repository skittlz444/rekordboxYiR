import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PrivacyDialog } from './PrivacyDialog';

describe('PrivacyDialog', () => {
  it('should render trigger button', () => {
    render(
      <PrivacyDialog>
        <button>Privacy Link</button>
      </PrivacyDialog>
    );
    
    const trigger = screen.getByText('Privacy Link');
    expect(trigger).toBeInTheDocument();
  });

  it('should open dialog when trigger is clicked', () => {
    render(
      <PrivacyDialog>
        <button>Open Privacy</button>
      </PrivacyDialog>
    );
    
    const trigger = screen.getByText('Open Privacy');
    fireEvent.click(trigger);
    
    // Check if dialog title is visible
    const title = screen.getByText('Your Data - We Don\'t Use It');
    expect(title).toBeInTheDocument();
  });

  it('should display all privacy policy sections', () => {
    render(
      <PrivacyDialog>
        <button>Open Privacy</button>
      </PrivacyDialog>
    );
    
    const trigger = screen.getByText('Open Privacy');
    fireEvent.click(trigger);
    
    // Check for key privacy points
    expect(screen.getByText('🔒 No Storage')).toBeInTheDocument();
    expect(screen.getByText('🚫 No Access to Your Music')).toBeInTheDocument();
    expect(screen.getByText('🔐 Secure Processing')).toBeInTheDocument();
    expect(screen.getByText('💾 Client-Side Only')).toBeInTheDocument();
  });

  it('should contain information about no data storage', () => {
    render(
      <PrivacyDialog>
        <button>Open Privacy</button>
      </PrivacyDialog>
    );
    
    const trigger = screen.getByText('Open Privacy');
    fireEvent.click(trigger);
    
    expect(screen.getByText(/never stored/i)).toBeInTheDocument();
    // Use getAllByText since "processed in memory" appears in both summary and details
    const processedInMemoryElements = screen.getAllByText(/processed in memory/i);
    expect(processedInMemoryElements.length).toBeGreaterThan(0);
  });

  it('should explain that music files are not accessible', () => {
    render(
      <PrivacyDialog>
        <button>Open Privacy</button>
      </PrivacyDialog>
    );
    
    const trigger = screen.getByText('Open Privacy');
    fireEvent.click(trigger);
    
    expect(screen.getByText(/no way to access your actual music files/i)).toBeInTheDocument();
  });

  it('should mention secure encryption', () => {
    render(
      <PrivacyDialog>
        <button>Open Privacy</button>
      </PrivacyDialog>
    );
    
    const trigger = screen.getByText('Open Privacy');
    fireEvent.click(trigger);
    
    expect(screen.getByText(/industry-standard encryption/i)).toBeInTheDocument();
  });

  it('should explain client-side processing', () => {
    render(
      <PrivacyDialog>
        <button>Open Privacy</button>
      </PrivacyDialog>
    );
    
    const trigger = screen.getByText('Open Privacy');
    fireEvent.click(trigger);
    
    expect(screen.getByText(/happen in your browser/i)).toBeInTheDocument();
  });

  it('should display prominent summary at the top', () => {
    render(
      <PrivacyDialog>
        <button>Open Privacy</button>
      </PrivacyDialog>
    );
    
    const trigger = screen.getByText('Open Privacy');
    fireEvent.click(trigger);
    
    // Check for the clear, prominent summary
    expect(screen.getByText(/We do NOT store your database on our servers/i)).toBeInTheDocument();
    expect(screen.getByText(/zero access to your music library/i)).toBeInTheDocument();
  });
});

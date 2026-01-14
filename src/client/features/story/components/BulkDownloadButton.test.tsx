import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BulkDownloadButton } from './BulkDownloadButton'

describe('BulkDownloadButton', () => {
  it('should render the button', () => {
    const mockOnDownload = vi.fn()
    render(<BulkDownloadButton onDownload={mockOnDownload} />)
    
    expect(screen.getByRole('button', { name: /bulk download/i })).toBeInTheDocument()
  })

  it('should open dialog when button is clicked', () => {
    const mockOnDownload = vi.fn()
    render(<BulkDownloadButton onDownload={mockOnDownload} />)
    
    const button = screen.getByRole('button', { name: /bulk download/i })
    fireEvent.click(button)
    
    expect(screen.getByText('Bulk Download Options')).toBeInTheDocument()
  })

  it('should display download options in dialog', () => {
    const mockOnDownload = vi.fn()
    render(<BulkDownloadButton onDownload={mockOnDownload} />)
    
    const button = screen.getByRole('button', { name: /bulk download/i })
    fireEvent.click(button)
    
    expect(screen.getByText('Download all sizes')).toBeInTheDocument()
    expect(screen.getByText('Download all themes')).toBeInTheDocument()
  })

  it('should show current selection description', () => {
    const mockOnDownload = vi.fn()
    render(<BulkDownloadButton onDownload={mockOnDownload} />)
    
    const button = screen.getByRole('button', { name: /bulk download/i })
    fireEvent.click(button)
    
    expect(screen.getByText('All slides in current size and theme')).toBeInTheDocument()
  })

  it('should update description when all sizes is checked', async () => {
    const mockOnDownload = vi.fn()
    render(<BulkDownloadButton onDownload={mockOnDownload} />)
    
    const openButton = screen.getByRole('button', { name: /bulk download/i })
    fireEvent.click(openButton)
    
    const allSizesSwitch = screen.getByRole('switch', { name: /download all sizes/i })
    fireEvent.click(allSizesSwitch)
    
    await waitFor(() => {
      expect(screen.getByText(/All sizes.*in current theme/)).toBeInTheDocument()
    })
  })

  it('should update description when all themes is checked', async () => {
    const mockOnDownload = vi.fn()
    render(<BulkDownloadButton onDownload={mockOnDownload} />)
    
    const openButton = screen.getByRole('button', { name: /bulk download/i })
    fireEvent.click(openButton)
    
    const allThemesSwitch = screen.getByRole('switch', { name: /download all themes/i })
    fireEvent.click(allThemesSwitch)
    
    await waitFor(() => {
      expect(screen.getByText(/All themes.*in current size/)).toBeInTheDocument()
    })
  })

  it('should call onDownload with correct options when download is clicked', async () => {
    const mockOnDownload = vi.fn()
    render(<BulkDownloadButton onDownload={mockOnDownload} />)
    
    const openButton = screen.getByRole('button', { name: /bulk download/i })
    fireEvent.click(openButton)
    
    const allSizesSwitch = screen.getByRole('switch', { name: /download all sizes/i })
    fireEvent.click(allSizesSwitch)
    
    const downloadButton = screen.getByRole('button', { name: /^download$/i })
    fireEvent.click(downloadButton)
    
    expect(mockOnDownload).toHaveBeenCalledWith({
      allSizes: true,
      allThemes: false,
    })
  })

  it('should close dialog after download', async () => {
    const mockOnDownload = vi.fn()
    render(<BulkDownloadButton onDownload={mockOnDownload} />)
    
    const openButton = screen.getByRole('button', { name: /bulk download/i })
    fireEvent.click(openButton)
    
    const downloadButton = screen.getByRole('button', { name: /^download$/i })
    fireEvent.click(downloadButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Bulk Download Options')).not.toBeInTheDocument()
    })
  })

  it('should be disabled when disabled prop is true', () => {
    const mockOnDownload = vi.fn()
    render(<BulkDownloadButton onDownload={mockOnDownload} disabled={true} />)
    
    const button = screen.getByRole('button', { name: /bulk download/i })
    expect(button).toBeDisabled()
  })
})

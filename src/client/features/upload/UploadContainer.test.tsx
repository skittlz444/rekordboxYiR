import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { UploadContainer } from './UploadContainer'
import { useConfigStore } from '@/client/lib/store'

// Mock the file upload hook
vi.mock('./hooks/useFileUpload', () => ({
  useFileUpload: () => ({
    file: null,
    error: null,
    isUploading: false,
    handleFileSelect: vi.fn(),
    uploadFile: vi.fn(),
    reset: vi.fn(),
  }),
}))

describe('UploadContainer - Logo Upload', () => {
  beforeEach(() => {
    // Reset store before each test
    useConfigStore.getState().resetToDefaults()
  })

  it('should render logo upload button', () => {
    const onUploadSuccess = vi.fn()
    render(<UploadContainer onUploadSuccess={onUploadSuccess} />)
    
    const logoButton = screen.getByLabelText('📷 Logo')
    expect(logoButton).toBeInTheDocument()
  })

  it('should have file input for logo upload', () => {
    const onUploadSuccess = vi.fn()
    render(<UploadContainer onUploadSuccess={onUploadSuccess} />)
    
    const fileInput = document.querySelector('#upload-logo-input') as HTMLInputElement
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('accept', 'image/*')
  })

  it('should show remove button when logo is uploaded', () => {
    const onUploadSuccess = vi.fn()
    
    // Set a logo in the store
    useConfigStore.getState().setLogo('data:image/png;base64,mockbase64')
    
    render(<UploadContainer onUploadSuccess={onUploadSuccess} />)
    
    const removeButton = screen.getByTitle('Remove Logo')
    expect(removeButton).toBeInTheDocument()
  })

  it('should remove logo when remove button is clicked', () => {
    const onUploadSuccess = vi.fn()
    
    // Set a logo in the store
    useConfigStore.getState().setLogo('data:image/png;base64,mockbase64')
    
    render(<UploadContainer onUploadSuccess={onUploadSuccess} />)
    
    const removeButton = screen.getByTitle('Remove Logo')
    fireEvent.click(removeButton)
    
    expect(useConfigStore.getState().logo).toBeNull()
  })

  it('should show feedback message when logo is uploaded', () => {
    const onUploadSuccess = vi.fn()
    
    // Set a logo in the store
    useConfigStore.getState().setLogo('data:image/png;base64,mockbase64')
    
    render(<UploadContainer onUploadSuccess={onUploadSuccess} />)
    
    expect(screen.getByText('Logo uploaded! It will replace your DJ Name on slides.')).toBeInTheDocument()
  })

  it('should not show feedback message when logo is not uploaded', () => {
    const onUploadSuccess = vi.fn()
    render(<UploadContainer onUploadSuccess={onUploadSuccess} />)
    
    expect(screen.queryByText('Logo uploaded! It will replace your DJ Name on slides.')).not.toBeInTheDocument()
  })

  it('should update logo state when setLogo is called', () => {
    const testLogoData = 'data:image/png;base64,testdata'
    useConfigStore.getState().setLogo(testLogoData)
    
    expect(useConfigStore.getState().logo).toBe(testLogoData)
  })
})

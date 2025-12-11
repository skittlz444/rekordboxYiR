import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SettingsPanel } from './SettingsPanel'
import { useConfigStore } from '@/client/lib/store'

describe('SettingsPanel - Logo Upload', () => {
  beforeEach(() => {
    // Reset store before each test
    useConfigStore.getState().resetToDefaults()
  })

  it('should render logo upload button', () => {
    render(<SettingsPanel />)
    
    const logoButton = screen.getByLabelText('📷 Logo')
    expect(logoButton).toBeInTheDocument()
  })

  it('should have file input for logo upload', () => {
    render(<SettingsPanel />)
    
    const fileInput = document.querySelector('#logo-upload') as HTMLInputElement
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('accept', 'image/*')
  })

  it('should show remove button when logo is uploaded', () => {
    // Set a logo in the store
    useConfigStore.getState().setLogo('data:image/png;base64,mockbase64')
    
    render(<SettingsPanel />)
    
    const removeButton = screen.getByTitle('Remove Logo')
    expect(removeButton).toBeInTheDocument()
  })

  it('should not show remove button when no logo is uploaded', () => {
    render(<SettingsPanel />)
    
    const removeButton = screen.queryByTitle('Remove Logo')
    expect(removeButton).not.toBeInTheDocument()
  })

  it('should remove logo when remove button is clicked', () => {
    // Set a logo in the store
    useConfigStore.getState().setLogo('data:image/png;base64,mockbase64')
    
    render(<SettingsPanel />)
    
    const removeButton = screen.getByTitle('Remove Logo')
    fireEvent.click(removeButton)
    
    expect(useConfigStore.getState().logo).toBeNull()
  })

  it('should display help text for logo upload', () => {
    render(<SettingsPanel />)
    
    expect(screen.getByText('Upload a transparent PNG to replace your DJ Name on slides.')).toBeInTheDocument()
  })

  it('should update djName when input changes', () => {
    render(<SettingsPanel />)
    
    const input = screen.getByPlaceholderText('Enter your DJ name')
    fireEvent.change(input, { target: { value: 'DJ Test' } })
    
    expect(useConfigStore.getState().djName).toBe('DJ Test')
  })

  it('should update logo state when setLogo is called', () => {
    const testLogoData = 'data:image/png;base64,testdata'
    useConfigStore.getState().setLogo(testLogoData)
    
    expect(useConfigStore.getState().logo).toBe(testLogoData)
  })
})

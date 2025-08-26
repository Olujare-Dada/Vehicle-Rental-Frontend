'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User, X, Save, Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import { getToken } from "@/lib/auth"
import { API_ENDPOINTS } from "@/lib/config"

interface ProfileData {
  bio: string
  city: string
  country: string
  headline: string
  picture: string
}

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentProfile: ProfileData
  onProfileUpdated: (updatedProfile: ProfileData) => void
}

export default function EditProfileModal({ 
  isOpen, 
  onClose, 
  currentProfile, 
  onProfileUpdated 
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileData>(currentProfile)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [validationErrors, setValidationErrors] = useState<Partial<ProfileData>>({})

  useEffect(() => {
    if (isOpen) {
      setFormData(currentProfile)
      setError('')
      setSuccess('')
      setValidationErrors({})
    }
  }, [isOpen, currentProfile])

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<ProfileData> = {}
    
    // Validate picture URL if provided
    if (formData.picture && !isValidUrl(formData.picture)) {
      errors.picture = 'Please enter a valid URL'
    }
    
    // Validate bio length
    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters'
    }
    
    // Validate headline length
    if (formData.headline && formData.headline.length > 100) {
      errors.headline = 'Headline must be less than 100 characters'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = getToken()
      if (!token) {
        setError('Authentication required. Please sign in again.')
        return
      }

      // Only send fields that have values (not empty strings)
      const updateData: Partial<ProfileData> = {}
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          updateData[key as keyof ProfileData] = value.trim()
        }
      })

      const response = await fetch(API_ENDPOINTS.profileEdit, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess(data.message || 'Profile updated successfully!')
        
        // Update the parent component with new profile data
        onProfileUpdated(data.profile || formData)
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        const errorData = await response.json()
        setError(errorData.error || `Update failed: HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4">
        <Card className="shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Edit Profile</CardTitle>
                <CardDescription>
                  Update your profile information
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={loading}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success Message */}
              {success && (
                <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">{success}</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Profile Picture URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture URL
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.picture}
                  onChange={(e) => handleInputChange('picture', e.target.value)}
                  className={validationErrors.picture ? 'border-red-500' : ''}
                />
                {validationErrors.picture && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.picture}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to keep current picture
                </p>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Headline
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Software Engineer, Student, etc."
                  value={formData.headline}
                  onChange={(e) => handleInputChange('headline', e.target.value)}
                  maxLength={100}
                  className={validationErrors.headline ? 'border-red-500' : ''}
                />
                {validationErrors.headline && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.headline}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.headline.length}/100 characters
                </p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <Textarea
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  maxLength={500}
                  className={validationErrors.bio ? 'border-red-500' : ''}
                />
                {validationErrors.bio && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.bio}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              {/* Location Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., New York"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., United States"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

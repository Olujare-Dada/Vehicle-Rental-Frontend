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

interface ProfileImageData {
  profile_image: File | null
  user_id: string
}

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentProfile: ProfileData
  userId: string
  onProfileUpdated: (updatedProfile: ProfileData) => void
}

export default function EditProfileModal({ 
  isOpen, 
  onClose, 
  currentProfile, 
  userId,
  onProfileUpdated 
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileData>(currentProfile)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [validationErrors, setValidationErrors] = useState<Partial<ProfileData>>({})

  useEffect(() => {
    if (isOpen) {
      setFormData(currentProfile)
      setSelectedImage(null)
      setImagePreview(null)
      setError('')
      setSuccess('')
      setValidationErrors({})
    }
  }, [isOpen, currentProfile])

  // Cleanup image preview URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB')
        return
      }
      
      setSelectedImage(file)
      setError('')
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const removeSelectedImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<ProfileData> = {}
    
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

      // Handle image upload first if there's a selected image
      if (selectedImage) {
        const imageFormData = new FormData()
        imageFormData.append('profile_image', selectedImage)
        imageFormData.append('user_id', userId)

        const imageResponse = await fetch(API_ENDPOINTS.profileUploadImage, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type for FormData - browser sets it automatically
          },
          body: imageFormData
        })

        if (!imageResponse.ok) {
          const imageErrorData = await imageResponse.json()
          throw new Error(imageErrorData.error || 'Image upload failed')
        }

        const imageData = await imageResponse.json()
        // Update the picture field with the new image URL
        formData.picture = imageData.imageUrl || imageData.profile?.picture || ''
      }

      // Only send profile fields that have values (not empty strings)
      const updateData: Partial<ProfileData> = {}
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          updateData[key as keyof ProfileData] = value.trim()
        }
      })

                           // Only make profile update request if there are fields to update
        if (Object.keys(updateData).length > 0) {
          const response = await fetch(API_ENDPOINTS.profileEdit, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
          })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Profile update failed: HTTP ${response.status}`)
        }
      }

      setSuccess('Profile updated successfully!')
      
      // Update the parent component with new profile data
      onProfileUpdated(formData)
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Profile update error:', error)
      setError(error instanceof Error ? error.message : 'Network error. Please check your connection and try again.')
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

              {/* Profile Picture Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                
                {/* Current Image Display */}
                {(currentProfile.picture || imagePreview) && (
                  <div className="mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                      <img
                        src={imagePreview || currentProfile.picture}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Current/Preview</p>
                  </div>
                )}

                {/* File Input */}
                <div className="space-y-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  
                  {selectedImage && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeSelectedImage}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove Selected Image
                      </Button>
                      <span className="text-sm text-gray-600">
                        {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Supported formats: JPG, PNG, GIF. Max size: 10MB
                  </p>
                </div>
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

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ImageUploadStorageProps {
  onImagesChange: (images: string[]) => void
  maxImages?: number
  existingImages?: string[]
}

export default function ImageUploadStorage({ 
  onImagesChange, 
  maxImages = 20, 
  existingImages = [] 
}: ImageUploadStorageProps) {
  const [images, setImages] = useState<string[]>(existingImages)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  const uploadImage = async (file: File): Promise<string> => {
    // Convert file to base64 for storage in database
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result)
      }
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return
    
    // Check if adding these files would exceed maxImages
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images. You currently have ${images.length} images.`)
      return
    }
    
    setUploading(true)
    
    try {
      const uploadPromises = files.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`)
        }
        
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Maximum size is 5MB`)
        }
        
        const imageUrl = await uploadImage(file)
        return imageUrl
      })
      
      const uploadedUrls = await Promise.all(uploadPromises)
      const newImages = [...images, ...uploadedUrls]
      
      setImages(newImages)
      onImagesChange(newImages)
      
    } catch (error) {
      console.error('Upload failed:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      let blob: Blob
      
      if (imageUrl.startsWith('data:')) {
        // Handle base64 data URLs
        const response = await fetch(imageUrl)
        blob = await response.blob()
      } else {
        // Handle regular URLs
        const response = await fetch(imageUrl)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        blob = await response.blob()
      }
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || 'image.jpg'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download image')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Upload Images</Label>
        <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Upload up to {maxImages} images (Max 5MB each)
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="image-upload-storage"
          />
          <Button 
            type="button" 
            onClick={() => document.getElementById('image-upload-storage')?.click()}
            disabled={uploading || images.length >= maxImages}
            className="mb-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Choose Images
              </>
            )}
          </Button>
          {images.length > 0 && (
            <p className="text-sm text-gray-500">
              {images.length} / {maxImages} images uploaded
            </p>
          )}
        </div>
      </div>
      
      {images.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Uploaded Images</Label>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => downloadImage(image, `image-${index + 1}.jpg`)}
                      className="h-8 w-8 p-0"
                    >
                      <ImageIcon className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeImage(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

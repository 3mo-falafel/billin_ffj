'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Eye } from 'lucide-react'
import { Button } from '../ui/button'
import { validateImageFile, uploadImage } from '@/lib/utils/admin-helpers'

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void
  maxImages?: number
  existingImages?: string[]
}

export default function ImageUpload({ 
  onImagesChange, 
  maxImages = 5, 
  existingImages = [] 
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages)
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    if (images.length + files.length > maxImages) {
      alert(`You can upload maximum ${maxImages} images`)
      return
    }

    setUploading(true)

    try {
      const uploadPromises = files.map(async (file) => {
        validateImageFile(file)
        return await uploadImage(file)
      })

      const uploadedImages = await Promise.all(uploadPromises)
      const newImages = [...images, ...uploadedImages]
      setImages(newImages)
      onImagesChange(newImages)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload images')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Images ({images.length}/{maxImages})
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Add Images'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length === 0 ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Click to upload images</p>
          <p className="text-sm text-gray-400">or drag and drop files here</p>
          <p className="text-xs text-gray-400 mt-2">JPEG, PNG, GIF, WebP • Max 5MB each</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Action buttons */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setPreviewImage(image)}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                    className="bg-red-500 bg-opacity-90 hover:bg-opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Image number badge */}
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {index + 1}
              </div>
            </div>
          ))}
          
          {/* Add more button */}
          {images.length < maxImages && (
            <div 
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Add More</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

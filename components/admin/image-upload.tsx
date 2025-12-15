'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Image as ImageIcon, Eye, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void
  maxImages?: number
  existingImages?: string[]
}

interface UploadedImage {
  url: string
  thumbnailUrl?: string
  filename: string
  size: number
  width: number
  height: number
}

export default function ImageUpload({ 
  onImagesChange, 
  maxImages = 5, 
  existingImages = [] 
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const initializedRef = useRef(false)

  // Sync images state when existingImages prop changes
  useEffect(() => {
    // On initial mount or when existingImages changes significantly
    const existingStr = JSON.stringify(existingImages)
    const currentStr = JSON.stringify(images)
    
    if (!initializedRef.current) {
      // First mount - always sync
      console.log('🖼️ ImageUpload - Initial mount, setting images:', existingImages)
      setImages(existingImages)
      initializedRef.current = true
    } else if (existingStr !== currentStr && existingImages.length > 0) {
      // Subsequent update with new images from parent
      console.log('🖼️ ImageUpload - Syncing from parent:', existingImages)
      setImages(existingImages)
    }
  }, [existingImages])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    if (images.length + files.length > maxImages) {
      alert(`You can upload maximum ${maxImages} images`)
      return
    }

    setUploading(true)
    setUploadProgress(`Uploading ${files.length} image(s)...`)

    try {
      const uploadPromises = files.map(async (file, index) => {
        // Validate file size and type
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name}: File too large (max 10MB)`)
        }
        
        if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
          throw new Error(`${file.name}: Invalid file type`)
        }

        setUploadProgress(`Uploading ${index + 1}/${files.length}...`)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('maxWidth', '1600')
        formData.append('quality', '80')
        formData.append('generateThumbnail', 'true')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        let result
        try {
          result = await response.json()
        } catch (parseError) {
          console.error('Failed to parse upload response:', parseError)
          throw new Error('Server returned invalid response')
        }
        
        if (!response.ok) {
          console.error('Upload failed:', result)
          throw new Error(result.error || result.details || `Upload failed with status ${response.status}`)
        }

        console.log('Upload success - full response:', JSON.stringify(result, null, 2))
        
        // Ensure URL starts with / for proper path resolution
        const url = result.data?.url || result.url || ''
        console.log('Extracted URL:', url)
        
        if (!url) {
          console.error('No URL in response. Response data:', result.data)
          throw new Error('No URL returned from upload')
        }
        
        const finalUrl = url.startsWith('/') ? url : `/${url}`
        console.log('Final URL:', finalUrl)
        
        return finalUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      
      // Filter out any empty or invalid URLs
      const validUrls = uploadedUrls.filter(url => url && typeof url === 'string' && url.length > 1)
      
      if (validUrls.length === 0) {
        throw new Error('No valid image URLs returned from upload')
      }
      
      const newImages = [...images, ...validUrls]
      console.log('Setting images:', newImages)
      setImages(newImages)
      onImagesChange(newImages)
      setUploadProgress('Upload complete!')
      setTimeout(() => setUploadProgress(''), 2000)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload images')
      setUploadProgress('')
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
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Add Images
            </>
          )}
        </Button>
      </div>

      {uploadProgress && (
        <div className="text-sm text-blue-600 font-medium animate-pulse">
          {uploadProgress}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
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
          <p className="text-xs text-gray-400 mt-2">JPEG, PNG, WebP • Max 10MB each</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => {
            // Debug: log each image URL
            console.log(`Image ${index + 1}:`, image)
            
            // Skip empty or invalid URLs
            const isValidUrl = image && typeof image === 'string' && image.length > 0
            
            return (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                {isValidUrl ? (
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error(`Failed to load image: ${image}`)
                    target.onerror = null;
                    target.src = '/placeholder.jpg';
                  }}
                  onLoad={() => console.log(`Image loaded successfully: ${image}`)}
                />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-500 text-xs p-2">
                    Invalid URL
                  </div>
                )}
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
          )
          })}
          
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
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/placeholder.jpg';
              }}
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

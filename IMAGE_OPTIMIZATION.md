# Image Optimization System

## Overview
Complete image optimization pipeline implemented to solve slow loading issues in gallery, activities, and news sections.

## System Architecture

### 1. Backend Processing (`lib/utils/image-processor.ts`)
- **Sharp.js Integration**: Server-side image processing
- **Features**:
  - Auto-resize to 1600px max width
  - WebP conversion (80% quality)
  - Thumbnail generation (500px)
  - Metadata extraction
  - File validation (10MB limit)
  - Unique filename generation (MD5 hash + timestamp)

### 2. Upload API Endpoint (`app/api/upload/route.ts`)
- **Endpoint**: `POST /api/upload`
- **Request**: `multipart/form-data` with file
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "url": "/uploads/images/...",
      "thumbnailUrl": "/uploads/thumbnails/...",
      "filename": "...",
      "size": 123456,
      "width": 1600,
      "height": 900,
      "format": "webp"
    }
  }
  ```
- **Validation**:
  - File types: JPEG, JPG, PNG, WebP
  - Max size: 10MB
  - Automatic filename sanitization

### 3. Admin Upload Component (`components/admin/image-upload.tsx`)
- **Updated Features**:
  - API-based upload (replaces base64)
  - Progress indicators
  - Thumbnail preview
  - Error handling
  - Multiple file support

### 4. Frontend Optimization
#### Next.js Image Component
- **Replaced**: All `<img>` tags with `<Image>`
- **Benefits**:
  - Lazy loading
  - Automatic responsive srcset
  - Blur placeholder support
  - Format optimization (WebP/AVIF)

#### Updated Components:
- `components/activities/activities-list.tsx`
- `components/activities/activity-detail.tsx`
- `components/news/news-list.tsx`
- `components/news/news-detail.tsx`

### 5. Gallery Pagination (`components/gallery/photo-gallery.tsx`)
- **Items per page**: 12
- **Features**:
  - Server-side ready (can be extended to API)
  - Category filtering preserved
  - Bilingual navigation
  - Auto-reset on category change

### 6. Next.js Configuration (`next.config.mjs`)
```javascript
images: {
  unoptimized: false,  // Enable optimization
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
  remotePatterns: [...]
}
```

### 7. File Structure
```
public/
  uploads/
    images/       # Full-size optimized images
      .gitkeep
    thumbnails/   # Thumbnail images (500px)
      .gitkeep
```

## Usage

### For Admin Users:
1. Navigate to admin dashboard
2. Use ImageUpload component in any form
3. Select images (max 10MB each)
4. System automatically:
   - Validates file
   - Uploads to server
   - Processes with sharp
   - Generates thumbnail
   - Returns URLs
5. URLs are stored in database (not base64 data)

### For Developers:
```tsx
import ImageUpload from '@/components/admin/image-upload'

<ImageUpload
  maxImages={5}
  existingImages={existingImageUrls}
  onImagesChange={(urls) => setFormData({ ...formData, images: urls })}
/>
```

### Image Display:
```tsx
import Image from 'next/image'

<div className="aspect-video relative">
  <Image
    src={imageUrl}
    alt="Description"
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    loading="lazy"  // or "eager" for above-the-fold
  />
</div>
```

## Performance Improvements

### Before:
- ❌ Base64 data URLs (large payloads)
- ❌ No image optimization
- ❌ No lazy loading
- ❌ No thumbnails
- ❌ All images load at once

### After:
- ✅ Static file serving
- ✅ WebP format (75-80% smaller)
- ✅ Lazy loading
- ✅ Responsive images
- ✅ Thumbnail previews
- ✅ Pagination (12 items/page)
- ✅ Browser caching (60s TTL)

## Deployment Instructions

### VPS Setup:
1. **Install dependencies**:
   ```bash
   npm install sharp multer --legacy-peer-deps
   ```

2. **Create upload directories**:
   ```bash
   mkdir -p public/uploads/images
   mkdir -p public/uploads/thumbnails
   ```

3. **Set permissions**:
   ```bash
   chmod 755 public/uploads
   chmod 755 public/uploads/images
   chmod 755 public/uploads/thumbnails
   ```

4. **Nginx configuration** (add to server block):
   ```nginx
   location /uploads/ {
     alias /var/www/billin_ffj/public/uploads/;
     expires 30d;
     add_header Cache-Control "public, immutable";
   }
   ```

5. **PM2 restart**:
   ```bash
   cd /var/www/billin_ffj
   git pull origin main
   pnpm install --legacy-peer-deps
   pnpm build
   pm2 restart bilin-website
   ```

## Database Migration (Optional)

If converting existing base64 images:
```sql
-- Add migration script to convert base64 to file URLs
-- This would require a custom migration script to:
-- 1. Extract base64 data from database
-- 2. Decode and save as files
-- 3. Process through sharp
-- 4. Update URLs in database
```

## Testing Checklist

- [ ] Upload image in admin dashboard
- [ ] Verify file appears in `public/uploads/images/`
- [ ] Verify thumbnail in `public/uploads/thumbnails/`
- [ ] Check image loads on frontend
- [ ] Test pagination in gallery
- [ ] Verify lazy loading (check Network tab)
- [ ] Test on mobile (responsive images)
- [ ] Check WebP format in browser

## Security Features

1. **File validation**: Type and size checks
2. **Filename sanitization**: Remove special characters
3. **Unique filenames**: Prevents overwrites
4. **Size limits**: 10MB maximum
5. **Type whitelist**: Only JPEG, PNG, WebP

## Future Enhancements

- [ ] CDN integration (Cloudflare, AWS S3)
- [ ] Image deletion cleanup
- [ ] Bulk upload interface
- [ ] Image compression settings UI
- [ ] AVIF format support
- [ ] Progressive image loading
- [ ] Image metadata editing

## Troubleshooting

### Images not uploading:
1. Check `/app/api/upload/route.ts` logs
2. Verify `public/uploads/` directories exist
3. Check file permissions
4. Ensure sharp is installed correctly

### Images not displaying:
1. Check Next.js Image domains in `next.config.mjs`
2. Verify file paths in database
3. Check browser console for errors
4. Verify Nginx static file serving

### Performance issues:
1. Check image file sizes
2. Verify WebP conversion is working
3. Test lazy loading behavior
4. Check browser caching headers

## Migration Complete ✅

All image optimization features have been implemented and are ready for deployment. The system is backwards compatible - existing base64 images will continue to work, while new uploads will use the optimized pipeline.

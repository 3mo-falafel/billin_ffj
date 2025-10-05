# Admin CRUD Operations Testing Checklist

## Testing Instructions
After deployment, systematically test each admin section to ensure all CRUD (Create, Read, Update, Delete) operations work correctly.

## Login
- [ ] Navigate to `/auth/admin-login`
- [ ] Login with: ffjisk@billin.org / iyadSK2008
- [ ] Verify redirect to `/admin` dashboard

---

## 1. Activities Admin (`/admin/activities`)
**Database Table:** `activities`
**Required Columns:** title_en, title_ar, description_en, description_ar, date, image_url, video_url

### Tests:
- [ ] **List**: View all activities
- [ ] **Add New**: Click "Add Activity" button
  - Fill in English title
  - Fill in Arabic title (or use auto-translate)
  - Fill in English description
  - Fill in Arabic description
  - Select date
  - Add image URL (optional)
  - Click "Save"
  - Verify: Activity appears in list
- [ ] **Edit**: Click edit button on an activity
  - Change title or description
  - Click "Save"
  - Verify: Changes appear in list
- [ ] **Delete**: Click delete button
  - Verify: Activity removed from list
- [ ] **Toggle Active**: Toggle is_active status
  - Verify: Status changes

---

## 2. News Admin (`/admin/news`)
**Database Table:** `news`
**Required Columns:** title_en, title_ar, content_en, content_ar, date, featured, image_url, video_url

### Tests:
- [ ] **List**: View all news items
- [ ] **Add New**: Click "Add News" button
  - Fill in English title
  - Fill in Arabic title
  - Fill in English content
  - Fill in Arabic content
  - Select date
  - Toggle featured status
  - Add image URL (optional)
  - Click "Save"
  - Verify: News appears in list
- [ ] **Edit**: Click edit button on a news item
  - Change title or content
  - Click "Save"
  - Verify: Changes appear in list
- [ ] **Delete**: Click delete button
  - Verify: News removed from list
- [ ] **Toggle Featured**: Click featured toggle
  - Verify: Featured status changes

---

## 3. Gallery Admin (`/admin/gallery`)
**Database Table:** `gallery`
**Required Columns:** media_url, media_type, title_en, title_ar, description_en, description_ar, category

### Tests:
- [ ] **List**: View all gallery items
- [ ] **Add New**: Click "Add Media" button
  - Add media URL
  - Select media type (image/video)
  - Fill in English title
  - Fill in Arabic title
  - Fill in English description
  - Fill in Arabic description
  - Select category
  - Click "Save"
  - Verify: Media appears in gallery
- [ ] **Edit**: Click edit button on a media item
  - Change title or description
  - Click "Save"
  - Verify: Changes appear in gallery
- [ ] **Delete**: Click delete button
  - Verify: Media removed from gallery

---

## 4. Homepage Gallery Admin (`/admin/homepage-gallery`)
**Database Table:** `homepage_gallery`
**Required Columns:** title_en, title_ar, image_url, display_order

### Tests:
- [ ] **List**: View all homepage gallery items
- [ ] **Add New**: Click "Add Image" button
  - Add image URL
  - Fill in English title
  - Fill in Arabic title
  - Set display order
  - Click "Save"
  - Verify: Image appears in list
- [ ] **Edit**: Click edit button on an image
  - Change title or order
  - Click "Save"
  - Verify: Changes appear in list
- [ ] **Delete**: Click delete button
  - Verify: Image removed from list
- [ ] **Reorder**: Change display_order values
  - Verify: Images reorder correctly on homepage

---

## 5. News Ticker Admin (`/admin/news-ticker`)
**Database Table:** `news_ticker`
**Required Columns:** message_en, message_ar, display_order

### Tests:
- [ ] **List**: View all news ticker items
- [ ] **Add New**: Click "Add News Ticker Item" button
  - Fill in English message
  - Fill in Arabic message
  - Set display order
  - Click "Save"
  - Verify: Item appears in list
- [ ] **Edit**: Click edit button on an item
  - Change message
  - Click "Save"
  - Verify: Changes appear in list
- [ ] **Delete**: Click delete button
  - Verify: Item removed from list
- [ ] **Toggle Active**: Toggle is_active status
  - Verify: Status changes
- [ ] **Frontend Display**: Visit homepage
  - Verify: News ticker shows active items in correct order

---

## 6. Scholarships Admin (`/admin/scholarships`)
**Database Table:** `scholarships`
**Required Columns:** title_en, title_ar, description_en, description_ar, category, student_name, university_name, scholarship_amount, deadline, requirements_en, requirements_ar, contact_info, image_url

### Tests:
- [ ] **List**: View all scholarships
- [ ] **Add New**: Click "Add Scholarship" button
  - Fill in English title
  - Fill in Arabic title
  - Fill in English description
  - Fill in Arabic description
  - Select category (awarded/available/sponsor_opportunity)
  - Add optional fields (student_name, university_name, amount, deadline)
  - Click "Save"
  - Verify: Scholarship appears in list
- [ ] **Edit**: Click edit button on a scholarship
  - Change title or description
  - Click "Save"
  - Verify: Changes appear in list
- [ ] **Delete**: Click delete button
  - Verify: Scholarship removed from list
- [ ] **Filter by Category**: Test category filters
  - Verify: Correct scholarships show for each category

---

## 7. Involvement Requests Admin (`/admin/involvement`)
**Database Table:** `involvement_requests`
**Columns:** name, email, phone, nationality, involvement_type, message, status

### Tests:
- [ ] **List**: View all involvement requests
- [ ] **Change Status**: Click status dropdown
  - Change status (pending → reviewed → contacted → accepted/rejected)
  - Verify: Status updates
- [ ] **View Details**: Click view button
  - Verify: All request details visible
- [ ] **Delete**: Click delete button (if available)
  - Verify: Request removed from list
- [ ] **Filter by Status**: Test status filters
  - Verify: Correct requests show for each status
- [ ] **Filter by Type**: Test type filters
  - Verify: Correct requests show for each type

---

## 8. Traditional Embroidery Admin (`/admin/crafts/traditional`)
**Database Table:** `traditional_embroidery`
**Required Columns:** title_en, title_ar, description_en, description_ar, image_url, is_featured

### Tests:
- [ ] **List**: View all traditional embroidery items
- [ ] **Add New**: Click "Add Traditional Embroidery" button
  - Fill in English title
  - Fill in Arabic title
  - Fill in English description
  - Fill in Arabic description
  - Add image URL
  - Toggle featured status
  - Click "Save"
  - Verify: Item appears in list
- [ ] **Edit**: Click edit button on an item
  - Change title or description
  - Click "Save"
  - Verify: Changes appear in list
- [ ] **Delete**: Click delete button
  - Verify: Item removed from list
- [ ] **Toggle Featured**: Click featured toggle
  - Verify: Featured status changes

---

## 9. Embroidery For Sale Admin (`/admin/crafts/sale`)
**Database Table:** `embroidery_for_sale`
**Required Columns:** title_en, title_ar, description_en, description_ar, price, image_url, is_featured, sold

### Tests:
- [ ] **List**: View all embroidery for sale items
- [ ] **Add New**: Click "Add Embroidery For Sale" button
  - Fill in English title
  - Fill in Arabic title
  - Fill in English description
  - Fill in Arabic description
  - Set price
  - Add image URL
  - Toggle featured status
  - Click "Save"
  - Verify: Item appears in list
- [ ] **Edit**: Click edit button on an item
  - Change title, description, or price
  - Click "Save"
  - Verify: Changes appear in list
- [ ] **Delete**: Click delete button
  - Verify: Item removed from list
- [ ] **Toggle Featured**: Click featured toggle
  - Verify: Featured status changes
- [ ] **Toggle Sold**: Click sold toggle
  - Verify: Sold status changes

---

## 10. Projects Admin (`/admin/projects`)
**Database Table:** `projects`
**Required Columns:** name, description, location, goal_amount, raised_amount, start_date, end_date, status, images, is_featured

### Tests:
- [ ] **List**: View all projects
- [ ] **Add New**: Click "Add Project" button
  - Fill in project name
  - Fill in description
  - Fill in location
  - Set goal amount
  - Set raised amount
  - Select start date
  - Select end date (optional)
  - Select status (planning/active/completed/paused)
  - Add images (array)
  - Toggle featured status
  - Click "Save"
  - Verify: Project appears in list
- [ ] **Edit**: Click edit button on a project
  - Change name, description, or amounts
  - Click "Save"
  - Verify: Changes appear in list
- [ ] **Delete**: Click delete button
  - Verify: Project removed from list
- [ ] **Toggle Featured**: Click featured toggle
  - Verify: Featured status changes
- [ ] **Filter by Status**: Test status filters
  - Verify: Correct projects show for each status

---

## Common Issues to Check

### 1. Column Name Mismatches
If add/edit forms don't save data, check that the component uses the exact column names from the database schema:
- News Ticker: `message_en/message_ar` (NOT text_en/text_ar)
- Homepage Gallery: `display_order` (NOT order_index)
- All tables: Check `01_schema.sql` for exact column names

### 2. Server Actions
Verify that all admin components use server actions for database operations:
```tsx
import { createClient } from "@/lib/supabase/client"

// Insert
const { data, error } = await supabase
  .from("table_name")
  .insert(formData)

// Update
const { data, error } = await supabase
  .from("table_name")
  .update(formData)
  .eq("id", itemId)

// Delete
const { data, error } = await supabase
  .from("table_name")
  .delete()
  .eq("id", itemId)
```

### 3. Image/Media Upload
Currently using direct URL input. If images don't show:
- Verify URL is accessible
- Check CORS settings if using external hosting
- Consider implementing file upload feature later

### 4. Authentication
If admin pages redirect to login:
- Clear browser cookies
- Login again with ffjisk@billin.org / iyadSK2008
- Check that cookies are being set (secure: false for HTTP)

---

## Deployment Checklist

### On VPS (31.97.72.28):
```bash
# 1. Connect to VPS
ssh root@31.97.72.28

# 2. Navigate to project
cd /var/www/billin_ffj

# 3. Pull latest changes
git pull origin main

# 4. Install dependencies (if package.json changed)
npm install

# 5. Build project
rm -rf .next
npm run build

# 6. Restart PM2
pm2 restart bilin-website

# 7. Check logs
pm2 logs bilin-website

# 8. Verify service is running
pm2 status
```

### Post-Deployment Verification:
1. Visit http://31.97.72.28:3001
2. Check homepage loads
3. Check news ticker displays
4. Login to admin at http://31.97.72.28:3001/auth/admin-login
5. Systematically test each admin section using checklist above

---

## Bug Reporting Template

If you find an issue, document it like this:

**Section:** [e.g., News Admin]
**Action:** [e.g., Trying to add new news item]
**Expected:** [e.g., News item should be saved and appear in list]
**Actual:** [e.g., Page refreshes but nothing happens]
**Error Messages:** [e.g., Check browser console for errors]
**Screenshot:** [Attach if possible]

---

## Status Tracking

Use this section to track testing progress:

**Date:** _____________
**Tester:** _____________

**Completed Sections:**
- [ ] Activities
- [ ] News
- [ ] Gallery
- [ ] Homepage Gallery
- [ ] News Ticker
- [ ] Scholarships
- [ ] Involvement Requests
- [ ] Traditional Embroidery
- [ ] Embroidery For Sale
- [ ] Projects

**Issues Found:** _____________
**All Features Working:** YES / NO

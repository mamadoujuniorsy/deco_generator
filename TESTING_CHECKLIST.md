# Testing Checklist - Interior Design AI

## Date: November 13, 2025
## Status: Ready for Testing

---

## 🔐 Authentication Flow

### Sign Up
- [ ] Navigate to `/auth/signup`
- [ ] Fill in: email, name, password, userType
- [ ] Submit form
- [ ] **Expected**: User registered, redirected to login, tokens stored in localStorage

### Sign In
- [ ] Navigate to `/auth/signin`
- [ ] Enter credentials
- [ ] Submit form
- [ ] **Expected**: JWT tokens stored, redirected to `/welcome`

### Token Management
- [ ] Check localStorage for `accessToken` and `refreshToken`
- [ ] Verify Authorization header in network requests
- [ ] **Expected**: `Bearer <token>` attached to API calls

---

## 🏠 Project Management Flow

### View Existing Projects
- [ ] Navigate to `/newproject` after login
- [ ] **Expected**: 
  - Section showing "Vos projets existants" (if any exist)
  - Each project card shows: name, description, type, style, room count, active status
  - "Continuer →" button on each project

### Continue Existing Project
- [ ] Click on an existing project card
- [ ] **Expected**: Redirected to `/create-layout?projectId=<id>`

### Create New Project
- [ ] On `/newproject`, scroll to "Créer un nouveau projet"
- [ ] Click "Résidentiel" or "Bureaux"
- [ ] **Expected**: Redirected to `/choose-interior-style` with type parameter

### Choose Interior Style
- [ ] On `/choose-interior-style?type=<type>`
- [ ] Select a style (e.g., Minimalist, Contemporary, etc.)
- [ ] **Expected**: Project created via API, redirected to `/create-layout?projectId=<newId>`

---

## 🎨 Room Creation & Design Generation Flow

### Create Layout (Simplified)
- [ ] Navigate to `/create-layout?projectId=<id>`
- [ ] Upload a room photo (JPG/PNG)
- [ ] **Expected**: Image preview displayed
- [ ] Enter design prompt (e.g., "Add modern furniture, plants, warm lighting")
- [ ] Click "Continuer vers la génération 🎨"
- [ ] **Expected**:
  - FormData sent to `POST /api/rooms` with:
    - projectId
    - projectName (auto-generated)
    - projectDescription (from prompt)
    - length, width, height (defaults: 5, 5, 3)
    - images (uploaded file)
  - Room created with base64 image stored in `originalImageUrl`
  - Redirected to `/generate-design?projectId=<id>&roomId=<roomId>&uploadedImage=<base64>`

### Generate Design
- [ ] On `/generate-design` page
- [ ] Verify uploaded image preview is shown
- [ ] Enter generation prompt
- [ ] Select style
- [ ] Click "Generate Design"
- [ ] **Expected**:
  - API call to `POST /api/generate-design` (or Home Designs AI)
  - Design job created
  - Results displayed when ready

---

## 🔍 API Endpoints to Test

### Auth
- [ ] `POST /api/auth/register` - User registration
- [ ] `POST /api/auth/login` - User login
- [ ] `POST /api/auth/refresh` - Token refresh

### Projects
- [ ] `GET /api/projects` - Fetch user projects (requires x-user-id header from middleware)
- [ ] `POST /api/projects` - Create new project
- [ ] `GET /api/projects/[id]` - Get single project

### Rooms
- [ ] `GET /api/rooms?projectId=<id>` - Fetch rooms by project
- [ ] `POST /api/rooms` - Create room with FormData (image + prompt + dimensions)
  - **Test**: Length/width/height defaults (0 if missing)
  - **Test**: Base64 image storage in `originalImageUrl`

### Designs
- [ ] `POST /api/generate-design` - Generate design for room
- [ ] `GET /api/designs?roomId=<id>` - Fetch designs by room

---

## 🐛 Known Issues & Fixes Applied

### ✅ Fixed Issues
1. **JWT Edge Runtime Error**: Replaced `jsonwebtoken` with Edge-compatible base64 decoding
2. **Token Storage**: Migrated from http-only cookies to localStorage
3. **FormData vs JSON**: Changed rooms route to accept `formData()`
4. **Missing Dimensions**: Added safe defaults (length: 5, width: 5, height: 3 or 0)
5. **Image Upload**: Temporarily using base64 storage (BLOB_READ_WRITE_TOKEN not configured)

### ⚠️ Temporary Solutions (To Fix Later)
1. **Image Storage**: Currently storing base64 in DB - should migrate to Vercel Blob/cloud storage
2. **Room Dimensions**: Using defaults - may want to allow users to specify or use AI to detect
3. **Middleware JWT**: Using simple base64 decode - consider `jose` for production

---

## 📊 Success Criteria

### Must Work
- ✅ User can sign up and log in
- ✅ Tokens stored and attached to requests
- ✅ User sees their existing projects on `/newproject`
- ✅ User can continue an existing project or create new one
- ✅ User can upload room photo and enter prompt
- ✅ Room created successfully with base64 image
- ✅ User redirected to generate-design page

### Expected Behavior
- No 401 errors (middleware validates token)
- No 500 errors on room creation (dimensions default to safe values)
- Smooth redirect flow: `/newproject` → `/choose-interior-style` → `/create-layout` → `/generate-design`

---

## 🎯 Test Sequence

1. **Fresh Start**
   ```
   - Clear localStorage
   - Navigate to http://localhost:3000
   ```

2. **Sign Up → Sign In**
   ```
   - Register new user
   - Login with credentials
   ```

3. **Project Selection**
   ```
   - Check if existing projects appear
   - Test "Continue" on existing project (if any)
   - Test creating new project
   ```

4. **Room Creation**
   ```
   - Upload photo
   - Enter prompt
   - Submit form
   - Verify redirect to generate-design
   ```

5. **Design Generation**
   ```
   - Verify image preview
   - Generate design
   - Check results
   ```

---

## 🔧 Quick Debugging Commands

```powershell
# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Check Prisma schema
npx prisma studio

# View middleware logs
# (Check terminal output for "✅ Token valid for user: ...")

# Test API endpoint
curl -X GET http://localhost:3000/api/projects -H "Authorization: Bearer <token>"
```

---

## ✨ Next Steps After Testing

1. If tests pass:
   - Deploy to production
   - Set up Vercel Blob (BLOB_READ_WRITE_TOKEN)
   - Migrate images from base64 to cloud storage

2. If tests fail:
   - Document exact error messages
   - Check terminal logs
   - Verify token flow in browser DevTools Network tab

---

**Ready to test! 🚀**

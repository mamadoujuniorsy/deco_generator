# Backend Refactor Plan

## 1. Update Prisma Schema
- [x] Add User, Project, Room, Design, Upload models with enums and relations
- [x] Keep existing DesignJob model

## 2. Generate Prisma Client
- [x] Run prisma generate

## 3. Create Model Functions
- [x] Add libs/models/User.ts, Project.ts, Room.ts with CRUD functions
- [x] Add libs/models/Design.ts, Upload.ts

## 4. Create API Routes
- [x] Auth: /api/auth/register, /api/auth/login
- [x] Auth: /api/auth/logout
- [x] Projects: /api/projects (CRUD)
- [x] Rooms: /api/rooms (CRUD)
- [x] Designs: /api/designs (CRUD, generate)
- [x] Uploads: /api/uploads

## 5. Update Existing Routes
- [x] Integrate new models with existing design job routes
- [x] Add authentication middleware

## 6. Run Migration
- [x] prisma migrate dev

## 7. Test API Routes
- [x] Verify endpoints work

## 8. Standardize API Response Format
- [x] Update all API routes to return consistent { success: true, data: ... } for success and { success: false, error: ... } for errors
- [x] Updated routes: auth/register, auth/login, projects, rooms, designs, uploads, auth/logout, generate-design, upload

# 🚀 Quick Start Guide - Court Booking System

## ⚡ 30-Second Setup

### Terminal 1 - Backend Server
```bash
cd backend
npm install
node server.js
# Server will start on http://localhost:5001
```

### Terminal 2 - Frontend Server
```bash
cd frontend
npm install
npm run dev
# Frontend will open at http://localhost:5174
```

---

## 🎯 Test the Booking Feature

1. **Open browser:** http://localhost:5174
2. **Click** "Book Court" on any sport
3. **Fill the form:**
   ```
   Name: John Doe
   Roll Number: 2024CS001
   LDAP ID: john.doe@example.com
   Date: [pick a future date]
   Time: [pick any time]
   Reason: Practice match
   File: [optional - upload PDF, DOC, or image]
   ```
4. **Click** "Confirm Booking"
5. **See success message** ✅
6. **Modal closes** automatically

---

## 🛠️ Files Created/Modified

### New Files
- `frontend/src/components/BookingModal.jsx` - Booking form modal
- `frontend/src/components/BookingModal.css` - Modal styling

### Modified Files
- `frontend/src/components/Home.jsx` - Added modal integration
- `backend/server.js` - Added file upload handling
- `backend/package.json` - Added multer dependency

---

## ✅ Verification

Check that both servers are running:

**Backend:**
```bash
curl http://localhost:5001/bookings
# Should return: {"bookings":[]}
```

**Frontend:**
- Open http://localhost:5174 in browser
- Should see sports grid with "Book Court" buttons

---

## 📊 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/book` | POST | Create new booking (FormData) |
| `/bookings` | GET | Get all bookings |
| `/bookings/:id` | GET | Get specific booking |

---

## 🎨 Features Included

✅ Modal with smooth animations  
✅ Form with all required fields  
✅ File upload support (PDF, DOC, JPG, PNG)  
✅ Real-time form validation  
✅ Success/error messages  
✅ Responsive design  
✅ No errors or warnings  

---

## ⚙️ Configuration

**Backend Port:** 5001 (changed from 5000 to avoid macOS AirPlay conflict)  
**Frontend Port:** 5174 (Vite default)  
**File Upload Limit:** 10MB  
**Allowed File Types:** PDF, DOC, DOCX, JPG, PNG  

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5001 in use | Change port in `backend/server.js` line 85 |
| Port 5174 in use | Vite will auto-increment to 5175, 5176... |
| File upload fails | Check file type and size (max 10MB) |
| Modal not opening | Check browser console for errors |
| Backend not responding | Ensure both `npm install` commands ran |

---

## 📝 Next Steps

- View all bookings: `curl http://localhost:5001/bookings`
- View specific booking: `curl http://localhost:5001/bookings/[ID]`
- Connect to database for data persistence
- Add user authentication
- Deploy to production

---

**Status:** ✅ Ready to Use  
**All errors:** Fixed  
**All features:** Implemented

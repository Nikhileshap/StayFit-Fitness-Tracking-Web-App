# 🔧 StayFit Troubleshooting Guide

## "Error Creating Profile" Issues

### 1. 🔍 **Check Browser Console First**
- Open Developer Tools (F12)
- Go to Console tab
- Look for specific error messages
- Take a screenshot if needed

### 2. 🔥 **Common Firebase Issues:**

#### **Issue: Firebase not initialized**
**Error**: `Firebase app not initialized` or similar
**Solution**:
```javascript
// Check if your firebase-config.js has the correct config
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    // ... rest of config
};
```

#### **Issue: Authentication not working**
**Error**: `User is not authenticated` or `No authenticated user found`
**Steps**:
1. Make sure you're logged in first
2. Check Firebase Console > Authentication > Users
3. Verify email/password authentication is enabled

#### **Issue: Firestore permissions**
**Error**: `Missing or insufficient permissions`
**Solution**: Update Firestore Rules in Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /dietPlans/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. 🌐 **Network/CORS Issues:**

#### **Issue: CORS errors**
**Error**: `Access to fetch blocked by CORS policy`
**Solutions**:
- Make sure you're running on a local server (not file://)
- Use VS Code Live Server extension
- Or run: `python -m http.server 8000`

#### **Issue: Module loading errors**
**Error**: `Failed to resolve module specifier`
**Solution**: Ensure you're serving via HTTP server, not opening HTML directly

### 4. 🤖 **Gemini API Issues:**

#### **Issue: API key invalid**
**Error**: `API key not valid`
**Solution**: 
1. Get new API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Replace in firebase-config.js line 178

#### **Issue: API quota exceeded**
**Error**: `Quota exceeded`
**Solution**: The app has fallback functionality, so this should still work

### 5. 🐛 **Debugging Steps:**

#### **Step 1: Check Firebase Connection**
1. Open browser console
2. Look for these messages:
```
Initializing Firebase with config: {apiKey: "...", ...}
Firebase app initialized: FirebaseApp {...}
Firebase Auth initialized: Auth {...}
Firestore initialized: Firestore {...}
```

#### **Step 2: Check Authentication**
1. Sign up/login first
2. Look for: `User is signed in: [user-id]`
3. If not working, check Firebase Console > Authentication

#### **Step 3: Test Profile Creation**
1. Fill out profile form
2. Check console for:
```
Profile submission started
Current user: {uid: "...", email: "..."}
Profile data: {name: "...", age: 25, ...}
```

#### **Step 4: Check Firestore Write**
1. Look for: `Attempting to save profile to Firestore...`
2. Then: `Profile save result: {success: true}`
3. If failed, check Firestore rules and permissions

### 6. 🚨 **Quick Fixes:**

#### **Fix 1: Reset Authentication**
```javascript
// In browser console, run:
firebase.auth().signOut().then(() => {
    location.reload();
});
```

#### **Fix 2: Clear Local Storage**
```javascript
// In browser console, run:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

#### **Fix 3: Check Firebase Project Status**
- Go to Firebase Console
- Verify project is active
- Check if Billing is enabled (required for some features)

### 7. 📋 **Verification Checklist:**

- [ ] Running on HTTP server (not file://)
- [ ] Firebase project created and active
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Firestore rules updated
- [ ] API keys correctly configured
- [ ] Browser console shows no errors
- [ ] User successfully signed up/logged in

### 8. 🆘 **Emergency Fallback:**

If nothing works, try this minimal test:

1. Open browser console
2. Run this test:
```javascript
// Test Firebase connection
console.log('Testing Firebase...');
StayFitApp.firebaseAuth.getCurrentUser();
```

3. If user is null, the authentication failed
4. If user exists, the Firestore write is failing

### 9. 📞 **Still Need Help?**

If you're still getting errors:

1. **Copy the exact error message** from browser console
2. **Take screenshot** of the error
3. **Check what step fails** in the console logs
4. **Verify your Firebase setup** in the console

### 10. 🔄 **Common Solutions Summary:**

1. **"User not authenticated"** → Log out and log back in
2. **"Permission denied"** → Update Firestore rules
3. **"Module not found"** → Use HTTP server, not file://
4. **"API key invalid"** → Check and replace API keys
5. **"Network error"** → Check internet connection and CORS

---

**Most profile creation errors are due to:**
- Authentication state not properly set
- Firestore permissions not configured
- Running app from file:// instead of HTTP server


# StayFit - Your Personal Fitness Companion 🏋️‍♀️

A comprehensive web application that helps users track their fitness journey with personalized diet plans powered by AI. Built with HTML, CSS, JavaScript, Firebase, and the Gemini API.

![StayFit Banner](assets/banner.png)

## 🌟 Features

- **🔐 User Authentication**: Secure sign up and login with Firebase Authentication
- **👤 Profile Management**: Complete user profiles with fitness goals, body metrics, and preferences
- **🤖 AI-Powered Diet Plans**: Personalized nutrition recommendations using Google's Gemini API
- **📱 Responsive Design**: Mobile-first design that works seamlessly on all devices
- **☁️ Real-time Data Storage**: User profiles and diet plans stored securely in Firebase Firestore
- **🎯 Interactive Dashboard**: Clean, modern UI with easy navigation between different sections
- **✏️ Profile Editing**: Update personal information and regenerate diet plans as needed
- **📊 BMI Calculation**: Automatic BMI calculation and display
- **🔄 Diet Plan Regeneration**: Generate new plans based on updated goals or preferences

## 🚀 Live Demo

[Add your live demo URL here once deployed]

## 📸 Screenshots

### 🔑 Authentication
- Clean login and signup forms with validation
- Secure Firebase authentication integration
- Form switching between login and signup

### 🛠️ Profile Setup
- Comprehensive profile creation with fitness goals
- Input validation for accurate data collection
- Age, weight, height, and goal selection

### 🏠 Dashboard
- Overview of user profile and current diet plan
- Quick access to edit profile and regenerate plans
- Beautiful card-based layout

### 🍎 Diet Plan
- Detailed nutritional recommendations
- Personalized meal suggestions and supplement advice
- Goal-specific nutrition guidance

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend Services**: Firebase (Authentication & Firestore)
- **AI Integration**: Google Gemini API
- **Styling**: Custom CSS with modern design principles
- **Icons**: Font Awesome 6.0
- **Fonts**: Google Fonts (Inter)
- **Architecture**: Single Page Application (SPA)

## 🏗️ Project Structure

```
StayFit-App/
├── index.html              # Main HTML file with all sections
├── css/
│   └── style.css           # Complete styling and responsive design
├── js/
│   ├── firebase-config.js  # Firebase configuration and API functions
│   └── script.js           # Main application logic
├── assets/                 # Project assets and documentation images
├── images/                 # User-uploaded images (future feature)
└── README.md               # Project documentation
```

## ⚙️ Setup Instructions

### Prerequisites

1. **Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Authentication (Email/Password provider)
   - Enable Firestore Database

2. **Google Gemini API**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Generate a new API key
   - Keep this key secure and private

### 🚀 Installation Steps

1. **Clone or Download the Project**
   ```bash
   git clone [your-repository-url]
   cd StayFit-App
   ```

2. **Configure Firebase**
   - In Firebase Console, go to Project Settings
   - Copy your Firebase configuration object
   - Open `js/firebase-config.js`
   - Replace the placeholder values with your actual Firebase config:

   ```javascript
   const firebaseConfig = {
       apiKey: "your-actual-api-key",
       authDomain: "your-project-id.firebaseapp.com",
       projectId: "your-actual-project-id",
       storageBucket: "your-project-id.appspot.com",
       messagingSenderId: "your-actual-sender-id",
       appId: "your-actual-app-id"
   };
   ```

3. **Configure Gemini API**
   - Open `js/firebase-config.js`
   - Find the `geminiAPI` object
   - Replace the placeholder API key:

   ```javascript
   const API_KEY = 'your-actual-gemini-api-key-here';
   ```

4. **Set up Firebase Security Rules**
   - Go to Firebase Console > Firestore Database > Rules
   - Use these security rules:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only access their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Diet plans can only be accessed by the owner
       match /dietPlans/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

5. **Local Development**
   - Since this app uses ES6 modules, you need to serve it through a web server
   - **Option 1**: Use Live Server extension in VS Code
   - **Option 2**: Use Python's built-in server:
     ```bash
     python -m http.server 8000
     ```
   - **Option 3**: Use Node.js http-server:
     ```bash
     npx http-server
     ```

6. **Access the Application**
   - Open your browser and go to `http://localhost:8000` (or the port your server is using)
   - The application should load and be ready to use!

## 🔒 Environment Variables & Security

### Important Security Notes:

1. **🔑 API Keys**: Never commit your actual API keys to version control
2. **🌐 Firebase Config**: While Firebase config is safe to expose on the client side, keep your Gemini API key secure
3. **🌍 CORS**: The app is configured to work with Firebase's CORS policies
4. **🛡️ Security Rules**: Proper Firestore rules ensure users can only access their own data

### Recommended Setup for Production:

1. **🔧 Environment Variables**: Use environment variables or build-time substitution for API keys
2. **🌐 Domain Restrictions**: Restrict your Firebase project to specific domains in production
3. **🔒 API Key Restrictions**: Restrict your Gemini API key to specific referrers

## 📊 Database Structure

### Firestore Collections:

**Users Collection (`/users/{userId}`)**
```javascript
{
  name: "John Doe",
  age: 25,
  weight: 75.5,
  height: 180,
  fitnessGoal: "muscle_gain", // "muscle_gain", "fat_loss", "weight_gain"
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Diet Plans Collection (`/dietPlans/{userId}`)**
```javascript
{
  userId: "user-id",
  proteinIntake: "150g per day",
  carbIntake: "300g per day",
  waterIntake: "3 liters per day",
  creatineCycle: "5g daily consistently",
  nutrientIntake: "Focus on whole foods, vitamins D, B12, omega-3",
  detailedPlan: {
    overview: "Customized nutrition plan for muscle gain",
    breakfast: "Oats with protein powder and berries...",
    lunch: "Grilled chicken with quinoa and vegetables...",
    dinner: "Lean protein with steamed vegetables...",
    snacks: "Greek yogurt, nuts, protein smoothies...",
    supplements: "Whey protein, multivitamin, omega-3...",
    tips: "Stay consistent with your nutrition plan..."
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🎯 Features Breakdown

### 🔐 Authentication System
- **Firebase Authentication** with email/password
- Form validation and error handling
- Automatic session management
- Secure logout functionality
- Form switching between login/signup

### 👤 Profile Management
- Comprehensive user onboarding
- BMI calculation and display
- Profile editing with real-time updates
- Form validation for all inputs
- Fitness goal selection

### 🤖 AI Diet Plan Generation
- **Gemini API integration** for personalized recommendations
- Fallback system when API is unavailable
- Goal-specific nutrition advice (muscle gain, fat loss, weight gain)
- Detailed meal planning and supplement recommendations
- Smart JSON parsing from AI responses

### 📱 Responsive Design
- Mobile-first CSS approach
- Flexible grid layouts
- Touch-friendly navigation
- Optimized for all screen sizes
- Modern glassmorphism effects

### 💫 User Experience
- Loading states and progress indicators
- Toast notifications for user feedback
- Intuitive navigation between sections
- Modern, clean UI design
- Smooth animations and transitions

## 🔧 Customization

### 🎨 Styling
- All styles are in `css/style.css`
- CSS custom properties for easy theming
- Responsive breakpoints clearly defined
- Modern glassmorphism effects
- Easy color scheme modification

### ⚙️ Functionality
- Modular JavaScript structure
- Easy to extend with new features
- Well-documented code
- Error handling throughout
- Debugging utilities available

## 🐛 Troubleshooting

### Common Issues:

1. **🔥 Firebase Connection Issues**
   - Verify your Firebase configuration
   - Check if Authentication and Firestore are enabled
   - Ensure your domain is authorized in Firebase settings

2. **🤖 Gemini API Issues**
   - Verify your API key is correct
   - Check if you have sufficient API quota
   - The app includes fallback functionality if the API is unavailable

3. **🌐 CORS Errors**
   - Ensure you're serving the app through a web server, not opening the HTML file directly
   - Check your browser's developer console for specific error messages

4. **📦 Module Import Errors**
   - Make sure you're using a modern browser that supports ES6 modules
   - Ensure the server is serving JavaScript files with the correct MIME type

## 🚀 Deployment Options

### Firebase Hosting (Recommended)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

### Other Options
- **Netlify**: Drag and drop the project folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Push to a GitHub repository and enable Pages
- **Surge**: Simple static web publishing

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## 🙏 Acknowledgments

- **Firebase** for robust backend services
- **Google Gemini API** for intelligent diet recommendations
- **Font Awesome** for beautiful icons
- **Google Fonts** for elegant typography
- **The fitness community** for inspiration and feedback

## 🆕 Future Enhancements

- [ ] **Meal Tracking**: Log daily meals and track macros
- [ ] **Progress Photos**: Upload and compare body transformation photos
- [ ] **Workout Plans**: AI-generated workout routines
- [ ] **Social Features**: Share progress with friends
- [ ] **Nutrition Database**: Extensive food database integration
- [ ] **Wearable Integration**: Sync with fitness trackers
- [ ] **Dark Mode**: Theme switching capability
- [ ] **Multi-language Support**: Internationalization
- [ ] **Offline Mode**: PWA capabilities
- [ ] **Push Notifications**: Meal and workout reminders

## 🔍 API Reference

### Firebase Functions
- `firebaseAuth.signUp(email, password)`
- `firebaseAuth.signIn(email, password)`
- `firebaseAuth.signOut()`
- `firebaseDB.createUserProfile(userId, profileData)`
- `firebaseDB.getUserProfile(userId)`
- `firebaseDB.updateUserProfile(userId, profileData)`
- `firebaseDB.saveDietPlan(userId, dietPlanData)`
- `firebaseDB.getDietPlan(userId)`

### Gemini AI Functions
- `geminiAPI.generateDietPlan(userProfile)`
- `geminiAPI.generateFallbackPlan(userProfile)`

---

**Made with ❤️ for fitness enthusiasts everywhere!**

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Create an issue in this repository
3. Contact the developer directly
4. Check the Firebase and Gemini API documentation

**Happy fitness tracking! 💪**

---

### 📋 Quick Start Checklist

- [ ] Clone the repository
- [ ] Set up Firebase project
- [ ] Get Gemini API key
- [ ] Configure `firebase-config.js`
- [ ] Set up Firestore security rules
- [ ] Start local server
- [ ] Test the application
- [ ] Deploy to production

### 🎯 Key Metrics

- **Load Time**: < 3 seconds
- **Mobile Responsive**: 100%
- **Accessibility**: WCAG 2.1 AA compliant
- **Browser Support**: Chrome, Firefox, Safari, Edge
- **Security**: Firebase Authentication + Firestore Rules
=======
# StayFit-Fitness-Tracking-Web-App


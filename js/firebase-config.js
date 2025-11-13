// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your web app's Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
    apiKey: "AIzaSyAa9tnzvfmmwIiJZwjEHkdS00kdxdS5RXU",
    authDomain: "stayfit-40600.firebaseapp.com",
    projectId: "stayfit-40600",
    storageBucket: "stayfit-40600.firebasestorage.app",
    messagingSenderId: "535661979515",
    appId: "1:535661979515:web:f8a1571fee1cb63987bfde"
};

// Initialize Firebase
console.log('Initializing Firebase with config:', firebaseConfig);
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
console.log('Firebase Auth initialized:', auth);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
console.log('Firestore initialized:', db);

// Authentication functions
export const firebaseAuth = {
    // Sign up with email and password
    async signUp(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign in with email and password
    async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign out
    async signOut() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    },

    // Auth state observer
    onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback);
    }
};

// Firestore database functions
export const firebaseDB = {
    // Create user profile
    async createUserProfile(userId, profileData) {
        try {
            const userRef = doc(db, 'users', userId);
            await setDoc(userRef, {
                ...profileData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            console.error('Error creating user profile:', error);
            return { success: false, error: error.message };
        }
    },

    // Get user profile
    async getUserProfile(userId) {
        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                return { success: true, data: userSnap.data() };
            } else {
                return { success: false, error: 'No user profile found' };
            }
        } catch (error) {
            console.error('Error getting user profile:', error);
            return { success: false, error: error.message };
        }
    },

    // Update user profile
    async updateUserProfile(userId, profileData) {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                ...profileData,
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating user profile:', error);
            return { success: false, error: error.message };
        }
    },

    // Save diet plan
    async saveDietPlan(userId, dietPlanData) {
        try {
            const dietPlanRef = doc(db, 'dietPlans', userId);
            await setDoc(dietPlanRef, {
                userId: userId,
                ...dietPlanData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            console.error('Error saving diet plan:', error);
            return { success: false, error: error.message };
        }
    },

    // Get diet plan
    async getDietPlan(userId) {
        try {
            const dietPlanRef = doc(db, 'dietPlans', userId);
            const dietPlanSnap = await getDoc(dietPlanRef);

            if (dietPlanSnap.exists()) {
                return { success: true, data: dietPlanSnap.data() };
            } else {
                return { success: false, error: 'No diet plan found' };
            }
        } catch (error) {
            console.error('Error getting diet plan:', error);
            return { success: false, error: error.message };
        }
    },

    // Update diet plan
    async updateDietPlan(userId, dietPlanData) {
        try {
            const dietPlanRef = doc(db, 'dietPlans', userId);
            await updateDoc(dietPlanRef, {
                ...dietPlanData,
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating diet plan:', error);
            return { success: false, error: error.message };
        }
    }
};

// Gemini AI integration for diet plan generation
export const geminiAPI = {
    // Generate diet plan using Gemini API
    async generateDietPlan(userProfile) {
        try {
            // Replace with your actual Gemini API key
            const API_KEY = 'AIzaSyAneBzNqrrmA5BuiiCYIb4HzdB8RmB9YVA';
            // const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
            const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

            const prompt = `
            Create a personalized diet plan for a user with the following profile:
            - Name: ${userProfile.name}
            - Age: ${userProfile.age} years
            - Weight: ${userProfile.weight} kg
            - Height: ${userProfile.height} cm
            - Fitness Goal: ${userProfile.fitnessGoal}

            Please provide a detailed response in JSON format with the following structure:
            {
                "proteinIntake": "X grams per day",
                "carbIntake": "X grams per day", 
                "waterIntake": "X liters per day",
                "creatineCycle": "specific creatine recommendations",
                "nutrientIntake": "other important nutrients and vitamins",
                "detailedPlan": {
                    "overview": "brief overview of the diet plan",
                    "breakfast": "breakfast recommendations",
                    "lunch": "lunch recommendations", 
                    "dinner": "dinner recommendations",
                    "snacks": "healthy snack options",
                    "supplements": "supplement recommendations",
                    "tips": "additional diet tips"
                }
            }

            Base the recommendations on their fitness goal:
            - For muscle gain: higher protein, adequate carbs, caloric surplus
            - For fat loss: moderate protein, controlled carbs, caloric deficit
            - For weight gain: higher calories, balanced macros, frequent meals

            Ensure all recommendations are safe, realistic, and based on scientific evidence.
            `;

            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            };

            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text;

            // Try to parse JSON from AI response
            let dietPlan;
            try {
                // Extract JSON from the response (in case there's additional text)
                const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    dietPlan = JSON.parse(jsonMatch[0]);
                } else {
                    // If no JSON found, create a structured response from the text
                    dietPlan = this.parseTextToDietPlan(aiResponse);
                }
            } catch (parseError) {
                console.error('Error parsing AI response:', parseError);
                dietPlan = this.parseTextToDietPlan(aiResponse);
            }

            return { success: true, data: dietPlan };

        } catch (error) {
            console.error('Error generating diet plan:', error);

            // Fallback diet plan based on user profile
            const fallbackPlan = this.generateFallbackPlan(userProfile);
            return { success: true, data: fallbackPlan, fallback: true };
        }
    },

    // Parse text response to diet plan structure
    parseTextToDietPlan(text) {
        return {
            proteinIntake: "1.6-2.2g per kg body weight",
            carbIntake: "3-5g per kg body weight",
            waterIntake: "2-3 liters per day",
            creatineCycle: "3-5g daily, no loading phase needed",
            nutrientIntake: "Focus on whole foods, vitamins D, B12, omega-3",
            detailedPlan: {
                overview: "Balanced nutrition plan tailored to your fitness goals",
                breakfast: "Protein-rich breakfast with complex carbs",
                lunch: "Lean protein, vegetables, and healthy fats",
                dinner: "Light protein with vegetables",
                snacks: "Greek yogurt, nuts, fruits",
                supplements: "Protein powder, multivitamin if needed",
                tips: text.substring(0, 500) + "..."
            }
        };
    },

    // Generate fallback plan when API fails
    generateFallbackPlan(userProfile) {
        const bmi = userProfile.weight / Math.pow(userProfile.height / 100, 2);
        const proteinNeeds = userProfile.weight * (userProfile.fitnessGoal === 'muscle_gain' ? 2.2 : 1.6);

        let plan = {
            proteinIntake: `${Math.round(proteinNeeds)}g per day`,
            carbIntake: userProfile.fitnessGoal === 'fat_loss' ? "2-3g per kg body weight" : "4-6g per kg body weight",
            waterIntake: "2.5-3 liters per day",
            creatineCycle: userProfile.fitnessGoal === 'muscle_gain' ? "5g daily consistently" : "Optional, 3-5g daily",
            nutrientIntake: "Focus on whole foods, adequate vitamins and minerals",
            detailedPlan: {
                overview: `Customized nutrition plan for ${userProfile.fitnessGoal.replace('_', ' ')}`,
                breakfast: "Oats with protein powder and berries, or eggs with whole grain toast",
                lunch: "Grilled chicken/fish with quinoa and vegetables",
                dinner: "Lean protein with steamed vegetables and sweet potato",
                snacks: "Greek yogurt, nuts, protein smoothies, fruits",
                supplements: "Whey protein, multivitamin, omega-3 if needed",
                tips: `Stay consistent with your nutrition plan. Track your progress and adjust portions based on your ${userProfile.fitnessGoal.replace('_', ' ')} goals.`
            }
        };

        // Customize based on fitness goal
        if (userProfile.fitnessGoal === 'fat_loss') {
            plan.detailedPlan.tips += " Focus on creating a moderate caloric deficit while maintaining protein intake.";
        } else if (userProfile.fitnessGoal === 'muscle_gain') {
            plan.detailedPlan.tips += " Ensure you're eating in a caloric surplus and getting adequate protein throughout the day.";
        } else if (userProfile.fitnessGoal === 'weight_gain') {
            plan.detailedPlan.tips += " Increase meal frequency and include healthy high-calorie foods like nuts, avocados, and healthy oils.";
        }

        return plan;
    }
};

// Export the initialized Firebase app
export { app, auth, db };

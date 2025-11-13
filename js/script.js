// Import Firebase functions
import { firebaseAuth, firebaseDB, geminiAPI } from './firebase-config.js';

// Application state
const appState = {
    currentUser: null,
    userProfile: null,
    currentSection: 'dashboard'
};

// DOM elements
const elements = {
    // Containers
    authContainer: document.getElementById('auth-container'),
    profileSetup: document.getElementById('profile-setup'),
    appContainer: document.getElementById('app-container'),
    navbar: document.getElementById('navbar'),
    loadingSpinner: document.getElementById('loading-spinner'),
    
    // Authentication forms
    loginForm: document.getElementById('login-form'),
    signupForm: document.getElementById('signup-form'),
    loginFormEl: document.getElementById('loginForm'),
    signupFormEl: document.getElementById('signupForm'),
    profileFormEl: document.getElementById('profileForm'),
    updateProfileFormEl: document.getElementById('updateProfileForm'),
    
    // Navigation
    navMenu: document.getElementById('nav-menu'),
    hamburger: document.getElementById('hamburger'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // Sections
    dashboardSection: document.getElementById('dashboard-section'),
    profileSection: document.getElementById('profile-section'),
    dietPlanSection: document.getElementById('diet-plan-section'),
    
    // Dynamic content
    userName: document.getElementById('user-name'),
    profileInfo: document.getElementById('profile-info'),
    dietPlanPreview: document.getElementById('diet-plan-preview'),
    dietPlanContainer: document.getElementById('diet-plan-container'),
    
    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('StayFit app initializing...');
    initializeApp();
});

// Initialize application
async function initializeApp() {
    showLoading();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check authentication state
    firebaseAuth.onAuthStateChanged(async (user) => {
        hideLoading();
        
        if (user) {
            console.log('User is signed in:', user.uid);
            appState.currentUser = user;
            await loadUserData();
        } else {
            console.log('User is not signed in');
            showAuthContainer();
        }
    });
}

// Set up all event listeners
function setupEventListeners() {
    // Auth form switching
    document.getElementById('show-signup')?.addEventListener('click', (e) => {
        e.preventDefault();
        showSignupForm();
    });
    
    document.getElementById('show-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
    
    // Form submissions
    elements.loginFormEl?.addEventListener('submit', handleLogin);
    elements.signupFormEl?.addEventListener('submit', handleSignup);
    elements.profileFormEl?.addEventListener('submit', handleProfileSubmission);
    elements.updateProfileFormEl?.addEventListener('submit', handleProfileUpdate);
    
    // Navigation
    elements.hamburger?.addEventListener('click', toggleMobileMenu);
    elements.logoutBtn?.addEventListener('click', handleLogout);
    
    // Navigation links
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.closest('.nav-link').getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.target.closest('.edit-btn').getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Regenerate diet plan
    document.getElementById('regenerate-plan')?.addEventListener('click', regenerateDietPlan);
}

// Authentication handlers
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    showLoading();
    const result = await firebaseAuth.signIn(email, password);
    hideLoading();
    
    if (result.success) {
        showToast('Signed in successfully!');
    } else {
        showToast(result.error, 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters long', 'error');
        return;
    }
    
    showLoading();
    const result = await firebaseAuth.signUp(email, password);
    hideLoading();
    
    if (result.success) {
        showToast('Account created successfully!');
    } else {
        showToast(result.error, 'error');
    }
}

async function handleLogout() {
    showLoading();
    const result = await firebaseAuth.signOut();
    hideLoading();
    
    if (result.success) {
        appState.currentUser = null;
        appState.userProfile = null;
        showAuthContainer();
        showToast('Signed out successfully!');
    } else {
        showToast('Error signing out', 'error');
    }
}

// Profile handlers
async function handleProfileSubmission(e) {
    e.preventDefault();
    
    console.log('Profile submission started');
    console.log('Current user:', appState.currentUser);
    
    const profileData = {
        name: document.getElementById('profile-name').value.trim(),
        age: parseInt(document.getElementById('profile-age').value),
        weight: parseFloat(document.getElementById('profile-weight').value),
        height: parseInt(document.getElementById('profile-height').value),
        fitnessGoal: document.getElementById('fitness-goal').value
    };
    
    console.log('Profile data:', profileData);
    
    // Validation
    if (!profileData.name || !profileData.age || !profileData.weight || !profileData.height || !profileData.fitnessGoal) {
        console.log('Validation failed: missing fields');
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Check if user is authenticated
    if (!appState.currentUser || !appState.currentUser.uid) {
        console.error('No authenticated user found');
        showToast('Authentication error. Please try logging out and back in.', 'error');
        return;
    }
    
    showLoading();
    
    try {
        console.log('Attempting to save profile to Firestore...');
        // Save profile to Firestore
        const profileResult = await firebaseDB.createUserProfile(appState.currentUser.uid, profileData);
        console.log('Profile save result:', profileResult);
        
        if (!profileResult.success) {
            throw new Error(profileResult.error);
        }
        
        console.log('Profile saved successfully, generating diet plan...');
        // Generate diet plan
        showToast('Generating your personalized diet plan...');
        const dietPlanResult = await geminiAPI.generateDietPlan(profileData);
        console.log('Diet plan result:', dietPlanResult);
        
        if (dietPlanResult.success) {
            console.log('Saving diet plan to Firestore...');
            // Save diet plan to Firestore
            const saveDietResult = await firebaseDB.saveDietPlan(appState.currentUser.uid, dietPlanResult.data);
            console.log('Diet plan save result:', saveDietResult);
            
            if (dietPlanResult.fallback) {
                showToast('Profile created! Using fallback diet plan.', 'warning');
            } else {
                showToast('Profile and diet plan created successfully!');
            }
        } else {
            console.log('Diet plan generation failed, but profile was saved');
            showToast('Profile created! Diet plan generation failed, but you can regenerate it later.', 'warning');
        }
        
        console.log('Loading user data...');
        // Load user data and show app
        await loadUserData();
        
    } catch (error) {
        console.error('Error creating profile:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        showToast(`Error creating profile: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const profileData = {
        name: document.getElementById('update-name').value.trim(),
        age: parseInt(document.getElementById('update-age').value),
        weight: parseFloat(document.getElementById('update-weight').value),
        height: parseInt(document.getElementById('update-height').value),
        fitnessGoal: document.getElementById('update-goal').value
    };
    
    // Validation
    if (!profileData.name || !profileData.age || !profileData.weight || !profileData.height || !profileData.fitnessGoal) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    showLoading();
    
    try {
        const result = await firebaseDB.updateUserProfile(appState.currentUser.uid, profileData);
        
        if (result.success) {
            appState.userProfile = { ...appState.userProfile, ...profileData };
            displayProfileInfo();
            showToast('Profile updated successfully!');
            switchSection('dashboard');
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showToast('Error updating profile. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

async function regenerateDietPlan() {
    if (!appState.userProfile) {
        showToast('Profile not found. Please refresh the page.', 'error');
        return;
    }
    
    showLoading();
    showToast('Regenerating your diet plan...');
    
    try {
        const dietPlanResult = await geminiAPI.generateDietPlan(appState.userProfile);
        
        if (dietPlanResult.success) {
            await firebaseDB.updateDietPlan(appState.currentUser.uid, dietPlanResult.data);
            
            // Refresh the display
            const updatedDietPlan = await firebaseDB.getDietPlan(appState.currentUser.uid);
            if (updatedDietPlan.success) {
                displayDietPlan(updatedDietPlan.data);
                displayDietPlanPreview(updatedDietPlan.data);
                
                if (dietPlanResult.fallback) {
                    showToast('Diet plan regenerated using fallback method', 'warning');
                } else {
                    showToast('Diet plan regenerated successfully!');
                }
            }
        } else {
            throw new Error('Failed to generate diet plan');
        }
    } catch (error) {
        console.error('Error regenerating diet plan:', error);
        showToast('Error regenerating diet plan. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Load user data
async function loadUserData() {
    try {
        // Load user profile
        const profileResult = await firebaseDB.getUserProfile(appState.currentUser.uid);
        
        if (profileResult.success) {
            appState.userProfile = profileResult.data;
            
            // Load diet plan
            const dietPlanResult = await firebaseDB.getDietPlan(appState.currentUser.uid);
            
            if (dietPlanResult.success) {
                // User has complete profile and diet plan
                showAppContainer();
                displayUserInfo();
                displayProfileInfo();
                displayDietPlan(dietPlanResult.data);
                displayDietPlanPreview(dietPlanResult.data);
            } else {
                // User has profile but no diet plan - regenerate it
                const newDietPlan = await geminiAPI.generateDietPlan(appState.userProfile);
                if (newDietPlan.success) {
                    await firebaseDB.saveDietPlan(appState.currentUser.uid, newDietPlan.data);
                    showAppContainer();
                    displayUserInfo();
                    displayProfileInfo();
                    displayDietPlan(newDietPlan.data);
                    displayDietPlanPreview(newDietPlan.data);
                }
            }
        } else {
            // User doesn't have a profile yet
            showProfileSetup();
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        showToast('Error loading your data. Please try refreshing.', 'error');
    }
}

// Display functions
function displayUserInfo() {
    if (appState.userProfile && elements.userName) {
        elements.userName.textContent = appState.userProfile.name;
    }
}

function displayProfileInfo() {
    if (!appState.userProfile || !elements.profileInfo) return;
    
    const profile = appState.userProfile;
    const bmi = (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1);
    
    elements.profileInfo.innerHTML = `
        <div class="profile-item">
            <span class="profile-label">Name:</span>
            <span class="profile-value">${profile.name}</span>
        </div>
        <div class="profile-item">
            <span class="profile-label">Age:</span>
            <span class="profile-value">${profile.age} years</span>
        </div>
        <div class="profile-item">
            <span class="profile-label">Weight:</span>
            <span class="profile-value">${profile.weight} kg</span>
        </div>
        <div class="profile-item">
            <span class="profile-label">Height:</span>
            <span class="profile-value">${profile.height} cm</span>
        </div>
        <div class="profile-item">
            <span class="profile-label">BMI:</span>
            <span class="profile-value">${bmi}</span>
        </div>
        <div class="profile-item">
            <span class="profile-label">Goal:</span>
            <span class="profile-value">${profile.fitnessGoal.replace('_', ' ')}</span>
        </div>
    `;
    
    // Populate update form
    if (document.getElementById('update-name')) {
        document.getElementById('update-name').value = profile.name;
        document.getElementById('update-age').value = profile.age;
        document.getElementById('update-weight').value = profile.weight;
        document.getElementById('update-height').value = profile.height;
        document.getElementById('update-goal').value = profile.fitnessGoal;
    }
}

function displayDietPlanPreview(dietPlan) {
    if (!dietPlan || !elements.dietPlanPreview) return;
    
    elements.dietPlanPreview.innerHTML = `
        <div class="nutrition-item">
            <span class="nutrition-label">
                <i class="fas fa-drumstick-bite"></i> Protein:
            </span>
            <span class="nutrition-value">${dietPlan.proteinIntake}</span>
        </div>
        <div class="nutrition-item">
            <span class="nutrition-label">
                <i class="fas fa-bread-slice"></i> Carbs:
            </span>
            <span class="nutrition-value">${dietPlan.carbIntake}</span>
        </div>
        <div class="nutrition-item">
            <span class="nutrition-label">
                <i class="fas fa-tint"></i> Water:
            </span>
            <span class="nutrition-value">${dietPlan.waterIntake}</span>
        </div>
        <div class="nutrition-item">
            <span class="nutrition-label">
                <i class="fas fa-pills"></i> Creatine:
            </span>
            <span class="nutrition-value">${dietPlan.creatineCycle}</span>
        </div>
    `;
}

function displayDietPlan(dietPlan) {
    if (!dietPlan || !elements.dietPlanContainer) return;
    
    const plan = dietPlan.detailedPlan || {};
    
    elements.dietPlanContainer.innerHTML = `
        <div class="diet-section">
            <h3><i class="fas fa-info-circle"></i> Overview</h3>
            <p>${plan.overview || 'Personalized nutrition plan for your fitness goals.'}</p>
        </div>
        
        <div class="diet-section">
            <h3><i class="fas fa-chart-bar"></i> Daily Nutritional Targets</h3>
            <p><strong>Protein:</strong> ${dietPlan.proteinIntake}</p>
            <p><strong>Carbohydrates:</strong> ${dietPlan.carbIntake}</p>
            <p><strong>Water:</strong> ${dietPlan.waterIntake}</p>
            <p><strong>Creatine:</strong> ${dietPlan.creatineCycle}</p>
            <p><strong>Other Nutrients:</strong> ${dietPlan.nutrientIntake}</p>
        </div>
        
        <div class="diet-section">
            <h3><i class="fas fa-sun"></i> Breakfast</h3>
            <p>${plan.breakfast || 'Start your day with a balanced, protein-rich breakfast.'}</p>
        </div>
        
        <div class="diet-section">
            <h3><i class="fas fa-utensils"></i> Lunch</h3>
            <p>${plan.lunch || 'Include lean protein, complex carbs, and vegetables.'}</p>
        </div>
        
        <div class="diet-section">
            <h3><i class="fas fa-moon"></i> Dinner</h3>
            <p>${plan.dinner || 'Light but nutritious evening meal with plenty of vegetables.'}</p>
        </div>
        
        <div class="diet-section">
            <h3><i class="fas fa-cookie-bite"></i> Snacks</h3>
            <p>${plan.snacks || 'Healthy snacks to keep you fueled throughout the day.'}</p>
        </div>
        
        <div class="diet-section">
            <h3><i class="fas fa-pills"></i> Supplements</h3>
            <p>${plan.supplements || 'Consider these supplements based on your goals and diet.'}</p>
        </div>
        
        <div class="diet-section">
            <h3><i class="fas fa-lightbulb"></i> Tips & Recommendations</h3>
            <p>${plan.tips || 'Stay consistent with your nutrition plan and track your progress.'}</p>
        </div>
    `;
}

// UI Management functions
function showAuthContainer() {
    hideAllContainers();
    elements.authContainer.style.display = 'flex';
    elements.navbar.style.display = 'none';
}

function showProfileSetup() {
    hideAllContainers();
    elements.profileSetup.style.display = 'flex';
    elements.navbar.style.display = 'none';
}

function showAppContainer() {
    hideAllContainers();
    elements.appContainer.style.display = 'block';
    elements.navbar.style.display = 'block';
    switchSection('dashboard');
}

function hideAllContainers() {
    elements.authContainer.style.display = 'none';
    elements.profileSetup.style.display = 'none';
    elements.appContainer.style.display = 'none';
}

function showLoginForm() {
    elements.loginForm.style.display = 'block';
    elements.signupForm.style.display = 'none';
}

function showSignupForm() {
    elements.loginForm.style.display = 'none';
    elements.signupForm.style.display = 'block';
}

function switchSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.nav-link[data-section="${sectionName}"]`)?.classList.add('active');
    
    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}-section`)?.classList.add('active');
    
    appState.currentSection = sectionName;
    
    // Close mobile menu if open
    elements.navMenu.classList.remove('active');
}

function toggleMobileMenu() {
    elements.navMenu.classList.toggle('active');
}

function showLoading() {
    elements.loadingSpinner.style.display = 'flex';
}

function hideLoading() {
    elements.loadingSpinner.style.display = 'none';
}

function showToast(message, type = 'success') {
    elements.toastMessage.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 4000);
}

// Export for debugging
window.StayFitApp = {
    appState,
    elements,
    firebaseAuth,
    firebaseDB,
    geminiAPI
};

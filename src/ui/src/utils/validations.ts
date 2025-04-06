/**
 * Simple validation utility for the authentication service
 */

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validates if a value is required
 * @param value The value to validate
 * @param fieldName The name of the field (for error message)
 * @returns Validation result
 */
export const isRequired = (value: any, fieldName: string): ValidationResult => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { 
      isValid: false, 
      message: `${fieldName} is required` 
    };
  }
  return { isValid: true };
};

/**
 * Validates if an email is valid
 * @param email The email to validate
 * @returns Validation result
 */
export const isValidEmail = (email: string): ValidationResult => {
  if (!email) return { isValid: true }; // Skip if empty (handled by required)
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { 
      isValid: false, 
      message: 'Please enter a valid email address' 
    };
  }
  return { isValid: true };
};

/**
 * Validates if a password meets minimum length
 * @param password The password to validate
 * @param minLength Minimum length required
 * @returns Validation result
 */
export const isValidPassword = (password: string, minLength = 6): ValidationResult => {
  if (!password) return { isValid: true }; // Skip if empty (handled by required)
  
  if (password.length < minLength) {
    return { 
      isValid: false, 
      message: `Password must be at least ${minLength} characters long` 
    };
  }
  return { isValid: true };
};

/**
 * Validates if a username meets minimum length
 * @param username The username to validate
 * @param minLength Minimum length required
 * @returns Validation result
 */
export const isValidUsername = (username: string, minLength = 3): ValidationResult => {
  if (!username) return { isValid: true }; // Skip if empty (handled by required)
  
  if (username.length < minLength) {
    return { 
      isValid: false, 
      message: `Username must be at least ${minLength} characters long` 
    };
  }
  return { isValid: true };
};

/**
 * Validates if passwords match
 * @param password The password
 * @param confirmPassword The confirmation password
 * @returns Validation result
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) return { isValid: true }; // Skip if empty (handled by required)
  
  if (password !== confirmPassword) {
    return { 
      isValid: false, 
      message: 'Passwords do not match' 
    };
  }
  return { isValid: true };
};

/**
 * Validates if reCAPTCHA is completed
 * @param token The reCAPTCHA token
 * @returns Validation result
 */
export const isRecaptchaCompleted = (token: string | null): ValidationResult => {
  if (!token) {
    return { 
      isValid: false, 
      message: 'Please complete the reCAPTCHA verification' 
    };
  }
  return { isValid: true };
};

/**
 * Validates login form
 * @param email The email
 * @param password The password
 * @param recaptchaToken The reCAPTCHA token
 * @returns Validation result
 */
export const validateLoginForm = (
  email: string,
  password: string,
  recaptchaToken: string | null
): ValidationResult => {
  // Check if email is required
  const emailRequired = isRequired(email, 'Email');
  if (!emailRequired.isValid) {
    return emailRequired;
  }
  
  // Check if email is valid
  const emailValid = isValidEmail(email);
  if (!emailValid.isValid) {
    return emailValid;
  }
  
  // Check if password is required
  const passwordRequired = isRequired(password, 'Password');
  if (!passwordRequired.isValid) {
    return passwordRequired;
  }
  
  // Check if password is valid
  const passwordValid = isValidPassword(password);
  if (!passwordValid.isValid) {
    return passwordValid;
  }
  
  // Check if reCAPTCHA is completed
  const recaptchaValid = isRecaptchaCompleted(recaptchaToken);
  if (!recaptchaValid.isValid) {
    return recaptchaValid;
  }
  
  return { isValid: true };
};

/**
 * Validates registration form
 * @param username The username
 * @param email The email
 * @param password The password
 * @param confirmPassword The confirmation password
 * @param recaptchaToken The reCAPTCHA token
 * @returns Validation result
 */
export const validateRegistrationForm = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  recaptchaToken: string | null
): ValidationResult => {
  // Check if username is required
  const usernameRequired = isRequired(username, 'Username');
  if (!usernameRequired.isValid) {
    return usernameRequired;
  }
  
  // Check if username is valid
  const usernameValid = isValidUsername(username);
  if (!usernameValid.isValid) {
    return usernameValid;
  }
  
  // Check if email is required
  const emailRequired = isRequired(email, 'Email');
  if (!emailRequired.isValid) {
    return emailRequired;
  }
  
  // Check if email is valid
  const emailValid = isValidEmail(email);
  if (!emailValid.isValid) {
    return emailValid;
  }
  
  // Check if password is required
  const passwordRequired = isRequired(password, 'Password');
  if (!passwordRequired.isValid) {
    return passwordRequired;
  }
  
  // Check if password is valid
  const passwordValid = isValidPassword(password);
  if (!passwordValid.isValid) {
    return passwordValid;
  }
  
  // Check if confirm password is required
  const confirmPasswordRequired = isRequired(confirmPassword, 'Confirm Password');
  if (!confirmPasswordRequired.isValid) {
    return confirmPasswordRequired;
  }
  
  // Check if passwords match
  const passwordsMatch = doPasswordsMatch(password, confirmPassword);
  if (!passwordsMatch.isValid) {
    return passwordsMatch;
  }
  
  // Check if reCAPTCHA is completed
  const recaptchaValid = isRecaptchaCompleted(recaptchaToken);
  if (!recaptchaValid.isValid) {
    return recaptchaValid;
  }
  
  return { isValid: true };
}; 
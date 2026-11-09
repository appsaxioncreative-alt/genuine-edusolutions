export function authError(err) {
  const map = {
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password. Try again or reset it.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
    "auth/popup-closed-by-user": "Google sign-in was closed before finishing.",
    "auth/cancelled-popup-request": "Google sign-in was cancelled.",
    "auth/network-request-failed": "Network problem. Check your connection and try again.",
    "auth/operation-not-allowed": "This sign-in method isn't enabled in Firebase yet.",
    "auth/unauthorized-domain": "This domain isn't authorised in Firebase Authentication settings.",
    "permission-denied": "Firestore rules blocked this action. Publish firestore.rules.",
  };
  return map[err && err.code] || (err && err.message) || "Something went wrong. Please try again.";
}

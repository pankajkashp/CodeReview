/**
 * Maps Supabase authentication errors to user-friendly messages.
 * Prevents exposing raw "Failed to fetch" or cryptic technical errors to normal users.
 */
export function getFriendlyAuthErrorMessage(error) {
  if (!error) return "";

  const message = String(error.message || "").toLowerCase();
  const name = String(error.name || "").toLowerCase();
  const status = error.status;

  // Log in development for diagnosis without exposing technical errors in production UI
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    console.debug("[Auth Error Debug]:", { name: error.name, message: error.message, status: error.status });
  }

  // Network / fetch failure / paused project / waking up
  if (
    name.includes("fetch") ||
    name.includes("network") ||
    name.includes("authretryablefetcherror") ||
    message.includes("failed to fetch") ||
    message.includes("network") ||
    message.includes("connection") ||
    message.includes("econnrefused") ||
    message.includes("fetch failed") ||
    status === 0 ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    return "Unable to connect right now. The authentication service may be waking up. Please try again in a few seconds.";
  }

  // Invalid credentials
  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid credential") ||
    (status === 400 && message.includes("credentials"))
  ) {
    return "Email or password is incorrect.";
  }

  // Email not verified
  if (message.includes("email not confirmed")) {
    return "Your email address is not yet confirmed. Please check your inbox for the verification link.";
  }

  // User already registered
  if (message.includes("user already registered") || message.includes("already exists")) {
    return "An account with this email already exists. Try signing in instead.";
  }

  // Password too short/weak
  if (message.includes("password should be at least")) {
    return "Password is too weak. Please use at least 6 characters.";
  }

  // Rate limiting
  if (
    status === 429 ||
    message.includes("rate limit") ||
    message.includes("too many requests")
  ) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  // Server error
  if (status === 500) {
    return "Authentication is temporarily unavailable. Please try again shortly.";
  }

  // Fallback friendly message
  return "Something went wrong while signing you in. Please try again.";
}

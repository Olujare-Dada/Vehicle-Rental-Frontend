// Authentication utilities for JWT token management
import { API_ENDPOINTS } from './config'

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

// Get JWT token from cookies (client-side only)
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Get token from cookies
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'token') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// Set JWT token in cookies
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  // Set cookie with secure options
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Strict`;
}

// Remove JWT token from cookies
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  
  // Remove cookie by setting it to expire in the past
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

// API call to verify token with backend
export async function verifyTokenWithBackend(token: string): Promise<{ valid: boolean; user?: User }> {
  try {
    const response = await fetch(API_ENDPOINTS.verifyToken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return { valid: true, user: data.user };
    } else {
      return { valid: false };
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return { valid: false };
  }
}

// Check if user is authenticated (backend validation)
export async function isAuthenticated(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  
  const result = await verifyTokenWithBackend(token);
  return result.valid;
}

// Get current user (backend validation)
export async function getCurrentUser(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;
  
  const result = await verifyTokenWithBackend(token);
  return result.user || null;
}

// Logout user
export async function logout(): Promise<void> {
  try {
    const token = getToken();
    if (token) {
      // Call backend logout endpoint
      const response = await fetch(API_ENDPOINTS.logout, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: getCurrentUserFromToken(token)?.username || 'unknown',
          logoutReason: 'user_initiated',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        console.log('Backend logout successful');
      } else {
        console.warn('Backend logout failed, but proceeding with frontend cleanup');
      }
    }
  } catch (error) {
    console.error('Error during backend logout:', error);
    // Continue with frontend cleanup even if backend fails
  } finally {
    // Always clean up frontend state
    removeToken();
    
    // Redirect to signin page
    if (typeof window !== 'undefined') {
      window.location.href = '/signin';
    }
  }
}

// Helper function to extract user info from JWT token (for logout)
function getCurrentUserFromToken(token: string): { username: string } | null {
  try {
    // Decode JWT payload (base64 part)
    const payload = token.split('.')[1];
    if (payload) {
      const decoded = JSON.parse(atob(payload));
      return { username: decoded.sub || 'unknown' };
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }
  return null;
} 
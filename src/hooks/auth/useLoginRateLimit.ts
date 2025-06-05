
import { useState, useEffect } from 'react';

interface RateLimitState {
  attempts: number;
  lockoutUntil: Date | null;
  isLocked: boolean;
  remainingTime: number;
}

export const useLoginRateLimit = (maxAttempts = 5, lockoutDuration = 15 * 60 * 1000) => {
  const [state, setState] = useState<RateLimitState>({
    attempts: 0,
    lockoutUntil: null,
    isLocked: false,
    remainingTime: 0
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('loginRateLimit');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const lockoutUntil = parsed.lockoutUntil ? new Date(parsed.lockoutUntil) : null;
        const isLocked = lockoutUntil ? new Date() < lockoutUntil : false;
        
        setState({
          attempts: parsed.attempts || 0,
          lockoutUntil,
          isLocked,
          remainingTime: isLocked && lockoutUntil ? 
            Math.ceil((lockoutUntil.getTime() - new Date().getTime()) / 1000 / 60) : 0
        });
      } catch (error) {
        // Reset on parse error
        localStorage.removeItem('loginRateLimit');
      }
    }
  }, []);

  // Update remaining time every minute when locked
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.isLocked && state.lockoutUntil) {
      interval = setInterval(() => {
        const now = new Date();
        if (now >= state.lockoutUntil!) {
          // Unlock
          setState(prev => ({ ...prev, isLocked: false, remainingTime: 0 }));
          localStorage.removeItem('loginRateLimit');
        } else {
          const remaining = Math.ceil((state.lockoutUntil!.getTime() - now.getTime()) / 1000 / 60);
          setState(prev => ({ ...prev, remainingTime: remaining }));
        }
      }, 60000); // Check every minute
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isLocked, state.lockoutUntil]);

  const recordFailedAttempt = () => {
    const newAttempts = state.attempts + 1;
    
    if (newAttempts >= maxAttempts) {
      const lockoutUntil = new Date(Date.now() + lockoutDuration);
      const newState = {
        attempts: newAttempts,
        lockoutUntil,
        isLocked: true,
        remainingTime: Math.ceil(lockoutDuration / 1000 / 60)
      };
      
      setState(newState);
      localStorage.setItem('loginRateLimit', JSON.stringify({
        attempts: newAttempts,
        lockoutUntil: lockoutUntil.toISOString()
      }));
    } else {
      const newState = { ...state, attempts: newAttempts };
      setState(newState);
      localStorage.setItem('loginRateLimit', JSON.stringify({
        attempts: newAttempts,
        lockoutUntil: null
      }));
    }
  };

  const resetAttempts = () => {
    setState({
      attempts: 0,
      lockoutUntil: null,
      isLocked: false,
      remainingTime: 0
    });
    localStorage.removeItem('loginRateLimit');
  };

  return {
    isLocked: state.isLocked,
    attempts: state.attempts,
    remainingTime: state.remainingTime,
    recordFailedAttempt,
    resetAttempts,
    maxAttempts
  };
};

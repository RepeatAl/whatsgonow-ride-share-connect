
import React from 'react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const DebugAuth = () => {
  const { user, session, profile, loading, refreshProfile } = useOptimizedAuth();

  const testRegistration = async () => {
    const testEmail = `test${Date.now()}@example.com`;
    console.log("🧪 Testing registration with:", testEmail);
    
    try {
      const response = await fetch('/api/test-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'TestPassword123!',
          first_name: 'Test',
          last_name: 'User'
        })
      });
      
      const result = await response.json();
      console.log("🧪 Test registration result:", result);
    } catch (error) {
      console.error("🧪 Test registration failed:", error);
    }
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Auth Debug Info (OptimizedAuth)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Loading:</strong> {loading ? "Yes" : "No"}
        </div>
        <div>
          <strong>User:</strong> {user ? user.email : "None"}
        </div>
        <div>
          <strong>Session:</strong> {session ? "Active" : "None"}
        </div>
        <div>
          <strong>Profile:</strong> {profile ? `${profile.first_name} ${profile.last_name} (${profile.role})` : "None"}
        </div>
        <div>
          <strong>Profile Table:</strong> profiles ✅ (users table removed)
        </div>
        <div>
          <strong>User ID:</strong> {user?.id || "None"}
        </div>
        <div>
          <strong>Profile Complete:</strong> {profile?.profile_complete ? "Yes" : "No"}
        </div>
        <div>
          <strong>Email Verified:</strong> {user?.email_confirmed_at ? "Yes" : "No"}
        </div>
        
        <div className="flex gap-2">
          <Button onClick={refreshProfile} disabled={!user}>
            Refresh Profile
          </Button>
          <Button onClick={testRegistration} variant="outline">
            Test Registration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

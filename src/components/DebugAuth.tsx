
import React from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const DebugAuth = () => {
  const { user, session, profile, loading, refreshProfile } = useSimpleAuth();

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
        <CardTitle>Auth Debug Info</CardTitle>
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
          <strong>Profile:</strong> {profile ? `${profile.first_name} ${profile.last_name}` : "None"}
        </div>
        <div className="space-x-2">
          <Button onClick={refreshProfile} variant="outline">
            Refresh Profile
          </Button>
          <Button onClick={testRegistration} variant="outline">
            Test Registration
          </Button>
        </div>
        <div className="text-xs bg-gray-100 p-2 rounded">
          <strong>Raw Data:</strong>
          <pre>{JSON.stringify({ user: user?.id, profile: profile?.user_id }, null, 2)}</pre>
        </div>
      </CardContent>
    </Card>
  );
};

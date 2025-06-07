
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeletedFile {
  path: string;
  success: boolean;
  error?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting guest uploads cleanup...');

    // Find expired sessions
    const { data: expiredSessions, error: sessionError } = await supabase
      .from('guest_upload_sessions')
      .select('session_id')
      .lt('expires_at', new Date().toISOString())
      .is('migrated_to_user_id', null);

    if (sessionError) {
      console.error('Error fetching expired sessions:', sessionError);
      throw sessionError;
    }

    if (!expiredSessions || expiredSessions.length === 0) {
      console.log('No expired sessions found');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No expired sessions to clean up',
          deletedFiles: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    console.log(`Found ${expiredSessions.length} expired sessions`);
    
    let totalDeletedFiles = 0;
    const deletionResults: DeletedFile[] = [];

    // Process each expired session
    for (const session of expiredSessions) {
      const sessionId = session.session_id;
      
      try {
        // List files in this session folder
        const { data: files, error: listError } = await supabase.storage
          .from('guest-uploads')
          .list(sessionId);

        if (listError) {
          console.error(`Error listing files for session ${sessionId}:`, listError);
          continue;
        }

        if (!files || files.length === 0) {
          console.log(`No files found for session ${sessionId}`);
          continue;
        }

        // Delete all files in the session folder
        const filePaths = files.map(file => `${sessionId}/${file.name}`);
        
        const { data: deleteData, error: deleteError } = await supabase.storage
          .from('guest-uploads')
          .remove(filePaths);

        if (deleteError) {
          console.error(`Error deleting files for session ${sessionId}:`, deleteError);
          filePaths.forEach(path => {
            deletionResults.push({
              path,
              success: false,
              error: deleteError.message
            });
          });
        } else {
          console.log(`Deleted ${filePaths.length} files for session ${sessionId}`);
          totalDeletedFiles += filePaths.length;
          
          filePaths.forEach(path => {
            deletionResults.push({
              path,
              success: true
            });
          });
        }

        // Mark session as cleaned up
        await supabase
          .from('guest_upload_sessions')
          .delete()
          .eq('session_id', sessionId);

      } catch (error) {
        console.error(`Error processing session ${sessionId}:`, error);
      }
    }

    console.log(`Cleanup completed. Deleted ${totalDeletedFiles} files from ${expiredSessions.length} sessions`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Cleanup completed successfully`,
        expiredSessions: expiredSessions.length,
        deletedFiles: totalDeletedFiles,
        details: deletionResults
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Cleanup function error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

window.APP_CONFIG = {
  supabaseUrl: 'https://sxyxkabkwpbmgtonridu.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4eXhrYWJrd3BibWd0b25yaWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjI4NjgsImV4cCI6MjA4ODczODg2OH0.qsXZjh_Oga46lPTImR_bal0ZepCKBMR-BprWXfg9Q7Q',
  supabaseBucket: 'trip-docs',
  allowedEmails: [
    'noemiparadagirona@gmail.com',
    'borregorafa99@gmail.com'
  ]
};

window.supabaseReady = import('https://esm.sh/@supabase/supabase-js@2')
  .then(({ createClient }) => {
    const client = createClient(
      window.APP_CONFIG.supabaseUrl,
      window.APP_CONFIG.supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );

    window.supabaseClient = client;
    window.dispatchEvent(new Event('supabase-ready'));
    return client;
  })
  .catch((error) => {
    window.supabaseClientError = error;
    window.dispatchEvent(new CustomEvent('supabase-ready-error', { detail: error }));
    throw error;
  });

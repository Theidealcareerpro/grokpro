const { createClient } = require('@supabase/supabase-js');
const resend = require('resend');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey || !resendApiKey) {
  throw new Error('Missing environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const resendClient = new resend.Resend(resendApiKey);

async function cleanupExpiredPortfolios() {
  const now = new Date().toISOString();
  const { data: expiredPortfolios, error } = await supabase
    .from('portfolios')
    .select('fingerprint, github_repo, donation_status')
    .lt('expiry', now);

  if (error) {
    console.error('Supabase error:', error.message);
    return;
  }

  if (!expiredPortfolios || expiredPortfolios.length === 0) {
    console.log('No expired portfolios found.');
    return;
  }

  for (const portfolio of expiredPortfolios) {
    // Option 1: Delete the portfolio
    const { error: deleteError } = await supabase
      .from('portfolios')
      .delete()
      .eq('fingerprint', portfolio.fingerprint);
    if (deleteError) {
      console.error(`Failed to delete portfolio ${portfolio.fingerprint}:`, deleteError.message);
      continue;
    }

    // Option 2: Archive instead of delete (uncomment and adjust table if needed)
    // await supabase
    //   .from('archived_portfolios')
    //   .insert({ ...portfolio, archived_at: now });

    // Notify user via email (optional)
    await resendClient.emails.send({
      from: 'noreply@yourdomain.com',
      to: 'user-email@example.com', // Replace with dynamic email if available
      subject: 'Your Portfolio Has Expired',
      html: `<p>Your portfolio (${portfolio.github_repo}) has expired. Total donations: $${portfolio.donation_status.amount}</p>`,
    }).catch(err => console.error('Email error:', err));
  }

  console.log(`Cleaned up ${expiredPortfolios.length} expired portfolios.`);
}

cleanupExpiredPortfolios().catch(console.error);
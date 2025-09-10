const { createClient } = require('@supabase/supabase-js');
const Resend = require('@resend/resend');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

async function cleanupPortfolios() {
  const now = new Date().toISOString();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  // Fetch portfolios nearing expiry (within 3 days) or expired
  const { data, error } = await supabase
    .from('portfolios')
    .select('fingerprint, username, expiry')
    .lte('expiry', threeDaysFromNow.toISOString());

  if (error) {
    console.error('Error fetching portfolios:', error);
    return;
  }

  for (const portfolio of data) {
    if (new Date(portfolio.expiry) <= new Date()) {
      // Delete expired portfolio
      await supabase
        .from('portfolios')
        .delete()
        .eq('fingerprint', portfolio.fingerprint);
      console.log(`Deleted expired portfolio for ${portfolio.username || portfolio.fingerprint}`);
    } else if (new Date(portfolio.expiry) <= threeDaysFromNow) {
      // Send warning email
      await resend.emails.send({
        from: 'no-reply@theidealprogen.com',
        to: 'user@example.com', // Replace with dynamic email if available (future enhancement)
        subject: 'Portfolio Expiry Warning',
        text: `Hi ${portfolio.username || 'User'},\nYour portfolio will expire on ${portfolio.expiry}. Donate $5 at https://www.buymeacoffee.com/theidealprogen to extend it by 30 days.`
      });
      console.log(`Sent warning email to ${portfolio.username || portfolio.fingerprint}`);
    }
  }
}

cleanupPortfolios().catch(console.error);
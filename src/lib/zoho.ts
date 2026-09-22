export async function createZohoInvoice(orgId: string, amount: number, ) {
  // In a full implementation, this uses ZOHO_CLIENT_ID and ZOHO_REFRESH_TOKEN 
  // to get an access token and hits https://invoice.zoho.in/api/v3/invoices
  console.log(`[Zoho Mock] Created invoice for ${orgId} for amount ${amount}`);
  return { success: true, invoiceId: 'inv_mock_123' };
}

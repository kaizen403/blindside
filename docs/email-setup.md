# Blindwall email setup

## Current Azure resources

Created in subscription `483887af-58ba-4879-bf78-4c291fbc9240`:

- Resource group: `rg-blindwall-mail` (`southindia`)
- Email Communication Service: `blindwall-email`
- Custom email domain: `blindwall.app`
- Communication Service: `blindwall-comm`
- Sender username: `reports` / display name `Blindwall`
- User engagement tracking: `Enabled` for opens and clicks

The custom domain is not linked yet because Azure requires DNS verification first.

## DNS records to add for Azure outbound mail

Add these records in the DNS zone for `blindwall.app`.

| Purpose | Type | Host / Name | Value | TTL |
| --- | --- | --- | --- | --- |
| Azure domain verification | TXT | `@` or `blindwall.app` | `ms-domain-verification=da635b13-b3b5-4a09-92aa-9f7a26679b23` | `3600` |
| SPF for Azure outbound | TXT | `@` or `blindwall.app` | `v=spf1 include:spf.protection.outlook.com -all` | `3600` |
| DKIM 1 | CNAME | `selector1-azurecomm-prod-net._domainkey` | `selector1-azurecomm-prod-net._domainkey.azurecomm.net` | `3600` |
| DKIM 2 | CNAME | `selector2-azurecomm-prod-net._domainkey` | `selector2-azurecomm-prod-net._domainkey.azurecomm.net` | `3600` |
| DMARC | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@blindwall.app; fo=1` | `3600` |

### Important SPF note with Zoho

DNS must have **only one SPF TXT record** at the root. If Zoho asks you to add its own SPF, merge it with Azure instead of creating a second SPF.

Example if Zoho gives `include:zoho.in`:

```txt
v=spf1 include:spf.protection.outlook.com include:zoho.in -all
```

Zoho's exact include depends on the Zoho region/account, so use Zoho's generated value.

## Incoming mail to Zoho

For inbound, add the MX records Zoho gives you during setup. Do not guess these blindly because they differ by Zoho region.

Typical Zoho examples are shaped like:

```txt
@ MX 10 mx.zoho.in
@ MX 20 mx2.zoho.in
@ MX 50 mx3.zoho.in
```

Use the exact records from your Zoho admin console.

## After DNS is added

Run these Azure verification commands:

```bash
az communication email domain initiate-verification \
  -g rg-blindwall-mail \
  --email-service-name blindwall-email \
  --domain-name blindwall.app \
  --verification-type Domain

az communication email domain initiate-verification -g rg-blindwall-mail --email-service-name blindwall-email --domain-name blindwall.app --verification-type SPF
az communication email domain initiate-verification -g rg-blindwall-mail --email-service-name blindwall-email --domain-name blindwall.app --verification-type DKIM
az communication email domain initiate-verification -g rg-blindwall-mail --email-service-name blindwall-email --domain-name blindwall.app --verification-type DKIM2
az communication email domain initiate-verification -g rg-blindwall-mail --email-service-name blindwall-email --domain-name blindwall.app --verification-type DMARC
```

Then link the verified domain to the Communication Service:

```bash
DOMAIN_ID=$(az communication email domain show \
  -g rg-blindwall-mail \
  --email-service-name blindwall-email \
  -n blindwall.app \
  --query id -o tsv)

az communication update \
  -g rg-blindwall-mail \
  -n blindwall-comm \
  --linked-domains "$DOMAIN_ID"
```

## App environment variables

GitHub Actions secrets have been set for:

- `AZURE_COMMUNICATION_CONNECTION_STRING`
- `EMAIL_FROM`
- `EMAIL_REPLY_TO`

Add the same values in the actual hosting provider as runtime env vars:

```env
AZURE_COMMUNICATION_CONNECTION_STRING="endpoint=https://...;accesskey=..."
EMAIL_FROM="Blindwall <reports@blindwall.app>"
EMAIL_REPLY_TO="hello@blindwall.app"
```

## Analytics

Implemented in app code:

- Outbound send result logging (`SENT`, `SEND_FAILED`) in Prisma `MailEvent`
- Event Grid webhook endpoint: `/api/webhooks/azure-email`
- Webhook accepts Azure Event Grid subscription validation
- Webhook stores delivery/open/click events into `MailEvent`

After the app is publicly deployed, create the Event Grid subscription:

```bash
COMM_ID="/subscriptions/483887af-58ba-4879-bf78-4c291fbc9240/resourceGroups/rg-blindwall-mail/providers/Microsoft.Communication/communicationServices/blindwall-comm"
WEBHOOK="https://blindwall.app/api/webhooks/azure-email"

az eventgrid event-subscription create \
  --name blindwall-email-events \
  --source-resource-id "$COMM_ID" \
  --endpoint "$WEBHOOK" \
  --endpoint-type webhook \
  --event-delivery-schema eventgridschema \
  --included-event-types \
    Microsoft.Communication.EmailDeliveryReportReceived \
    Microsoft.Communication.EmailEngagementTrackingReportReceived
```

Reply-rate tracking requires Zoho access because replies land in Zoho. Options:

1. Poll Zoho/IMAP and match inbound messages by sender/thread.
2. Use Zoho API/webhooks if enabled on your Zoho plan.
3. Add unique reply aliases per campaign, then count messages received by alias.

## Pricing estimate

Azure Retail Prices API values observed:

- Sent email: `$0.00025` per email
- Data transferred: `$0.00012` per MB

Examples, ignoring tiny transfer cost for normal HTML emails:

| Volume | Emails/week | Approx weekly send cost | Approx monthly send cost |
| --- | ---: | ---: | ---: |
| 100/day × 5 days | 500 | `$0.12` | `$0.54` |
| 500/day × 5 days | 2,500 | `$0.62` | `$2.71` |
| 1,000/day × 5 days | 5,000 | `$1.25` | `$5.41` |
| 2,000/day × 5 days | 10,000 | `$2.50` | `$10.82` |
| 5,000/day × 5 days | 25,000 | `$6.25` | `$27.06` |

Default Azure Communication Services Email send throttles observed in Microsoft docs:

- Send Email: 5 requests/second per subscription
- Send Email: 10 requests/minute per subscription
- Max recipients per email request: 50
- Max email request size including attachments: 10 MB

For cold outbound/campaign sending, warm up slowly even if cost is low; deliverability will be the real constraint, not Azure price.

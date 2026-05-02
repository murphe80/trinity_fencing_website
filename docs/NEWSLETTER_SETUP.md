# Newsletter Setup (Mailchimp)

> You do not need to understand the website code to follow these instructions for managing newsletter campaigns. However, adding the signup form embed to the website for the first time (or replacing it if it changes) does require editing one line of code — a developer or AI agent can do this in under 5 minutes.

---

## How the Newsletter Works

The newsletter signup form on the `/friends` page is an **embedded Mailchimp form**. When a visitor submits their email, it is added directly to the Mailchimp audience list — no other setup needed. Sending newsletter campaigns is done entirely within Mailchimp.

---

## Getting the Mailchimp Embed Code (One-Time Setup)

1. Log in to [mailchimp.com](https://mailchimp.com) with the club account
2. Go to **Audience → Signup Forms → Embedded Forms**
3. Select **"Unstyled"** form type
4. Copy the HTML embed code shown on the page
5. Send the code to a developer or AI agent with this instruction:

> "Replace the Mailchimp placeholder comment in `/app/friends/page.tsx` with this embed code."

The placeholder is clearly marked in the code:
```
{/*
  MAILCHIMP EMBED CODE GOES HERE
  ...
*/}
```

The form will automatically be styled to match the DUFC design system — no additional work needed.

---

## If the Mailchimp Form URL Changes

This can happen if:
- A new Mailchimp audience is created
- The account is transferred to a new club captain

In this case, follow the same steps above to get a new embed code and ask a developer or AI agent to update the file.

---

## Sending Newsletter Campaigns

This happens entirely within Mailchimp and does not affect the website:

1. Log in to [mailchimp.com](https://mailchimp.com)
2. Go to **Campaigns → Create Campaign**
3. Choose your audience (the DUFC mailing list)
4. Write your email using the Mailchimp editor
5. Send or schedule

New subscribers who sign up through the website form are automatically added to the Mailchimp audience and will receive future campaigns.

# Debug Campaign Creation Error - 500 Internal Server Error

## Current Situation
- **URL**: http://localhost:3000/api/admin/sms/campaigns
- **Method**: POST
- **Status**: 500 Internal Server Error

## Steps to Find the Exact Error:

### 1. Check Server Console (Terminal where you ran `npm run dev`)
Look for lines starting with `[SMS Campaign]`:
```
[SMS Campaign] Creating campaign with data: { ... }
[SMS Campaign] Error creating SMS campaign: Error: ...
[SMS Campaign] Error details: <SPECIFIC ERROR MESSAGE>
[SMS Campaign] Error stack: <FULL STACK TRACE>
```

### 2. Check Browser Console (Press F12, go to Console tab)
Look for:
```
[Campaign Creation] Error: { ... }
```

### 3. Check Network Tab (Press F12, go to Network tab)
- Click on the `campaigns` request
- Go to "Response" tab to see the error message
- Go to "Payload" tab to see what data was sent

## Common Issues & Quick Fixes:

### Most Likely: Missing `selectedStates` or `selectedStatuses`
**Error**: `null value in column "selected_states" violates not-null constraint`

**Cause**: These fields are required in the database but might be null/undefined

**Already Fixed**: My code now ensures they're always arrays

### Check if Server Restarted
Did you restart the dev server after I made the changes?
- Press Ctrl+C in the terminal
- Run `npm run dev` again

## What to Send Me:
Please copy and paste the error message from any of these sources:
1. Server console logs (the `[SMS Campaign] Error details:` line)
2. Browser console error
3. Network tab Response

This will tell me exactly what's wrong!


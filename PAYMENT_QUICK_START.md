# 🚀 Payment System - Quick Start Guide

**Ready to test in 5 minutes!**

---

## ✅ Prerequisites

- ✅ Servers running (Backend: 3001, Frontend: 5173)
- ✅ MongoDB connected
- ✅ Test accounts ready

---

## 🎯 Quick Test (5 Minutes)

### Step 1: Customer Login (30 seconds)
```
1. Go to: http://localhost:5173/login
2. Email: rajesh@example.com
3. Password: user123
4. Click "Login"
```

### Step 2: Add Products (1 minute)
```
1. Go to: http://localhost:5173/paints
2. Click any product
3. Click "Add to Cart"
4. Add 2-3 more products
5. Click cart icon (top right)
```

### Step 3: Checkout (1 minute)
```
1. Review cart items
2. Click "Proceed to Address"
3. If no address:
   - Click "+ Add New Address"
   - Fill all fields:
     * Label: Home
     * Name: Rajesh Kumar
     * Phone: 9876543210
     * Address: 123 Main Street
     * City: Pune
     * State: Maharashtra
     * Pincode: 411001
   - Click "Save Address"
4. Select the address
5. Click "Proceed to Payment"
```

### Step 4: Payment Method (30 seconds)
```
1. Select "Online Payment"
2. Click "Place Order"
3. Wait for redirect...
```

### Step 5: QR Code Payment (1 minute)
```
✨ YOU'RE NOW ON THE PAYMENT PAGE! ✨

1. See the QR code displayed
2. See payment details:
   - Payment Number: PAY...
   - Amount: ₹...
   - UPI ID: mayurpaints@upi

3. Scan QR with your phone:
   - Open Google Pay / PhonePe / Paytm
   - Scan the QR code
   - Amount will be shown
   - (For testing, just take a screenshot of any payment)

4. Click "I've Made the Payment"
```

### Step 6: Upload Screenshot (1 minute)
```
1. Click "Upload" area
2. Select any image file (payment screenshot)
3. See preview
4. Click "Submit for Verification"
5. See success message!
```

### Step 7: Admin Verification (1 minute)
```
1. Open new tab: http://localhost:5173/login
2. Logout if needed
3. Login as admin:
   - Email: admin@mayurpaints.com
   - Password: admin123
4. Go to: http://localhost:5173/admin/payments
5. See your payment in "Pending" tab
6. Click on screenshot to enlarge
7. Click "Verify Payment" (green button)
8. Confirm
9. ✅ Payment Verified!
```

### Step 8: Check Results (30 seconds)
```
1. Go back to customer tab
2. Go to Dashboard
3. See order status: "Confirmed"
4. See payment status: "Verified"
5. 🎉 Success!
```

---

## 🧪 Test Rejection Flow

### Reject a Payment
```
1. Login as admin
2. Go to /admin/payments
3. Find a pending payment
4. Click "Reject Payment" (red button)
5. Enter reason: "Screenshot is unclear"
6. Click "Reject Payment"
7. ✅ Payment Rejected!
```

### Check Customer Side
```
1. Login as customer
2. Go to Dashboard
3. See order status: "Cancelled"
4. See rejection message:
   "Your booking has been cancelled due to: Screenshot is unclear"
```

---

## 📱 Test on Mobile

### Scan Real QR Code
```
1. Complete checkout on desktop
2. QR code displayed
3. Open UPI app on phone
4. Scan QR code
5. See amount on phone
6. See merchant: Mayur Paints
7. (Don't actually pay for testing)
8. Take screenshot of payment screen
9. Upload on desktop
```

---

## 🎨 What You'll See

### Payment Page
```
┌─────────────────────────────────┐
│     Scan QR Code to Pay         │
│  Payment Number: PAY12345678    │
├─────────────────────────────────┤
│                                 │
│         [QR CODE IMAGE]         │
│                                 │
│   Scan to pay with any UPI app  │
│                                 │
│   🏦 Mayur Paints               │
│   UPI ID: mayurpaints@upi       │
│   Amount: ₹5,000                │
│                                 │
├─────────────────────────────────┤
│  📋 Payment Instructions        │
│  1. Open any UPI app            │
│  2. Scan the QR code            │
│  3. Verify amount               │
│  4. Complete payment            │
│  5. Take screenshot             │
├─────────────────────────────────┤
│  [I've Made the Payment]        │
└─────────────────────────────────┘
```

### Admin Dashboard
```
┌─────────────────────────────────┐
│   Payment Verification          │
│   [Pending (3)] [All Payments]  │
├─────────────────────────────────┤
│  PAY12345678    🟡 Submitted    │
│  ₹5,000                         │
│                                 │
│  Customer: Rajesh Kumar         │
│  Phone: 9876543210              │
│                                 │
│  [Payment Screenshot]           │
│  [Click to enlarge]             │
│                                 │
│  [✓ Verify] [✗ Reject]          │
└─────────────────────────────────┘
```

---

## 🔍 Troubleshooting

### QR Code Not Showing
```
Problem: Blank QR code area
Solution: 
- Check console for errors
- Verify order was created
- Check shipping address is complete
```

### Can't Upload Screenshot
```
Problem: Upload button not working
Solution:
- Check file size (max 5MB)
- Check file type (JPG, PNG, GIF only)
- Try different image
```

### Payment Not in Admin Dashboard
```
Problem: Payment not visible
Solution:
- Refresh page
- Check "Pending" tab
- Verify payment was submitted
- Check admin is logged in
```

### Address Error
```
Problem: "Please provide shipping address"
Solution:
- Go back to cart
- Add complete address
- All fields required:
  * Name, Phone, Address, City, State, Pincode
```

---

## 📊 Test Scenarios

### Scenario 1: Happy Path ✅
```
Customer → Add to cart → Checkout → Address → 
Online payment → QR code → Upload screenshot → 
Admin verifies → Order confirmed
```

### Scenario 2: Rejection Path ❌
```
Customer → Checkout → QR code → Upload screenshot → 
Admin rejects → Order cancelled → Customer sees reason
```

### Scenario 3: COD Path 💵
```
Customer → Checkout → Address → COD payment → 
Place order → Order confirmed (no QR needed)
```

### Scenario 4: Missing Address ⚠️
```
Customer → Checkout → No address → 
Try to pay → Error → Redirect to address form
```

---

## 🎯 Success Criteria

### ✅ Payment System Working If:
1. QR code generates successfully
2. QR code is scannable
3. Amount shows on phone
4. Screenshot uploads successfully
5. Admin can see payment
6. Admin can verify payment
7. Admin can reject payment
8. Order status updates correctly
9. Customer sees status changes
10. Rejection reason displays

---

## 📞 Quick Commands

### Check Server Status
```bash
# Backend
curl http://localhost:3001/api/health

# Should return:
{"status":"ok","db":"connected","timestamp":"..."}
```

### Check Payment API
```bash
# Get pending payments (admin)
curl http://localhost:3001/api/payments/admin/pending \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### View Logs
```bash
# Backend logs
# Check terminal running: npm run dev (in server folder)

# Frontend logs
# Check browser console (F12)
```

---

## 🎊 You're Ready!

**Everything is set up and ready to test!**

Start with the 5-minute quick test above, then try different scenarios.

**Test URL**: http://localhost:5173

**Have fun testing!** 🎨💳✨


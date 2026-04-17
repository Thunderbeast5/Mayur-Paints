# Debug: User Orders Not Showing

## Issue
User orders are not visible in the profile/dashboard.

## Root Cause Analysis

### Backend (server/routes/orders.js)
```javascript
router.get('/', authenticateToken, async (req, res) => {
  let query = {}
  
  // Regular users can only see their own orders
  if (req.user.role !== 'admin') {
    query.user = req.user._id  // ← Uses JWT token to get user ID
  }
  
  const orders = await Order.find(query)
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
  
  res.json({ success: true, count: orders.length, data: orders })
})
```

**Key Points**:
- Backend uses `req.user._id` from JWT token
- Does NOT use query parameters
- Filters orders by authenticated user automatically

### Frontend (src/pages/UserDashboard.jsx)
```javascript
async function loadOrders() {
  setLoading(true)
  try {
    const data = await ordersAPI.getAll()  // ← Now correct (no userId param)
    console.log('Orders loaded:', data)
    setOrders(Array.isArray(data) ? data : [])
  } catch (error) {
    console.error('Failed to load orders:', error)
    setOrders([])
  }
  setLoading(false)
}
```

### API Layer (src/api.js)
```javascript
export const ordersAPI = {
  getAll: async (userId) => {
    const res = await apiFetch(`/orders${userId ? '?userId=' + userId : ''}`)
    return unwrap(res)
  }
}
```

**Issue**: The `userId` parameter is ignored by backend!

## Possible Causes

1. **JWT Token Not Being Sent**
   - Check if `localStorage.getItem('mp_token')` exists
   - Check if Authorization header is being sent

2. **User Not Logged In**
   - Check if `currentUser` exists
   - Check if token is valid

3. **No Orders in Database**
   - User hasn't placed any orders yet
   - Orders were created with different user ID

4. **Order Model User Field Mismatch**
   - Orders might have `user` field as string instead of ObjectId
   - Orders might have different user ID format

## Debugging Steps

### 1. Check if user is logged in
```javascript
console.log('Current user:', currentUser)
console.log('Token:', localStorage.getItem('mp_token'))
```

### 2. Check API request
```javascript
// In loadOrders()
console.log('Fetching orders...')
const data = await ordersAPI.getAll()
console.log('Orders response:', data)
```

### 3. Check backend logs
Look for:
```
GET /api/orders 200 XX ms
```

### 4. Check database
```javascript
// In MongoDB
db.orders.find({ user: ObjectId("USER_ID_HERE") })
```

## Solution Applied

1. ✅ Removed `userId` parameter from `loadOrders()` call
2. ✅ Added console logging for debugging
3. ✅ Backend already correctly uses JWT token

## Next Steps

1. Test with a logged-in user
2. Place a test order
3. Check if order appears in dashboard
4. Check browser console for errors
5. Check network tab for API response

# MongoDB Compass Guide - Mayur Paints

## Connection Details

**Connection String**: `mongodb://127.0.0.1:27017`

**Database Name**: `mayurpaints`

## Collections Overview

### 1. 👤 users
**Documents**: 3 (1 admin + 2 customers)

**Fields**:
- `_id` - ObjectId (auto-generated)
- `name` - String (user's full name)
- `email` - String (unique, lowercase)
- `password` - String (bcrypt hashed)
- `phone` - String (phone number)
- `role` - String (enum: "user" or "admin")
- `createdAt` - Date
- `updatedAt` - Date

**Sample Query**:
```javascript
// Find all admins
{ role: "admin" }

// Find user by email
{ email: "admin@mayurpaints.com" }
```

---

### 2. 🎨 paints
**Documents**: 15 paint products

**Fields**:
- `_id` - ObjectId
- `name` - String (product name)
- `brand` - String (Asian Paints, Berger, Nerolac)
- `color` - String (color name)
- `hexCode` - String (hex color code, e.g., "#F8F8F8")
- `finish` - String (enum: "matte", "glossy", "satin", "eggshell")
- `size` - String (e.g., "4L", "10L", "20L")
- `price` - Number (in INR)
- `stock` - Number (available quantity)
- `category` - String (enum: "Interior", "Exterior", "Wood", "Metal")
- `description` - String
- `image` - String (URL)
- `createdAt` - Date
- `updatedAt` - Date

**Sample Queries**:
```javascript
// Find all interior paints
{ category: "Interior" }

// Find paints under ₹2000
{ price: { $lt: 2000 } }

// Find matte finish paints
{ finish: "matte" }

// Find Asian Paints products
{ brand: "Asian Paints" }

// Find low stock items (less than 30)
{ stock: { $lt: 30 } }
```

---

### 3. 🔧 hardwares
**Documents**: 10 hardware products

**Fields**:
- `_id` - ObjectId
- `name` - String (product name)
- `brand` - String (Asian Paints, Berger, Nerolac)
- `category` - String (enum: "Brushes", "Rollers", "Tape", "Tools", "Accessories")
- `price` - Number (in INR)
- `stock` - Number (available quantity)
- `description` - String
- `image` - String (URL)
- `createdAt` - Date
- `updatedAt` - Date

**Sample Queries**:
```javascript
// Find all brushes
{ category: "Brushes" }

// Find hardware under ₹300
{ price: { $lt: 300 } }

// Find items with stock > 100
{ stock: { $gt: 100 } }
```

---

### 4. 📦 orders
**Documents**: 10 sample orders

**Fields**:
- `_id` - ObjectId
- `orderId` - String (unique, e.g., "ORD-2024-001")
- `user` - ObjectId (reference to users collection)
- `items` - Array of objects:
  - `product` - ObjectId (reference to paints or hardwares)
  - `productType` - String ("Paint" or "Hardware")
  - `name` - String (product name)
  - `price` - Number (price at time of order)
  - `quantity` - Number (quantity ordered)
- `totalAmount` - Number (total order value)
- `shippingAddress` - Object:
  - `street` - String
  - `city` - String
  - `state` - String
  - `pincode` - String
  - `phone` - String
- `paymentMethod` - String (enum: "cod", "online", "UPI", "COD")
- `status` - String (enum: "pending", "confirmed", "shipped", "delivered", "cancelled")
- `createdAt` - Date
- `updatedAt` - Date

**Sample Queries**:
```javascript
// Find all pending orders
{ status: "pending" }

// Find orders by user
{ user: ObjectId("USER_ID_HERE") }

// Find delivered orders
{ status: "delivered" }

// Find orders above ₹5000
{ totalAmount: { $gt: 5000 } }

// Find COD orders
{ paymentMethod: "cod" }
```

---

## Useful MongoDB Compass Features

### 1. **Schema Analysis**
Click on any collection → "Schema" tab to see:
- Field types and distributions
- Value ranges
- Data patterns

### 2. **Aggregation Pipeline**
Click "Aggregations" tab to build complex queries:

**Example: Total revenue by status**
```javascript
[
  {
    $group: {
      _id: "$status",
      totalRevenue: { $sum: "$totalAmount" },
      count: { $sum: 1 }
    }
  }
]
```

**Example: Top selling products**
```javascript
[
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.name",
      totalQuantity: { $sum: "$items.quantity" },
      totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
    }
  },
  { $sort: { totalQuantity: -1 } },
  { $limit: 5 }
]
```

### 3. **Indexes**
View indexes on each collection:
- `users`: email (unique), role
- `paints`: text search on name/brand/color/description
- `hardwares`: text search on name/brand/description
- `orders`: user, status, orderId (unique)

### 4. **Export/Import**
- Export collections to JSON/CSV
- Import data from files
- Backup specific collections

---

## Common Tasks in Compass

### Add New Paint Product
1. Go to `paints` collection
2. Click "Insert Document"
3. Use this template:
```json
{
  "name": "Premium Wall Paint",
  "brand": "Asian Paints",
  "color": "Ocean Blue",
  "hexCode": "#0077BE",
  "finish": "matte",
  "size": "4L",
  "price": 1800,
  "stock": 50,
  "category": "Interior",
  "description": "Premium quality interior wall paint",
  "image": "https://placehold.co/400x400/E85D26/white?text=Paint"
}
```

### Add New Hardware Product
1. Go to `hardwares` collection
2. Click "Insert Document"
3. Use this template:
```json
{
  "name": "Professional Paint Brush",
  "brand": "Asian Paints",
  "category": "Brushes",
  "price": 250,
  "stock": 100,
  "description": "High-quality professional paint brush",
  "image": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400"
}
```

### Update Stock Quantity
1. Go to `paints` or `hardwares` collection
2. Find the product
3. Click "Edit Document" (pencil icon)
4. Change the `stock` value
5. Click "Update"

### Change Order Status
1. Go to `orders` collection
2. Find the order
3. Click "Edit Document"
4. Change `status` to: "pending", "confirmed", "shipped", "delivered", or "cancelled"
5. Click "Update"

### Find User's Orders
1. Go to `users` collection
2. Copy the user's `_id` (ObjectId)
3. Go to `orders` collection
4. Filter: `{ user: ObjectId("PASTE_ID_HERE") }`

---

## Database Statistics

### Current Data (After Seed)
- **Total Users**: 3
- **Total Paints**: 15
- **Total Hardware**: 10
- **Total Orders**: 10
- **Total Products**: 25

### Storage Size
Check in Compass:
- Database → "mayurpaints" → View stats
- Shows: Data size, Index size, Collections count

---

## Backup & Restore

### Backup Database
```bash
# Using mongodump (if installed)
mongodump --db mayurpaints --out ./backup

# Or export from Compass:
# Collection → Export Collection → JSON/CSV
```

### Restore Database
```bash
# Using mongorestore (if installed)
mongorestore --db mayurpaints ./backup/mayurpaints

# Or import in Compass:
# Collection → Import Data → Select file
```

---

## Quick Reference

### Connection String
```
mongodb://127.0.0.1:27017
```

### Database Name
```
mayurpaints
```

### Collections
- `users` - User accounts
- `paints` - Paint products
- `hardwares` - Hardware products
- `orders` - Customer orders

### Admin Credentials
- **Email**: admin@mayurpaints.com
- **Password**: admin123 (hashed in DB)

---

## Troubleshooting

### Can't Connect to MongoDB
1. Check if MongoDB service is running:
   ```powershell
   Get-Service -Name MongoDB
   ```
2. Start MongoDB if stopped:
   ```powershell
   Start-Service -Name MongoDB
   ```

### Collection Not Showing
- Refresh Compass (F5)
- Check if database name is correct: `mayurpaints`
- Run `npm run seed` to populate data

### Want to Start Fresh
```bash
cd server
npm run reset    # Wipes everything, creates only admin
npm run seed     # Adds sample data
```

---

## Advanced Queries

### Find Products by Price Range
```javascript
// Paints between ₹1000 and ₹3000
{ price: { $gte: 1000, $lte: 3000 } }
```

### Find Orders This Month
```javascript
{
  createdAt: {
    $gte: new Date("2024-04-01"),
    $lt: new Date("2024-05-01")
  }
}
```

### Count Orders by Status
```javascript
// Use Aggregation Pipeline
[
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
]
```

### Find Low Stock Items
```javascript
// Paints with stock < 30
{ stock: { $lt: 30 } }
```

### Search Products by Name
```javascript
// Text search (uses text index)
{ $text: { $search: "luxury emulsion" } }
```

---

## Tips & Best Practices

1. **Always backup before bulk operations**
2. **Use filters instead of loading all documents**
3. **Check indexes for slow queries**
4. **Use aggregation for complex analytics**
5. **Export data regularly for safety**

---

**MongoDB Compass Version**: 1.40+ recommended  
**Database**: mayurpaints  
**Connection**: mongodb://127.0.0.1:27017  
**Status**: ✅ Connected and Ready

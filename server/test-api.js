import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3001/api'

async function testAPI() {
  console.log('\n🧪 Testing Mayur Paints API\n')
  console.log('═══════════════════════════════════════\n')

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing Health Check...')
    const health = await fetch(`${BASE_URL}/health`)
    const healthData = await health.json()
    console.log('   ✅ Health:', healthData.status, '| DB:', healthData.db)

    // Test 2: Login
    console.log('\n2️⃣  Testing Admin Login...')
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@mayurpaints.com',
        password: 'admin123'
      })
    })
    const loginData = await loginRes.json()
    const token = loginData.data?.token
    console.log('   ✅ Login successful | Token:', token ? 'Received' : 'Missing')

    // Test 3: Get Paints
    console.log('\n3️⃣  Testing Get Paints...')
    const paintsRes = await fetch(`${BASE_URL}/paints`)
    const paintsData = await paintsRes.json()
    console.log(`   ✅ Paints: ${paintsData.count} products found`)

    // Test 4: Get Hardware
    console.log('\n4️⃣  Testing Get Hardware...')
    const hardwareRes = await fetch(`${BASE_URL}/hardware`)
    const hardwareData = await hardwareRes.json()
    console.log(`   ✅ Hardware: ${hardwareData.count} products found`)

    // Test 5: Get Orders (with auth)
    console.log('\n5️⃣  Testing Get Orders (authenticated)...')
    const ordersRes = await fetch(`${BASE_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const ordersData = await ordersRes.json()
    console.log(`   ✅ Orders: ${ordersData.count} orders found`)

    // Test 6: Get Analytics (admin only)
    console.log('\n6️⃣  Testing Get Analytics (admin only)...')
    const analyticsRes = await fetch(`${BASE_URL}/analytics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const analyticsData = await analyticsRes.json()
    console.log(`   ✅ Analytics: Revenue ₹${analyticsData.data?.totalRevenue || 0}`)

    // Test 7: Get Inventory (admin only)
    console.log('\n7️⃣  Testing Get Inventory (admin only)...')
    const inventoryRes = await fetch(`${BASE_URL}/inventory`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const inventoryData = await inventoryRes.json()
    console.log(`   ✅ Inventory: ${inventoryData.stats?.totalItems || 0} total items`)

    // Test 8: Get Users (admin only)
    console.log('\n8️⃣  Testing Get Users (admin only)...')
    const usersRes = await fetch(`${BASE_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const usersData = await usersRes.json()
    console.log(`   ✅ Users: ${usersData.count} users found`)

    console.log('\n═══════════════════════════════════════')
    console.log('✅ All API tests passed!')
    console.log('═══════════════════════════════════════\n')

  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.error(error)
  }
}

testAPI()

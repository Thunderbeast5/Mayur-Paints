import { createSlice } from '@reduxjs/toolkit'

const savedToken = localStorage.getItem('mp_token')
const savedUser = localStorage.getItem('mp_user')
const savedRole = localStorage.getItem('mp_role')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    role: savedRole || null,
    isAuthenticated: !!savedToken,
  },
  reducers: {
    loginSuccess(state, action) {
      const { user, token, role } = action.payload
      state.user = user
      state.token = token
      state.role = role
      state.isAuthenticated = true
      localStorage.setItem('mp_token', token)
      localStorage.setItem('mp_user', JSON.stringify(user))
      localStorage.setItem('mp_role', role)
    },
    logout(state) {
      state.user = null
      state.token = null
      state.role = null
      state.isAuthenticated = false
      localStorage.removeItem('mp_token')
      localStorage.removeItem('mp_user')
      localStorage.removeItem('mp_role')
    },
    setUser(state, action) {
      state.user = action.payload
      localStorage.setItem('mp_user', JSON.stringify(action.payload))
    },
  },
})

export const { loginSuccess, logout, setUser } = authSlice.actions
export default authSlice.reducer

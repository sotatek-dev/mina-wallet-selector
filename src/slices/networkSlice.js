import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  activeNetwork: 0
}

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworks: (state, action) => {
      state.items = action.payload
    },
    setActiveNetwork: (state, action) => {
      state.activeNetwork = action.payload
    },
    resetNetwork: () => {
      return {
        ...initialState
      }
    }
  }
})

export const { setNetworks, setActiveNetwork, resetNetwork } =
  networkSlice.actions

export default networkSlice.reducer

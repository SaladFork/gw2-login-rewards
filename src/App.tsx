import React from 'react'
import keyBy from 'lodash/keyBy'

function App() {
  const loginRewards = [{ day: 1, reward: 'mystic-coin', amount: 2 }]

  const rewards = [{ id: 'mystic-coin', gameId: 19976 }]
  const rewardById = keyBy(rewards, 'id')

  return <div className="App">hi</div>
}

export default App

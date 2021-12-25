import React, { createContext, useContext, useState } from 'react'
import { useRequest } from 'ahooks'
import random from 'lodash/random'
import { ITEM_ID } from './gw2'
import axios from 'axios'

const API_URL = 'https://api.guildwars2.com/v2'

interface Price {
  id: number
  buy: number
  sell: number
}

interface ITPPrices {
  loaded: boolean
  loading: boolean
  prices?: Price[]
  error?: Error
}

interface GW2TPResponse {
  id: number
  whitelisted: boolean
  buys: { quantity: number; unit_price: number }
  sells: { quantity: number; unit_price: number }
}

const TPPricesContext = createContext<ITPPrices>({
  loaded: false,
  prices: undefined,
  loading: false,
  error: undefined,
})

const loadPrices = async (): Promise<Price[]> => {
  const ids = Object.values(ITEM_ID)
  const response = await axios.get<GW2TPResponse[]>(
    `${API_URL}/commerce/prices?ids=${ids.join(',')}`
  )
  return response.data.map((r) => ({
    id: r.id,
    buy: r.buys.unit_price,
    sell: r.sells.unit_price,
  }))
}

const TPPricesProvider: React.FC = (props) => {
  const {
    data: prices,
    loading,
    error,
  } = useRequest<Price[], any[]>(loadPrices)
  const loaded = !loading && !!prices

  return (
    <TPPricesContext.Provider
      value={{ prices, loading, error, loaded }}
      {...props}
    />
  )
}

const useTPPrices = () => {
  const context = useContext(TPPricesContext)

  if (!context) {
    throw new Error('useTPPrices must be used within an TPPricesProvider')
  }

  return context
}

export default TPPricesContext
export { TPPricesProvider, useTPPrices }

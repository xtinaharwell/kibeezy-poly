import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector;

// Auth selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectBalance = (state: RootState) => state.auth.balance;
export const selectPortfolioBalance = (state: RootState) => state.auth.portfolioBalance;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLastUpdate = (state: RootState) => state.auth.lastUpdate;

// Markets selectors
export const selectAllMarkets = (state: RootState) => state.markets.allMarkets;
export const selectFilteredMarkets = (state: RootState) => state.markets.filteredMarkets;
export const selectMarketsLoading = (state: RootState) => state.markets.loading;
export const selectMarketsError = (state: RootState) => state.markets.error;
export const selectMarketsLastUpdate = (state: RootState) => state.markets.lastUpdate;

// Portfolio selectors
export const selectBets = (state: RootState) => state.portfolio.bets;
export const selectStatistics = (state: RootState) => state.portfolio.statistics;
export const selectTransactions = (state: RootState) => state.portfolio.transactions;
export const selectPortfolioValue = (state: RootState) => state.portfolio.portfolio_value;
export const selectPortfolioLoading = (state: RootState) => state.portfolio.loading;
export const selectPortfolioError = (state: RootState) => state.portfolio.error;
export const selectPortfolioLastUpdate = (state: RootState) => state.portfolio.lastUpdate;

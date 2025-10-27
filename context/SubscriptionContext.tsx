import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
  isAuthenticated: false,
  user: { name: '', email: '', address: '', subscription: null },
  dietType: 'VEGETARIAN',
  selectedMeals: [],
  plan: null,
  duration: 'weekly',
  startDate: null,
  totalCost: 0,
};

const SubscriptionContext = createContext(undefined);

const subscriptionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'LOGOUT':
      return initialState;
    case 'SET_DIET_TYPE':
      return { ...state, dietType: action.payload };
    case 'SET_SELECTED_MEALS':
        return { ...state, selectedMeals: action.payload };
    case 'SET_PLAN':
      return {
        ...state,
        plan: action.payload.plan,
        duration: action.payload.duration,
        totalCost: action.payload.plan.price[action.payload.duration],
        selectedMeals: [],
      };
    case 'SET_CUSTOM_PLAN':
        return {
            ...state,
            plan: { name: 'Custom', description: 'User-selected meals', price: { weekly: 0, monthly: 0 } },
            selectedMeals: action.payload.meals,
            duration: action.payload.duration,
            totalCost: action.payload.totalCost,
        };
    case 'SET_START_DATE':
      return { ...state, startDate: action.payload };
    case 'RESET_FLOW':
        return {
            ...state,
            dietType: 'VEGETARIAN',
            selectedMeals: [],
            plan: null,
            duration: 'weekly',
            startDate: null,
            totalCost: 0,
        };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const SubscriptionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);

  return (
    <SubscriptionContext.Provider value={{ state, dispatch }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
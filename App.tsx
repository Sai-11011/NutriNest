import React, { useState, useMemo, useEffect } from 'react';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext.jsx';
import { MEALS, PLANS } from './constants.jsx';
import { Header, Button, Card, Logo, BackButton } from './components/ui.jsx';

// --- DATABASE SIMULATION using localStorage ---

// Initialize DB on first load
const DB_KEY = 'nutrinest_db';
const initializeDb = () => {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify({ users: [] }));
    }
};
// Call it once when the app module is loaded
initializeDb();

const getDb = () => JSON.parse(localStorage.getItem(DB_KEY));
const saveDb = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db));


// --- HELPER ICONS ---
const InfoCardIcon = ({ icon }) => {
    const icons = {
        nutrition: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#2E7D32]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09" /></svg>,
        delivery: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#2E7D32]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 17l5-5-5-5" /><path d="M6 17l5-5-5-5" /></svg>,
        affordable: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#2E7D32]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    };
    return <div className="p-3 bg-green-100 rounded-full">{icons[icon]}</div>;
};

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>


// --- PAGE COMPONENTS ---
const HomePage = ({ navigateTo }) => (
  <div className="flex flex-col min-h-screen">
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-white text-center py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 tracking-tight leading-tight">Healthy Meals. Simplified.</h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Personalized home-style meals for busy urban lifestyles. Fresh, nutritious, and always on time.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => navigateTo('PLANS')} variant="accent" className="px-8 py-3 text-lg w-full sm:w-auto">Explore Plans</Button>
            <Button onClick={() => navigateTo('SIGN_UP')} variant="primary" className="px-8 py-3 text-lg w-full sm:w-auto">Get Started</Button>
          </div>
        </div>
      </section>
      
      {/* Info Cards Section */}
      <section className="bg-[#F6F6F6] py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
                <div className="flex justify-center mb-4"><InfoCardIcon icon="nutrition" /></div>
                <h3 className="text-xl font-semibold text-gray-800">Balanced Nutrition</h3>
                <p className="mt-2 text-gray-600">Expertly crafted meals to meet your daily nutritional needs.</p>
            </Card>
            <Card className="text-center p-8">
                <div className="flex justify-center mb-4"><InfoCardIcon icon="delivery" /></div>
                <h3 className="text-xl font-semibold text-gray-800">On-Time Daily Delivery</h3>
                <p className="mt-2 text-gray-600">Fresh meals delivered to your doorstep every day, hassle-free.</p>
            </Card>
            <Card className="text-center p-8">
                <div className="flex justify-center mb-4"><InfoCardIcon icon="affordable" /></div>
                <h3 className="text-xl font-semibold text-gray-800">Affordable Subscriptions</h3>
                <p className="mt-2 text-gray-600">Healthy eating doesn't have to break the bank. Plans for every budget.</p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  </div>
);

const SignUpPage = ({ navigateTo }) => {
    const { dispatch } = useSubscription();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !password || !address) {
            setError('All fields are required.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        const db = getDb();
        const userExists = db.users.find((user) => user.email === email);
        if (userExists) {
            setError('An account with this email already exists.');
            return;
        }

        // FIX: Consistently use a string for the user ID to avoid type errors with localStorage serialization.
        const newUser = { id: String(Date.now()), name, email, password, address, subscription: null };
        db.users.push(newUser);
        saveDb(db);
        
        setError('');
        dispatch({ type: 'SET_USER', payload: newUser });
        navigateTo('PLANS');
    };

    return (
        <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center flex flex-col items-center">
                    <div onClick={() => navigateTo('HOME')} className="cursor-pointer"><Logo /></div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
                </div>
                <Card className="p-8 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32]" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32]" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32]" />
                        <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery Address" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32]"></textarea>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" variant="primary" className="w-full py-3">Sign Up</Button>
                    </form>
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('LOGIN'); }} className="font-medium text-[#2E7D32] hover:text-[#276a2b]">
                            Log In
                        </a>
                    </p>
                </Card>
            </div>
        </div>
    );
};

const LoginPage = ({ navigateTo }) => {
    const { dispatch } = useSubscription();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('All fields are required.');
            return;
        }

        const db = getDb();
        const user = db.users.find((u) => u.email === email && u.password === password);

        if (user) {
            setError('');
            dispatch({ type: 'SET_USER', payload: user });
            navigateTo('PLANS');
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center flex flex-col items-center">
                    <div onClick={() => navigateTo('HOME')} className="cursor-pointer"><Logo /></div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome back!</h2>
                </div>
                <Card className="p-8 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32]" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32]" />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" variant="primary" className="w-full py-3">Log In</Button>
                    </form>
                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('SIGN_UP'); }} className="font-medium text-[#2E7D32] hover:text-[#276a2b]">
                            Sign Up
                        </a>
                    </p>
                </Card>
            </div>
        </div>
    );
};


const SubscriptionPlansPage = ({ navigateTo }) => {
    const { dispatch } = useSubscription();

    const selectPlan = (plan, duration) => {
        dispatch({ type: 'SET_PLAN', payload: { plan: PLANS[plan], duration } });
        navigateTo('DATE_SELECTION');
    };
    
    return (
        <div className="bg-[#F6F6F6] min-h-screen py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Select Your Subscription Plan</h2>
                <p className="text-center text-gray-600 mb-12">Choose a plan that best fits your lifestyle.</p>

                <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8">
                    <Card className="w-full lg:w-1/3 flex flex-col border-2 border-transparent hover:border-[#2E7D32]">
                        <div className="p-8 flex-grow">
                            <h3 className="text-2xl font-bold text-[#2E7D32]">Casual Plan</h3>
                            <p className="text-gray-500 mt-1">Balanced Diet</p>
                            <ul className="my-6 space-y-3 text-gray-600">
                                <li className="flex items-center"><CheckIcon /> <span>Home-style, nutritious meals</span></li>
                                <li className="flex items-center"><CheckIcon /> <span>Perfect for a balanced diet</span></li>
                                <li className="flex items-center"><CheckIcon /> <span>2 meals/day, 6 days/week</span></li>
                            </ul>
                            <div className="my-6">
                                <p className="text-3xl sm:text-4xl font-bold text-gray-800">₹{PLANS.CASUAL.price.weekly}<span className="text-lg font-normal text-gray-500">/week</span></p>
                                <p className="text-xl font-semibold text-gray-700 mt-2">or ₹{PLANS.CASUAL.price.monthly}<span className="text-base font-normal text-gray-500">/month</span></p>
                            </div>
                        </div>
                        <div className="p-8 bg-gray-50 mt-auto">
                            <Button onClick={() => selectPlan('CASUAL', 'weekly')} variant="primary" className="w-full mb-3">Choose Weekly</Button>
                            <Button onClick={() => selectPlan('CASUAL', 'monthly')} variant="secondary" className="w-full">Choose Monthly</Button>
                        </div>
                    </Card>
                    <Card className="w-full lg:w-1/3 flex flex-col border-2 border-transparent hover:border-[#F57C00]">
                        <div className="p-8 flex-grow">
                            <h3 className="text-2xl font-bold text-[#F57C00]">Gym Plan</h3>
                            <p className="text-gray-500 mt-1">High Protein</p>
                             <ul className="my-6 space-y-3 text-gray-600">
                                <li className="flex items-center"><CheckIcon /> <span>High-protein, low-carb meals</span></li>
                                <li className="flex items-center"><CheckIcon /> <span>Supports fitness & muscle gain</span></li>
                                <li className="flex items-center"><CheckIcon /> <span>2 meals/day, 6 days/week</span></li>
                            </ul>
                             <div className="my-6">
                                <p className="text-3xl sm:text-4xl font-bold text-gray-800">₹{PLANS.GYM.price.weekly}<span className="text-lg font-normal text-gray-500">/week</span></p>
                                <p className="text-xl font-semibold text-gray-700 mt-2">or ₹{PLANS.GYM.price.monthly}<span className="text-base font-normal text-gray-500">/month</span></p>
                            </div>
                        </div>
                        <div className="p-8 bg-gray-50 mt-auto">
                            <Button onClick={() => selectPlan('GYM', 'weekly')} variant="accent" className="w-full mb-3">Choose Weekly</Button>
                            <Button onClick={() => selectPlan('GYM', 'monthly')} variant="secondary" className="w-full">Choose Monthly</Button>
                        </div>
                    </Card>
                </div>
                
                <div className="text-center mt-12 border-t pt-8 max-w-2xl mx-auto">
                    <h3 className="text-xl font-semibold text-gray-800">Want your own mix?</h3>
                    <p className="text-gray-600 my-4">Build a plan with your favorite meals. Perfect for picky eaters and specific dietary needs.</p>
                    <Button onClick={() => navigateTo('CUSTOM_PLAN_BUILDER')} variant="primary" className="px-8 py-3">Create Custom Plan</Button>
                </div>
            </div>
        </div>
    );
};

const CustomPlanBuilderPage = ({ navigateTo }) => {
    const { state, dispatch } = useSubscription();
    const [selectedMeals, setSelectedMeals] = useState(state.selectedMeals.length > 0 ? state.selectedMeals : []);
    const [duration, setDuration] = useState('weekly');

    const handleDietToggle = (diet) => {
        dispatch({ type: 'SET_DIET_TYPE', payload: diet });
        setSelectedMeals([]);
    };
    
    const toggleMeal = (meal) => {
        const isSelected = selectedMeals.find((m) => m.id === meal.id);
        if (isSelected) {
            setSelectedMeals(selectedMeals.filter((m) => m.id !== meal.id));
        } else {
            setSelectedMeals([...selectedMeals, { ...meal, quantity: 1 }]);
        }
    };
    
    const updateQuantity = (id, delta) => {
        const newMeals = selectedMeals.map((meal) => 
            meal.id === id ? { ...meal, quantity: Math.max(1, meal.quantity + delta) } : meal
        );
        setSelectedMeals(newMeals);
    };

    const filteredMeals = useMemo(() => {
        switch (state.dietType) {
            case 'VEGETARIAN': return MEALS.filter(m => m.type === 'VEGETARIAN' || m.type === 'VEGAN');
            case 'NON-VEGETARIAN': return MEALS;
            case 'VEGAN': return MEALS.filter(m => m.type === 'VEGAN');
            default: return MEALS;
        }
    }, [state.dietType]);

    const dailyCost = useMemo(() => selectedMeals.reduce((total, meal) => total + (meal.price * meal.quantity), 0), [selectedMeals]);
    const weeklyCost = dailyCost * 6;
    const monthlyCost = dailyCost * 26;
    
    const handleNext = () => {
        dispatch({ type: 'SET_CUSTOM_PLAN', payload: { meals: selectedMeals, duration, totalCost: duration === 'weekly' ? weeklyCost : monthlyCost } });
        navigateTo('DATE_SELECTION');
    };
    
    return (
        <div className="bg-[#F6F6F6] min-h-screen py-16">
            <div className="container mx-auto px-4">
                <BackButton onClick={() => navigateTo('PLANS')} />
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Build Your Custom Plan</h2>
                <p className="text-center text-gray-600 mb-8">Select meals and adjust quantities to fit your taste and budget.</p>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Meal Selection */}
                    <div className="w-full lg:w-2/3">
                        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2 mb-8 bg-gray-200 p-1 rounded-full w-fit mx-auto">
                            {['VEGETARIAN', 'NON-VEGETARIAN', 'VEGAN'].map(diet => (
                                <button key={diet} onClick={() => handleDietToggle(diet)}
                                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${state.dietType === diet ? 'bg-white text-[#2E7D32] shadow' : 'text-gray-600'}`}>
                                    {diet.charAt(0) + diet.slice(1).toLowerCase().replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredMeals.map(meal => {
                                const isSelected = selectedMeals.some((m) => m.id === meal.id);
                                return (
                                    <div key={meal.id} onClick={() => toggleMeal(meal)}
                                        className={`relative border-2 rounded-xl p-4 text-center cursor-pointer transition-all duration-300 ${isSelected ? 'border-[#2E7D32] bg-green-50 scale-105 shadow-lg' : 'border-gray-200 bg-white hover:shadow-md'}`}>
                                        <meal.icon className="w-10 h-10 mx-auto text-[#F57C00] mb-2" />
                                        <h4 className="font-semibold text-gray-700 text-sm">{meal.name}</h4>
                                        <p className="text-xs text-gray-500">₹{meal.price}</p>
                                        {isSelected && (
                                            <div className="absolute -top-2 -right-2 bg-[#2E7D32] text-white rounded-full h-6 w-6 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24">
                            <Card className="p-6">
                                <h3 className="text-xl font-bold border-b pb-3 mb-4 text-gray-800">Your Custom Plan</h3>
                                {selectedMeals.length > 0 ? (
                                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                                        {selectedMeals.map((meal) => (
                                            <div key={meal.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <meal.icon className="w-8 h-8 text-[#F57C00]" />
                                                    <div>
                                                        <p className="font-semibold text-gray-800 text-sm">{meal.name}</p>
                                                        <p className="text-gray-500 text-xs">₹{meal.price}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => updateQuantity(meal.id, -1)} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-lg flex items-center justify-center">-</button>
                                                    <span className="w-8 text-center font-semibold text-lg">{meal.quantity}</span>
                                                    <button onClick={() => updateQuantity(meal.id, 1)} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-lg flex items-center justify-center">+</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">Select meals to get started.</p>
                                )}
                                <div className="mt-6 border-t pt-4">
                                     <div className="flex justify-center items-center gap-4 mb-4">
                                        <span className="font-medium">Bill me:</span>
                                        <div className="flex p-1 bg-gray-200 rounded-full">
                                            <button onClick={() => setDuration('weekly')} className={`px-4 py-1 rounded-full text-sm font-semibold ${duration === 'weekly' ? 'bg-white shadow' : ''}`}>Weekly</button>
                                            <button onClick={() => setDuration('monthly')} className={`px-4 py-1 rounded-full text-sm font-semibold ${duration === 'monthly' ? 'bg-white shadow' : ''}`}>Monthly</button>
                                        </div>
                                    </div>
                                    <div className="text-center bg-green-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">Daily Cost: ₹{dailyCost.toFixed(2)}</p>
                                        <p className="text-2xl font-bold text-[#2E7D32] mt-1">
                                            {duration === 'weekly' ? `₹${weeklyCost.toFixed(2)}` : `₹${monthlyCost.toFixed(2)}`}
                                            <span className="text-base font-normal"> / {duration}</span>
                                        </p>
                                    </div>
                                    <Button onClick={handleNext} variant="accent" className="w-full mt-4 py-3" disabled={selectedMeals.length === 0}>Next</Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DateSelectionPage = ({ navigateTo }) => {
    const { state, dispatch } = useSubscription();
    
    const getTomorrow = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }

    const getValidStartDate = (date) => {
        let day = date.getDay();
        if (day === 0) { // Sunday
            date.setDate(date.getDate() + 1);
        }
        return date;
    }

    const [startDate, setStartDate] = useState(() => {
        const tomorrow = getTomorrow();
        const validStart = getValidStartDate(tomorrow);
        return validStart.toISOString().split('T')[0];
    });

    const minDate = useMemo(() => {
      const tomorrow = getTomorrow();
      return tomorrow.toISOString().split('T')[0];
    }, []);

    const handleDateChange = (e) => {
        const selected = new Date(e.target.value);
        const utcDate = new Date(selected.getUTCFullYear(), selected.getUTCMonth(), selected.getUTCDate());
        if (utcDate.getUTCDay() !== 0) { // Not Sunday
            setStartDate(e.target.value);
        }
    };

    const handleNext = () => {
        dispatch({ type: 'SET_START_DATE', payload: startDate });
        navigateTo('TRANSACTION');
    };

    const handleBack = () => {
        if (state.plan?.name === 'Custom') {
            navigateTo('CUSTOM_PLAN_BUILDER');
        } else {
            navigateTo('PLANS');
        }
    };

    const formattedDate = new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const durationDays = state.duration === 'weekly' ? 6 : 26;

    return (
        <div className="bg-[#F6F6F6] min-h-screen flex items-center justify-center py-16">
            <div className="container mx-auto px-4 max-w-md">
                <Card className="p-8">
                    <BackButton onClick={handleBack} />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Start Date</h2>
                        <p className="text-gray-600 mb-6">Deliveries are Monday - Saturday.</p>
                        <input 
                            type="date"
                            value={startDate}
                            min={minDate}
                            onChange={handleDateChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32] text-center text-lg"
                        />
                        <div className="mt-6 bg-blue-50 p-4 rounded-lg text-left text-sm text-blue-800">
                            <p>Your plan will start on <strong>{formattedDate}</strong> and will continue for <strong>{durationDays} delivery days</strong>.</p>
                        </div>
                        <Button onClick={handleNext} variant="primary" className="w-full mt-8 py-3">Proceed to Payment</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const TransactionPage = ({ navigateTo }) => {
    const { state, dispatch } = useSubscription();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!state.plan || !state.startDate) {
            navigateTo('HOME');
        }
    }, [state.plan, state.startDate, navigateTo]);

    if (!state.plan || !state.startDate) {
        return <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center"><p>Loading...</p></div>;
    }
    
    const startDate = new Date(state.startDate + 'T00:00:00');
    const endDate = new Date(startDate);
    const deliveryDays = state.duration === 'weekly' ? 6 : 26;
    let addedDays = 0;
    let totalDays = 0;
    while(addedDays < deliveryDays){
        totalDays++;
        const nextDate = new Date(startDate);
        nextDate.setDate(startDate.getDate() + totalDays);
        if(nextDate.getDay() !== 0){ // Not a sunday
            addedDays++;
        }
        endDate.setDate(startDate.getDate() + totalDays);
    }

    const handleConfirm = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            const db = getDb();
            const currentUserEmail = state.user.email;
            const newSubscription = {
                planName: state.plan.name,
                duration: state.duration,
                totalCost: state.totalCost,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
            };
            const updatedUsers = db.users.map((u) => {
                if (u.email === currentUserEmail) {
                    return { ...u, subscription: newSubscription };
                }
                return u;
            });
            saveDb({ ...db, users: updatedUsers });
            
            const updatedUserInDb = updatedUsers.find((u) => u.email === currentUserEmail);
            dispatch({ type: 'UPDATE_USER', payload: updatedUserInDb });

            setIsProcessing(false);
            setIsConfirmed(true);
        }, 2000); // Simulate 2-second processing time
    };
    
    const handleReturnHome = () => {
        dispatch({ type: 'RESET_FLOW' });
        navigateTo('HOME');
    };
    
    if (isConfirmed) {
        return (
            <div className="bg-[#F6F6F6] min-h-screen flex items-center justify-center py-16 px-4">
                <Card className="p-8 md:p-12 text-center max-w-lg">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                        <svg className="h-10 w-10 text-[#2E7D32]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mt-6">Subscription Confirmed!</h2>
                    <p className="text-gray-600 mt-2">Your NutriNest plan is confirmed. Your first meal will arrive on <strong>{startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.</p>
                    <Button onClick={handleReturnHome} variant="primary" className="mt-8">Return to Home</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="bg-[#F6F6F6] min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full space-y-4">
                <BackButton onClick={() => navigateTo('DATE_SELECTION')} />
                <Card className="p-8 space-y-6">
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">Confirm & Pay</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Please review your order and complete your subscription.
                        </p>
                    </div>

                    <div className="bg-slate-100 text-slate-800 rounded-lg p-4 space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 border-b border-slate-300 pb-2">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <p className="flex justify-between"><span>Plan:</span><span className="font-medium text-slate-900">{state.plan.name} ({state.duration})</span></p>
                            <p className="flex justify-between"><span>Start Date:</span><span className="font-medium text-slate-900">{startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></p>
                            <p className="flex justify-between"><span>Est. End Date:</span><span className="font-medium text-slate-900">{endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></p>
                            
                            <div className="pt-1">
                                <p className="font-medium mb-1 text-gray-700">Includes:</p>
                                {state.selectedMeals.length > 0 ? (
                                    <ul className="list-disc list-inside text-slate-700 text-xs pl-1">
                                        {state.selectedMeals.map((m) => <li key={m.id}>{m.name} (x{m.quantity})</li>)}
                                    </ul>
                                ) : (
                                    <p className="text-slate-700 text-xs pl-1">
                                        {state.plan.name === 'Casual' 
                                            ? "A daily rotating selection of our balanced, home-style meals."
                                            : "A daily rotating selection of our high-protein meals for fitness."
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="border-t border-slate-300 mt-3 pt-3 flex justify-between items-center">
                            <span className="text-base font-semibold">Total Amount:</span>
                            <span className="text-xl font-bold text-[#2E7D32]">₹{state.totalCost.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <form onSubmit={handleConfirm} className="space-y-4 pt-4">
                        <h3 className="text-lg font-semibold text-gray-800">Payment Details</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Card Number</label>
                            <input type="text" placeholder="**** **** **** 1234" required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name on Card</label>
                            <input type="text" placeholder="John Doe" required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32]" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Expiry (MM/YY)</label>
                                <input type="text" placeholder="12/25" required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32]" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">CVV</label>
                                <input type="text" placeholder="123" required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32]" />
                            </div>
                        </div>
                        <Button type="submit" variant="accent" className="w-full py-3 mt-4 !mt-6 flex items-center justify-center" disabled={isProcessing}>
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                'Complete Subscription'
                            )}
                        </Button>
                    </form>
                </Card>
                 <p className="text-center text-xs text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    This is a mock transaction page. No real payment will be processed.
                </p>
            </div>
        </div>
    );
};

const ProfilePage = ({ navigateTo }) => {
    const { state, dispatch } = useSubscription();
    const [name, setName] = useState(state.user.name);
    const [email, setEmail] = useState(state.user.email);
    const [address, setAddress] = useState(state.user.address || '');
    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !address) {
            setError('All fields are required.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        const db = getDb();
        const originalEmail = state.user.email;
        
        // Check if new email already exists for another user
        if (email !== originalEmail) {
            const otherUserExists = db.users.find((u) => u.email === email);
            if (otherUserExists) {
                setError('This email is already in use by another account.');
                return;
            }
        }

        // Update user in our "DB"
        let updatedUser = null;
        db.users = db.users.map((u) => {
            if (u.email === originalEmail) {
                updatedUser = { ...u, name, email, address };
                return updatedUser;
            }
            return u;
        });
        saveDb(db);
        
        setError('');
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
    };

    return (
        <div className="bg-[#F6F6F6] min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-2xl">
                <Card className="p-8">
                    <BackButton onClick={() => navigateTo('HOME')} />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Profile</h2>
                        <p className="text-gray-600 mb-8">View and update your personal details and subscription.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                             <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={4}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32]">
                                    </textarea>
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                {isSaved && (
                                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Profile updated successfully!
                                    </div>
                                )}
                                <Button type="submit" variant="primary" className="w-full py-3">Save Changes</Button>
                            </form>
                        </div>
                        <div>
                             <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Plan</h3>
                             {state.user.subscription ? (
                                <div className="bg-slate-100 rounded-lg p-4 space-y-3 text-sm">
                                    <p className="flex justify-between"><span>Plan:</span><span className="font-medium text-slate-900">{state.user.subscription.planName}</span></p>
                                    <p className="flex justify-between"><span>Billing:</span><span className="font-medium text-slate-900 capitalize">{state.user.subscription.duration}</span></p>
                                    <p className="flex justify-between"><span>Started:</span><span className="font-medium text-slate-900">{new Date(state.user.subscription.startDate + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></p>
                                    <p className="flex justify-between"><span>Est. End:</span><span className="font-medium text-slate-900">{new Date(state.user.subscription.endDate + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></p>
                                    <div className="border-t border-slate-300 mt-3 pt-3 flex justify-between items-center">
                                        <span className="text-base font-semibold">Total:</span>
                                        <span className="text-lg font-bold text-[#2E7D32]">₹{state.totalCost.toFixed(2)}</span>
                                    </div>
                                </div>
                             ) : (
                                <div className="text-center bg-gray-50 p-8 rounded-lg">
                                    <p className="text-gray-600 mb-4">You don't have an active subscription.</p>
                                    <Button onClick={() => navigateTo('PLANS')} variant="accent">Explore Plans</Button>
                                </div>
                             )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
const AppContent = () => {
  const [page, setPage] = useState('HOME');
  const { state } = useSubscription();

  const navigateTo = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  useEffect(() => {
    const protectedPages = ['PLANS', 'PROFILE', 'CUSTOM_PLAN_BUILDER', 'DATE_SELECTION', 'TRANSACTION'];
    if (!state.isAuthenticated && protectedPages.includes(page)) {
      navigateTo('SIGN_UP');
    }
  }, [page, state.isAuthenticated]);

  const renderPage = () => {
    const props = { navigateTo };
    switch (page) {
      case 'HOME':
        return <HomePage {...props} />;
      case 'SIGN_UP':
        return <SignUpPage {...props} />;
      case 'LOGIN':
        return <LoginPage {...props} />;
      case 'PLANS':
        return <SubscriptionPlansPage {...props} />;
      case 'PROFILE':
        return <ProfilePage {...props} />;
      case 'CUSTOM_PLAN_BUILDER':
          return <CustomPlanBuilderPage {...props} />;
      case 'DATE_SELECTION':
          return <DateSelectionPage {...props} />;
      case 'TRANSACTION':
          return <TransactionPage {...props} />;
      default:
        return <HomePage {...props} />;
    }
  };

  const showHeader = page !== 'SIGN_UP' && page !== 'LOGIN';

  return (
    <div className="bg-white">
      {showHeader && <Header navigateTo={navigateTo} />}
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <SubscriptionProvider>
      <AppContent />
    </SubscriptionProvider>
  );
}

export default App;

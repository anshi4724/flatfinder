import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import { ChatProvider } from './context/ChatContext'; // Added ChatProvider

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ui/ProtectedRoute';
import LocationSelector from './components/ui/LocationSelector';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chats from './pages/Chats'; // Added Chats page

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import AddProperty from './pages/dashboard/AddProperty';
import EditProperty from './pages/dashboard/EditProperty';
import AIChatbot from './components/AIChatbot';


function App() {
  return (
    <Router>
      <AuthProvider>
        <PropertyProvider>
          <ChatProvider> {/* Wrapped with ChatProvider */}
            <div className="flex flex-col min-h-screen w-full relative border-none">
              <LocationSelector />
              <Navbar />
              <main className="flex-grow w-full">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/property/:id" element={<PropertyDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* Protected Routes */}
                  <Route 
                    path="/chats" 
                    element={
                      <ProtectedRoute>
                        <Chats />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Protected Owner Routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute role="owner">
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/add-property" 
                    element={
                      <ProtectedRoute role="owner">
                        <AddProperty />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/edit-property/:id" 
                    element={
                      <ProtectedRoute role="owner">
                        <EditProperty />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
              <AIChatbot />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                }} 
              />
            </div>
          </ChatProvider>
        </PropertyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

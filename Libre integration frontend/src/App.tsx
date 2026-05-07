import { useAuth } from './hooks/useAuth';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';

const EMPTY_GLUCOSE = {
  current: null,
  history: [],
  fetchedAt: new Date().toISOString(),
};

export default function App() {
  const { user, glucose, loading, error, login, logout } = useAuth();

  return (
    <>
      {user ? (
        <DashboardPage
          user={user}
          initialGlucose={glucose ?? EMPTY_GLUCOSE}
          onLogout={logout}
        />
      ) : (
        <LoginPage onLogin={login} loading={loading} error={error} />
      )}
    </>
  );
}
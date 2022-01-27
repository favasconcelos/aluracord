import UserProvider from '../react/context/user';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

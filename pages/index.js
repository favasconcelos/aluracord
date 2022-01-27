import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loader from '../react/components/loader';
import { useUser } from '../react/context/user';
import useDebounce from '../react/hooks/use-debounce';
import { fetchUser } from '../react/lib/api';

const DEFAULT_USERNAME = 'favasconcelos';

export default function HomePage() {
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const debouncedUsername = useDebounce(username, 250);
  const [loading, setLoading] = useState(true);
  const [localUser, setLocalUser] = useState(null);
  const { setUser: setGlobalUser } = useUser();
  const router = useRouter();

  function handleInputChange({ target: { value } }) {
    setUsername(value);
  }

  useEffect(() => {
    async function load(username) {
      try {
        setLoading(true);
        const data = await fetchUser(username);
        setLocalUser(data);
      } catch (err) {
        setLocalUser(null);
      } finally {
        setLoading(false);
      }
    }
    if (debouncedUsername) {
      load(debouncedUsername);
    }
  }, [debouncedUsername]);

  async function handleSubmit(event) {
    event.preventDefault();
    setGlobalUser(localUser);
    router.push('/chat');
  }

  const avatar = localUser ? localUser.avatar_url : '/github-avatar.png';
  return (
    <>
      <Head>
        <title>Aluracord - Alura Matrix</title>
        <meta name="description" content="Aluracord - Alura Matrix" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-center justify-center w-screen h-screen bg-red-200 bg-no-repeat bg-cover bg-home-background">
        <div className="flex flex-row p-6 border rounded-md bg-neutrals-700 md:p-8 gap-x-4 md:gap-x-10 border-neutrals-600">
          <form onSubmit={handleSubmit}>
            <h1 className="text-xl font-bold text-center text-white md:text-2xl">Boas vindas de volta!</h1>
            <h2 className="mt-1 text-sm font-bold text-center text-neutrals-300">Aluracord - Alura Matrix</h2>
            <input
              autoFocus
              required
              id="username"
              name="username"
              autoComplete="username"
              className="w-full px-3 text-white transition-colors border border-transparent rounded-md outline-none h-9 bg-neutrals-800 mt-7 hover:border-primary-700 focus:border-primary-700"
              type="text"
              maxLength={20}
              placeholder="Usuário do GitHub"
              value={username}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="flex items-center justify-center w-full gap-2 mt-3 text-white transition-colors rounded-md bg-primary-500 h-9 hover:bg-primary-700 disabled:bg-neutrals-400"
              disabled={loading}>
              Entrar
              {loading && <Loader />}
            </button>
          </form>
          <div className="flex flex-col items-center justify-center gap-3 p-2 border bg-neutrals-800 rounded-xl border-neutrals-999">
            {loading ? (
              <Loader className="w-[100px] h-[100px] text-neutrals-300" />
            ) : (
              <>
                <Image src={avatar} width={100} height={100} alt="avatar" className="rounded-full" />
                {localUser && (
                  <div className="rounded text-xs p-2 text-neutrals-200 bg-neutrals-999 truncate max-w-[125px] text-center">
                    <p>{localUser.name}</p>
                    <p>{localUser.login}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

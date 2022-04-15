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

  function handleOpenUserProfile() {
    window.open(localUser.html_url, '_blank').focus();
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
        {/* Panel */}
        <div className="grid grid-flow-row grid-cols-1 p-6 border rounded-md auto-rows-min gap-y-3 bg-neutrals-700 md:p-8 gap-x-4 md:gap-x-10 border-neutrals-600">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-xl font-bold text-white md:text-2xl">Boas vindas de volta!</h1>
            <h2 className="mt-1 text-sm font-bold text-neutrals-300">Aluracord - Alura Matrix</h2>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="">
            <input
              autoFocus
              required
              id="username"
              name="username"
              autoComplete="username"
              className="w-full px-3 text-white transition-colors border border-transparent rounded-md outline-none h-9 bg-neutrals-800 hover:border-primary-700 focus:border-primary-700"
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
          {/* User Info */}
          <div className="flex flex-col items-center justify-center row-start-2 gap-2 p-2 border bg-neutrals-800 rounded-xl border-neutrals-999">
            {loading ? (
              <Loader className="w-[80px] h-[80px] text-neutrals-300" />
            ) : (
              <>
                <Image src={avatar} width={80} height={80} alt="avatar" className="rounded-full" />
                {localUser && (
                  <div
                    className="flex flex-col items-center w-full gap-2 p-3 text-xs truncate border rounded cursor-pointer border-neutrals-999 text-neutrals-200 bg-neutrals-999 hover:bg-neutrals-700"
                    onClick={handleOpenUserProfile}>
                    <div className="font-bold">{localUser.name}</div>
                    <div className="italic">@{localUser.login}</div>
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center justify-center">
                        <span className="font-bold">Followers</span>
                        <span>{localUser.followers}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <span className="font-bold">Following</span>
                        <span>{localUser.following}</span>
                      </div>
                    </div>
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

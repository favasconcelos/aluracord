import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import useDebounce from '../hooks/use-debounce';

function getAvatarUrl(username) {
  return `https://github.com/${username}.png`;
}

const DEFAULT_USERNAME = 'favasconcelos';

export default function Home() {
  const [avatar, setAvatar] = useState(getAvatarUrl(DEFAULT_USERNAME));
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const debouncedUsername = useDebounce(username, 250);

  function handleInputChange({ target: { value } }) {
    setUsername(value);
  }

  useEffect(() => {
    if (debouncedUsername) {
      setAvatar(getAvatarUrl(debouncedUsername));
    } else {
      setAvatar('/github-avatar.png');
    }
  }, [debouncedUsername]);

  function handleAvatarLoadError() {
    setAvatar('/github-avatar.png');
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: handle submit
  }

  return (
    <>
      <Head>
        <title>Aluracord - Alura Matrix</title>
        <meta name="description" content="Aluracord - Alura Matrix" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen h-screen bg-red-200 flex items-center justify-center bg-home-background bg-no-repeat bg-cover">
        <div className="rounded-md bg-neutrals-700 p-6 md:p-8 flex flex-row gap-x-4 md:gap-x-10 border border-neutrals-600">
          <form onSubmit={handleSubmit}>
            <h1 className="text-white text-center text-xl md:text-2xl font-bold">Boas vindas de volta!</h1>
            <h2 className="text-neutrals-300 text-center text-sm font-bold mt-1">Aluracord - Alura Matrix</h2>
            <input
              autoFocus
              required
              id="username"
              name="username"
              autoComplete="username"
              className="px-3 h-9 rounded-md w-full bg-neutrals-800 text-white outline-none mt-7 transition-colors border border-transparent hover:border-primary-700 focus:border-primary-700"
              type="text"
              maxLength={20}
              placeholder="Usuário do GitHub"
              value={username}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="w-full bg-primary-500 text-white h-9 mt-3 rounded-md transition-colors hover:bg-primary-700">
              Entrar
            </button>
          </form>
          <div className="bg-neutrals-800 flex flex-col items-center justify-center p-2 gap-3 border rounded-xl border-neutrals-999">
            <Image
              src={avatar}
              width={100}
              height={100}
              alt="avatar"
              className="rounded-full"
              onError={handleAvatarLoadError}
            />
            {username && (
              <div className="rounded-full text-xs px-2 py-1 text-neutrals-200 bg-neutrals-999 truncate max-w-[125px]">
                {username}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

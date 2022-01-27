import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loader from '../react/components/loader';
import MessageList from '../react/components/messages-list';
import { useUser } from '../react/context/user';
import useCheckAuth from '../react/hooks/use-check-auth';
import { fetchMessages, removeMessage, sendMessage } from '../react/lib/api';

export default function ChatPage() {
  const router = useRouter();

  const { user, setUser } = useUser();
  const initialized = useCheckAuth();

  const [loadingRemoveMessage, setLoadingRemoveMessage] = useState(false);
  const [loadingAddMessage, setLoadingAddMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoadingMessages(true);
        const data = await fetchMessages();
        setMessages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMessages(false);
      }
    }
    if (initialized) {
      load();
    }
  }, [initialized]);

  if (!user) {
    return null;
  }

  function handleLogout() {
    setUser(null);
    router.push('/');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoadingAddMessage(true);
      const data = await sendMessage(user, text);
      setMessages(prev => [data, ...prev]);
      setText('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAddMessage(false);
    }
  }

  async function handleRemoveMessage(id) {
    try {
      setLoadingRemoveMessage(true);
      await removeMessage(id);
      setMessages(prev => prev.filter(message => message.id != id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRemoveMessage(false);
    }
  }

  return (
    <>
      <Head>
        <title>Chat - Aluracord - Alura Matrix</title>
        <meta name="description" content="Aluracord - Alura Matrix" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-center justify-center w-screen h-screen bg-red-200 bg-no-repeat bg-cover bg-home-background">
        <div className="flex flex-col w-10/12 gap-4 p-6 border rounded-md bg-neutrals-700 border-neutrals-600">
          {/* Header */}
          <div className="flex flex-row justify-between align-middle">
            <div className="flex items-center gap-2 text-sm text-neutrals-200">
              <Image src={user.avatar_url} width={24} height={24} alt="avatar" className="rounded-full" />
              {user.name}
            </div>
            <div className="text-sm cursor-pointer text-neutrals-200 hover:text-neutrals-100" onClick={handleLogout}>
              Logout
            </div>
          </div>
          {/* Chat */}
          {loadingMessages && (
            <div className="flex items-center justify-center p-10 text-neutrals-300">
              <Loader className="w-10 h-10" />
            </div>
          )}
          {!loadingMessages && (
            <MessageList
              messages={messages}
              className="rounded bg-neutrals-600 overflow-y-auto max-h-[400px]"
              loadingRemoveMessage={loadingRemoveMessage}
              onRemoveMessage={handleRemoveMessage}
            />
          )}
          {/* Form */}
          <form className="flex items-center gap-4" onSubmit={handleSubmit}>
            <input
              autoFocus
              required
              type="text"
              className="flex items-center w-full px-2 text-sm border rounded outline-none h-11 bg-neutrals-800 border-neutrals-999 text-neutral-200 hover:border-neutrals-400 focus:border-neutrals-400 disabled:bg-neutrals-400"
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={loadingAddMessage}
            />
            <button
              type="button"
              className="p-2 border border-transparent rounded-full outline-none cursor-pointer bg-neutrals-800 border-neutrals-999 hover:border-neutrals-400 disabled:bg-neutrals-400"
              disabled={loadingAddMessage}>
              😁
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

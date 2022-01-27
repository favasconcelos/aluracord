import Image from 'next/image';
import { useEffect, useState } from 'react';
import { fetchUser } from '../lib/api';
import Loader from './loader';

export default function UserInformationCard({ username }) {
  const [loading, toggleLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        toggleLoading(true);
        const data = await fetchUser(username);
        setUserInfo(data);
      } finally {
        toggleLoading(false);
      }
    }
    load();
  }, [username]);

  if (loading) {
    return <Loader className="w-4 h-4 text-neutrals-100" />;
  }

  if (!userInfo) {
    return <div>Error loading user info...</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <Image src={userInfo.avatar_url} width={24} height={24} alt="avatar" className="rounded-full" />
      <div className="text-white">{userInfo.name}</div>
    </div>
  );
}

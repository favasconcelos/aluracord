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
      <Image src={userInfo.avatar_url} width={48} height={48} alt="avatar" className="rounded-full" />
      <div className="flex flex-col items-center gap-1">
        <div className="text-white">{userInfo.name}</div>
        {userInfo.company && <div className="text-white">{userInfo.company}</div>}
        {userInfo.location && <div className="text-white">{userInfo.location}</div>}
      </div>
    </div>
  );
}

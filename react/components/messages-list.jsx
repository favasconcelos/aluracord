import cn from 'classnames';
import Image from 'next/image';
import { getAvatarUrl } from '../utils/common';

function Message({ message }) {
  const avatar = getAvatarUrl(message.username);
  const dateStr = new Date(message.created_at).toLocaleString();
  return (
    <div className="flex flex-col gap-3 pb-2 border-b border-opacity-10 border-b-neutrals-050">
      <div className="flex items-center justify-start gap-3">
        <Image src={avatar} width={24} height={24} alt="avatar" className="rounded-full" />
        <div className="text-white">{message.author}</div>
        <div className="text-xs text-neutrals-300">{dateStr}</div>
      </div>
      <div className="text-white">{message.content}</div>
    </div>
  );
}

export default function MessageList({ messages, className }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {messages.map(message => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}

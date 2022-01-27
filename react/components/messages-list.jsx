import cn from 'classnames';
import Image from 'next/image';
import { RiDeleteBinLine } from 'react-icons/ri';
import { getAvatarUrl } from '../utils/common';
import { useState } from 'react';

function Message({ message, onRemoveMessage, loadingRemoveMessage }) {
  const avatar = getAvatarUrl(message.username);
  const dateStr = new Date(message.created_at).toLocaleString();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex flex-col gap-3 p-4 hover:bg-neutrals-500"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className="flex justify-between h-8">
        <div className="flex items-center justify-start gap-3">
          <Image src={avatar} width={24} height={24} alt="avatar" className="rounded-full" />
          <div className="text-white">{message.author}</div>
          <div className="text-xs text-neutrals-300">{dateStr}</div>
        </div>
        {hovered && (
          <div
            className="p-2 rounded-full cursor-pointer text-neutrals-300 bg-neutrals-700 hover:bg-neutrals-999 disabled:bg-neutrals-500"
            onClick={() => onRemoveMessage(message.id)}
            disabled={loadingRemoveMessage}>
            <RiDeleteBinLine className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="text-white">{message.content}</div>
      <hr className="border-t-0 border-b border-neutral-50 border-opacity-10" />
    </div>
  );
}

export default function MessageList({ messages = [], className, onRemoveMessage, loadingRemoveMessage }) {
  return (
    <div className={cn('flex flex-col', className)}>
      {messages.length === 0 && <div className="p-6 text-sm text-white">No messages yet...</div>}
      {messages.map(message => (
        <Message
          key={message.id}
          message={message}
          onRemoveMessage={onRemoveMessage}
          loadingRemoveMessage={loadingRemoveMessage}
        />
      ))}
    </div>
  );
}

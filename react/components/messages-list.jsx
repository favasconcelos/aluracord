import cn from 'classnames';
import Image from 'next/image';
import { RiDeleteBinLine } from 'react-icons/ri';
import { getAvatarUrl } from '../utils/common';
import { useState, useRef } from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import UserInformationCard from './user-information';

function Message({ message, selected, onClick, onRemoveMessage, loadingRemoveMessage }) {
  const avatar = getAvatarUrl(message.username);
  const dateStr = new Date(message.created_at).toLocaleString();
  const [hovered, setHovered] = useState(false);
  const showActions = hovered || selected;
  return (
    <div
      className={cn('flex flex-col gap-3 p-4 cursor-pointer', { 'bg-neutrals-500': showActions })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}>
      <div className="flex justify-between h-8">
        <Tooltip
          placement="top"
          trigger={['hover']}
          overlay={<UserInformationCard username={message.username} />}
          destroyTooltipOnHide>
          <div className="flex items-center justify-start gap-3">
            <Image src={avatar} width={32} height={32} alt="avatar" className="rounded-full" />
            <div className="flex flex-col gap-y-1">
              <div className="text-xs text-white">{message.author}</div>
              <div className="text-xs text-neutrals-300">{dateStr}</div>
            </div>
          </div>
        </Tooltip>
        {showActions && (
          <div
            className="p-2 rounded-full cursor-pointer text-neutrals-300 bg-neutrals-700 hover:bg-neutrals-999 disabled:bg-neutrals-500"
            onClick={() => onRemoveMessage(message.id)}
            disabled={loadingRemoveMessage}>
            <RiDeleteBinLine className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="text-sm text-white">{message.content}</div>
      <hr className="border-t-0 border-b border-neutral-50 border-opacity-10" />
    </div>
  );
}

export default function MessageList({ messages = [], className, onRemoveMessage, loadingRemoveMessage }) {
  const [selectedMessage, setSelectedMessage] = useState(null);

  return (
    <div className={cn('flex flex-col', className)}>
      {messages.length === 0 && (
        <div className="relative w-10/12 mx-auto h-[250px]">
          <Image layout="fill" objectFit="cover" src="/img-empty.svg" alt="No messages yet..." />
        </div>
      )}
      {messages.map(message => (
        <Message
          key={message.id}
          message={message}
          onRemoveMessage={onRemoveMessage}
          loadingRemoveMessage={loadingRemoveMessage}
          selected={selectedMessage === message.id}
          onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
        />
      ))}
    </div>
  );
}

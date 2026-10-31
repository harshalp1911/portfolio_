import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { contactAPI } from '../../services/api';

const MessageManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: messagesData, isLoading } = useQuery('adminMessages', contactAPI.getAll);

  const readMutation = useMutation(
    ({ id, read }: { id: string; read: boolean }) => contactAPI.setRead(id, read),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminMessages');
      },
    }
  );

  const deleteMutation = useMutation(contactAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('adminMessages');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMutation.mutate(id);
    }
  };

  const messages: any[] = messagesData?.data || [];
  const unreadCount = messages.filter((m) => !m.read).length;

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        Messages {unreadCount > 0 && <span className="text-base font-normal text-[#EF6461]">({unreadCount} unread)</span>}
      </h2>

      {messages.length === 0 ? (
        <div className="card text-center text-gray-600 dark:text-gray-400">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`card ${msg.read ? 'opacity-70' : 'border-l-4 border-[#EF6461]'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{msg.name}</p>
                  <a href={`mailto:${msg.email}`} className="text-sm text-[#EF6461] hover:underline">
                    {msg.email}
                  </a>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">{msg.message}</p>

              <div className="flex gap-2">
                <a href={`mailto:${msg.email}`} className="btn-primary text-sm py-2 px-4">
                  Reply
                </a>
                <button
                  onClick={() => readMutation.mutate({ id: msg._id, read: !msg.read })}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Mark as {msg.read ? 'unread' : 'read'}
                </button>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageManager;

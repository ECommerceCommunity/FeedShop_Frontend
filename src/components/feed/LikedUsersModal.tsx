import React from 'react';

interface LikedUsersModalProps {
  users: { id: number; nickname: string; profileImg?: string; }[];
  onClose: () => void;
}

const LikedUsersModal: React.FC<LikedUsersModalProps> = ({ users, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            좋아요한 사용자 ({users.length}명)
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-64">
          {users.length > 0 ? (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <img
                    src={user.profileImg || 'https://via.placeholder.com/40x40?text=User'}
                    alt={user.nickname}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-gray-800 font-medium">{user.nickname}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              좋아요한 사용자가 없습니다.
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LikedUsersModal;

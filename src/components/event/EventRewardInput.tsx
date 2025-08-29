import React from 'react';
import { EventRewardDto } from '../../types/event';

interface EventRewardInputProps {
  rewards: EventRewardDto[];
  onRewardChange: (index: number, field: keyof EventRewardDto, value: string) => void;
  onAddReward: () => void;
  onRemoveReward: (index: number) => void;
  maxRewards?: number;
}

const EventRewardInput: React.FC<EventRewardInputProps> = ({
  rewards,
  onRewardChange,
  onAddReward,
  onRemoveReward,
  maxRewards = 5
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">이벤트 혜택</h3>
        <span className="text-sm text-gray-500">
          {rewards.length}/{maxRewards}
        </span>
      </div>
      
      {rewards.map((reward, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-gray-900">
              {index + 1}등 보상
            </h4>
            {rewards.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveReward(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                순위
              </label>
              <input
                type="text"
                value={reward.conditionValue}
                onChange={(e) => onRewardChange(index, 'conditionValue', e.target.value)}
                placeholder="예: 1"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                보상 내용
              </label>
              <input
                type="text"
                value={reward.rewardDescription}
                onChange={(e) => onRewardChange(index, 'rewardDescription', e.target.value)}
                placeholder="예: 프리미엄 스니커즈"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}
      
      {rewards.length < maxRewards && (
        <button
          type="button"
          onClick={onAddReward}
          className="w-full py-4 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          보상 추가
        </button>
      )}
    </div>
  );
};

export default EventRewardInput;

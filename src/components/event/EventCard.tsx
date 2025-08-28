import React from 'react';
import styled from 'styled-components';
import type { EventDto, EventType, EventStatus } from '../../types/event';

interface EventCardProps {
  event: EventDto;
  onClick?: (event: EventDto) => void;
  showActions?: boolean;
  onEdit?: (event: EventDto) => void;
  onDelete?: (eventId: number) => void;
}

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
    border-color: #f97316;
  }
`;

const EventImage = styled.div<{ imageUrl?: string }>`
  width: 100%;
  height: 200px;
  border-radius: 12px;
  background: ${props => props.imageUrl 
    ? `url(${props.imageUrl}) center/cover` 
    : 'linear-gradient(135deg, #4a5568, #2d3748)'
  };
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
`;

const EventTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: white;
  line-height: 1.4;
`;

const EventDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 1rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const EventType = styled.span<{ type: EventType }>`
  background: ${props => {
    switch (props.type) {
      case 'BATTLE': return 'linear-gradient(135deg, #ef4444, #dc2626)';
      case 'MISSION': return 'linear-gradient(135deg, #10b981, #059669)';
      case 'MULTIPLE': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
      case 'REVIEW': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'CHALLENGE': return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
      default: return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const EventStatusBadge = styled.span<{ status: EventStatus }>`
  background: ${props => {
    switch (props.status) {
      case 'UPCOMING': return 'rgba(59, 130, 246, 0.2)';
      case 'ONGOING': return 'rgba(16, 185, 129, 0.2)';
      case 'ENDED': return 'rgba(107, 114, 128, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'UPCOMING': return '#3b82f6';
      case 'ONGOING': return '#10b981';
      case 'ENDED': return '#6b7280';
      default: return '#6b7280';
    }
  }};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const EventDates = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
`;

const EventActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ variant: 'edit' | 'delete' }>`
  background: ${props => props.variant === 'edit' 
    ? 'rgba(59, 130, 246, 0.2)' 
    : 'rgba(239, 68, 68, 0.2)'
  };
  color: ${props => props.variant === 'edit' ? '#3b82f6' : '#ef4444'};
  border: 1px solid ${props => props.variant === 'edit' ? '#3b82f6' : '#ef4444'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.variant === 'edit' 
      ? 'rgba(59, 130, 246, 0.3)' 
      : 'rgba(239, 68, 68, 0.3)'
    };
  }
`;

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'UPCOMING': return '예정';
    case 'ONGOING': return '진행중';
    case 'ENDED': return '종료';
    default: return status;
  }
};

const getTypeText = (type: string): string => {
  switch (type) {
    case 'BATTLE': return '배틀';
    case 'MISSION': return '미션';
    case 'MULTIPLE': return '멀티';
    case 'REVIEW': return '리뷰';
    case 'CHALLENGE': return '챌린지';
    default: return type;
  }
};

const EventCard: React.FC<EventCardProps> = ({
  event,
  onClick,
  showActions = false,
  onEdit,
  onDelete
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(event);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(event.eventId);
    }
  };

  return (
    <Card onClick={handleClick}>
      <EventImage imageUrl={event.imageUrl}>
        {!event.imageUrl && getTypeText(event.type)}
      </EventImage>
      
      <EventTitle>{event.title}</EventTitle>
      
      <EventDescription>{event.description}</EventDescription>
      
      <EventMeta>
        <EventType type={event.type}>{getTypeText(event.type)}</EventType>
        <EventStatusBadge status={event.status}>{getStatusText(event.status)}</EventStatusBadge>
      </EventMeta>
      
      <EventDates>
        {formatDate(event.eventStartDate)} ~ {formatDate(event.eventEndDate)}
      </EventDates>
      
      {showActions && (
        <EventActions>
          <ActionButton variant="edit" onClick={handleEdit}>
            수정
          </ActionButton>
          <ActionButton variant="delete" onClick={handleDelete}>
            삭제
          </ActionButton>
        </EventActions>
      )}
    </Card>
  );
};

export default EventCard;

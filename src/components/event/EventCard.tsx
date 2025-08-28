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
  background: white;
  border-radius: 20px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const EventImage = styled.div<{ imageUrl?: string }>`
  width: 280px;
  height: 200px;
  background: ${props => props.imageUrl 
    ? `url(${props.imageUrl}) center/cover` 
    : 'linear-gradient(135deg, #667eea, #764ba2)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  flex-shrink: 0;
  position: relative;
`;

const EventTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  line-height: 1.4;
`;

const EventDescription = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
`;

const EventMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EventType = styled.span<{ type: EventType }>`
  background: ${props => {
    switch (props.type.toLowerCase()) {
      case 'ranking': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'battle': return 'linear-gradient(135deg, #ef4444, #dc2626)';
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
    switch (props.status.toLowerCase()) {
      case 'upcoming': return '#3b82f6';
      case 'ongoing': return '#10b981';
      case 'ended': return '#6b7280';
      default: return '#6b7280';
    }
  }};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 600;
  position: absolute;
  top: 1rem;
  left: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const EventDates = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const EventActions = styled.div`
  display: flex;
  gap: 0.5rem;
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const ActionButton = styled.button<{ variant: 'edit' | 'delete' }>`
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);

  &:hover {
    background: white;
    transform: scale(1.1);
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
  switch (status.toLowerCase()) {
    case 'upcoming': return '예정';
    case 'ongoing': return '진행중';
    case 'ended': return '종료';
    default: return status;
  }
};

const getTypeText = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'ranking': return '랭킹';
    case 'battle': return '배틀';
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
        <EventStatusBadge status={event.status}>{getStatusText(event.status)}</EventStatusBadge>
        {showActions && (
          <EventActions>
            <ActionButton variant="edit" onClick={handleEdit}>
              ✏️
            </ActionButton>
            <ActionButton variant="delete" onClick={handleDelete}>
              🗑️
            </ActionButton>
          </EventActions>
        )}
      </EventImage>
      
      <EventContent>
        <EventTitle>{event.title}</EventTitle>
        
        <EventDescription>{event.description}</EventDescription>
        
        <EventMeta>
          <EventType type={event.type}>{getTypeText(event.type)}</EventType>
        </EventMeta>
        
        <EventDates>
          {formatDate(event.eventStartDate)} ~ {formatDate(event.eventEndDate)}
        </EventDates>
      </EventContent>
    </Card>
  );
};

export default EventCard;

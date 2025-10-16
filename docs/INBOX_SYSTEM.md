# Inbox/Messages System Documentation

## Overview
The Inbox/Messages screen provides comprehensive communication capabilities between users, vehicle owners, and MOVA support. This feature includes organized messaging, filtering, and context-aware conversations.

## Files Created/Modified

### Core Files
1. **`app/inbox.tsx`** - Standalone inbox screen (accessible via direct navigation)
2. **`app/(tabs)/inbox.tsx`** - Tab-based inbox screen (integrated with main navigation)
3. **`app/conversation.tsx`** - Individual conversation screen
4. **`app/_layout.tsx`** - Added inbox and conversation routes

## Features Implemented

### Header Section
- **Title**: "Inbox" with dynamic unread count badge
- **Filter Button**: Access to filter options
- **Filter Chips**: Quick filters for All, Owners, Support, Notifications

### Tab Navigation
- **All Messages**: Complete message list (default)
- **Booking Related**: Messages tied to specific bookings
- **Promotions**: Offers and promotional content
- **Archived**: Archived conversations

### Message List Features
Each conversation displays:
- **Profile Avatar**: Emoji-based avatars with type-specific colors
- **Name**: Contact name (Amit Motors, MOVA Support, etc.)
- **Last Message Preview**: Truncated to 2 lines
- **Timestamp**: Relative time (2 min ago, Yesterday, etc.)
- **Unread Badge**: Count of unread messages
- **Pin Icon**: Pinned conversations indicator
- **Priority Indicator**: High/Medium priority dots for support tickets
- **Booking Reference**: Booking ID display with vehicle thumbnail
- **Ticket ID**: Support ticket reference
- **Image Indicator**: Shows if last message contained an image

### Message Types

#### 1. Owner Messages
- **Purpose**: Communication with vehicle owners
- **Features**:
  - Related to specific bookings
  - Booking ID display with vehicle emoji
  - Quick actions: Call and WhatsApp buttons in conversation
  - Yellow avatar background

#### 2. Support Messages
- **Purpose**: Customer support communication
- **Features**:
  - Issue tracking with ticket IDs
  - Priority indicators (high, medium, low)
  - Blue avatar background
  - Support agent identification

#### 3. System Notifications
- **Purpose**: Automated system messages
- **Features**:
  - Booking confirmations
  - Payment receipts
  - Cancellation updates
  - Promotional offers
  - Read-only (cannot reply)
  - Purple avatar background

### Search & Filter Features
- **Search Bar**: "Search messages..." with real-time filtering
- **Filter by Type**: All, Owners, Support, Notifications
- **Filter by Tab**: All Messages, Booking Related, Promotions, Archived
- **Search Scope**: Name, message content, and booking IDs

### Interactive Features

#### Long Press Actions
- **Pin/Unpin**: Toggle conversation pinning
- **Mark Read/Unread**: Toggle read status
- **Archive**: Move to archived tab
- **Delete**: Remove conversation with confirmation

#### Platform-Specific Interactions
- **iOS**: ActionSheet with native styling
- **Android**: Alert dialog with consistent options

### Conversation Screen Features

#### Header Elements
- **Back Button**: Return to inbox
- **Contact Name**: Owner/Support name
- **Subtitle**: Booking ID or Ticket ID
- **Action Buttons**: Call and WhatsApp (for owner conversations only)

#### Booking Context Card
For booking-related conversations:
- **Booking Details**: ID, vehicle info, dates
- **Status Badge**: Confirmed, Pending, etc.
- **Vehicle Info**: Name and emoji thumbnail
- **Amount**: Total booking cost

#### Message Types in Conversation
1. **User Messages**: Right-aligned, teal background
2. **Contact Messages**: Left-aligned, white background with border
3. **System Messages**: Centered, informational styling

#### Message Features
- **Message Status**: Sending, Sent, Delivered, Read indicators
- **Timestamps**: Grouped by time periods
- **Sender Names**: For multi-party conversations
- **Character Limit**: 500 characters per message

#### Input Controls
- **Text Input**: Multi-line with placeholder
- **Send Button**: Activated when text present
- **Read-Only Mode**: For system notifications

### Empty States
- **Icon**: Chat bubbles outline
- **Message**: "No messages yet"
- **Subtitle**: "Messages from owners and support will appear here"

## Data Structure

### Message Interface
```typescript
interface Message {
  id: string;
  type: 'owner' | 'support' | 'notification';
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isPinned: boolean;
  bookingId?: string;
  vehicleThumbnail?: string;
  ticketId?: string;
  priority?: 'low' | 'medium' | 'high';
  hasImage?: boolean;
  isArchived: boolean;
  isSystemMessage: boolean;
}
```

### Conversation Message Interface
```typescript
interface ConversationMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
  messageType: 'text' | 'image' | 'system';
  imageUrl?: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}
```

### Tab Item Interface
```typescript
interface TabItem {
  id: string;
  title: string;
  count: number;
}
```

## Design System Compliance

### Colors Used
- **Primary**: `Colors.primary.teal` (#2D9B8E) - Active states, branding
- **Accent**: `Colors.accent.blue` (#3FA5B8) - Support elements
- **Error**: `Colors.functional.error` (#E74C3C) - Unread badges, delete actions
- **Warning**: `Colors.functional.warning` (#F39C12) - Medium priority
- **Success**: `Colors.functional.success` (#2ECC71) - High priority (inverted)

### Avatar Color Coding
- **Owner Messages**: `#FEF3C7` (Yellow tint)
- **Support Messages**: `#DBEAFE` (Blue tint)
- **Notifications**: `#F3E8FF` (Purple tint)

### Typography Hierarchy
- **Header Title**: 24px, bold
- **Message Names**: 16px, semi-bold
- **Message Preview**: 14px, regular/medium (unread)
- **Timestamps**: 12px, secondary color
- **Badge Text**: 10-12px, bold, white

### Layout Patterns
- **Message Items**: Full-width with 20px horizontal padding
- **Avatar Size**: 48px circular
- **Badge Sizing**: Minimum 20px width, auto-expand
- **Touch Targets**: Minimum 44px for all interactive elements

## Sample Data

### Owner Message
```typescript
{
  id: '1',
  type: 'owner',
  name: 'Amit Motors',
  avatar: '👨‍💼',
  lastMessage: 'Vehicle is ready for pickup. Please arrive by 10 AM.',
  timestamp: '2 min ago',
  unreadCount: 2,
  isPinned: true,
  bookingId: 'BK001234',
  vehicleThumbnail: '🚗',
  isArchived: false,
  isSystemMessage: false,
}
```

### Support Message
```typescript
{
  id: '2',
  type: 'support',
  name: 'MOVA Support',
  avatar: '🛠️',
  lastMessage: 'We have received your complaint and will resolve it within 24 hours.',
  timestamp: '1 hour ago',
  unreadCount: 0,
  isPinned: false,
  ticketId: 'TK005678',
  priority: 'high',
  isArchived: false,
  isSystemMessage: false,
}
```

### System Notification
```typescript
{
  id: '3',
  type: 'notification',
  name: 'MOVA Booking',
  avatar: '📱',
  lastMessage: 'Your booking has been confirmed. Booking ID: BK001235',
  timestamp: '3 hours ago',
  unreadCount: 1,
  isPinned: false,
  bookingId: 'BK001235',
  isArchived: false,
  isSystemMessage: true,
}
```

## Navigation Flow

### Access Methods
1. **Tab Navigation**: Direct access via Inbox tab
2. **Direct Route**: `/inbox` for standalone access
3. **Conversation**: Navigate from message list to individual chat

### Route Structure
```
/(tabs)/inbox → /conversation
/inbox → /conversation
```

### Parameter Passing
```typescript
router.push({
  pathname: '/conversation',
  params: {
    messageId: string,
    messageType: 'owner' | 'support' | 'notification',
    messageName: string,
    bookingId?: string,
    ticketId?: string,
  }
});
```

## User Experience Patterns

### Message Interaction Flow
1. **View Messages**: Browse organized message list
2. **Filter/Search**: Find specific conversations
3. **Select Message**: Tap to enter conversation
4. **Read/Reply**: View history and send responses
5. **Manage**: Pin, archive, or delete conversations

### Owner Communication Flow
1. **Booking Context**: View booking details at top
2. **Message History**: Review past communications
3. **Quick Actions**: Call or WhatsApp directly
4. **Status Updates**: Real-time message delivery status

### Support Interaction Flow
1. **Ticket Context**: View ticket ID and priority
2. **Issue Tracking**: Follow support conversation thread
3. **Resolution Updates**: Receive status notifications
4. **Escalation**: High priority indicators

### System Notification Flow
1. **Automated Messages**: Receive booking/payment updates
2. **Read-Only**: View information without reply option
3. **Action Context**: Links to relevant booking details
4. **Promotional Content**: Special offers and updates

## Future Enhancements

### Advanced Features
1. **Message Reactions**: Emoji reactions to messages
2. **Message Forwarding**: Share messages with others
3. **Voice Messages**: Audio message support
4. **File Attachments**: Document and image sharing
5. **Message Search**: Full-text search within conversations

### Notification System
1. **Push Notifications**: Real-time message alerts
2. **Notification Settings**: Granular notification controls
3. **Quiet Hours**: Schedule notification silence
4. **Priority Filtering**: Important message highlighting

### Enhanced Support Features
1. **Video Calls**: Support video consultations
2. **Screen Sharing**: Technical support assistance
3. **FAQ Integration**: Automated response suggestions
4. **Escalation Paths**: Automatic priority management

### Owner Communication
1. **Location Sharing**: Share pickup/drop-off locations
2. **Photo Sharing**: Vehicle condition documentation
3. **Rating Integration**: Rate communication experience
4. **Translator**: Multi-language support

## API Integration (Future)

### Endpoints Required
```
GET /api/messages - List all conversations
GET /api/messages/:id - Get conversation details
POST /api/messages - Send new message
PUT /api/messages/:id/read - Mark as read
PUT /api/messages/:id/pin - Pin/unpin conversation
DELETE /api/messages/:id - Delete conversation
GET /api/messages/search?q=query - Search messages
```

### Real-time Features
- **WebSocket Connection**: Live message updates
- **Typing Indicators**: Show when others are typing
- **Online Status**: Show user availability
- **Message Sync**: Cross-device synchronization

## Performance Considerations

### Optimization Strategies
- **Virtual Lists**: Handle large message lists efficiently
- **Message Pagination**: Load conversations incrementally
- **Image Caching**: Cache message images locally
- **Search Indexing**: Fast message search capabilities

### Accessibility Features
- **Screen Reader Support**: Full VoiceOver/TalkBack compatibility
- **High Contrast**: Accessible color schemes
- **Font Scaling**: Support system font size preferences
- **Keyboard Navigation**: Full keyboard accessibility

This comprehensive Inbox/Messages system provides users with professional-grade communication capabilities while maintaining the MOVA app's design consistency and user experience standards.
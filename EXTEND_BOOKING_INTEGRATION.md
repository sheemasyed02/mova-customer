# Extend Booking Screen - Integration Guide

## Overview
The Extend Booking Screen provides a comprehensive solution for users to extend their ongoing car rentals with real-time availability checking, dynamic pricing, and integrated payment processing.

## File Structure
```
d:\MovaCustomer\
├── app\
│   ├── extend-booking.tsx              # Main extend booking screen
│   ├── trip-details.tsx               # Updated with extend booking navigation
│   └── my-trips.tsx                   # Updated with extend booking navigation
└── components\
    ├── QuickExtendButton.tsx          # Reusable extend button component
    └── BookingExtensionWidget.tsx     # Full-featured extension widget
```

## Navigation Routes

### 1. From Trip Details Screen
**File**: `d:\MovaCustomer\app\trip-details.tsx`
**Trigger**: "Extend Booking" button in bottom actions (for ongoing trips)
**Route**: `/extend-booking`
**Parameters**: None (uses hardcoded booking data)

### 2. From My Trips Screen
**File**: `d:\MovaCustomer\app\my-trips.tsx`
**Trigger**: "Extend Booking" button in action buttons (for ongoing trips)
**Route**: `/extend-booking`
**Parameters**: None (uses hardcoded booking data)

### 3. Using QuickExtendButton Component
**File**: `d:\MovaCustomer\components\QuickExtendButton.tsx`
**Usage**: Can be imported and used in any screen
```tsx
import QuickExtendButton from '@/components/QuickExtendButton';

<QuickExtendButton
  bookingId="MOV-12345"
  vehicleName="Hyundai Creta"
  currentEndDate="17 Jan"
  currentEndTime="10:00 AM"
/>
```

### 4. Using BookingExtensionWidget Component
**File**: `d:\MovaCustomer\components\BookingExtensionWidget.tsx`
**Usage**: Full-featured widget for booking details screens
```tsx
import BookingExtensionWidget from '@/components/BookingExtensionWidget';

<BookingExtensionWidget
  bookingId="MOV-12345"
  vehicleName="Hyundai Creta"
  currentEndDate="17 Jan"
  currentEndTime="10:00 AM"
  isOngoing={true}
/>
```

## Screen Features

### Current Booking Info
- Displays vehicle name and current end date/time
- Shows user-friendly question about keeping the car longer

### Date & Time Selection
- Date picker with minimum date validation (today)
- Maximum extension limit (30 days from current end)
- Time picker for precise return time
- Real-time validation of selection

### Extended Duration Display
- Calculates additional days and hours
- Shows new total duration
- Updates dynamically with date/time changes

### Availability Checking
- Simulated real-time availability check
- Shows loading state while checking
- Green checkmark for available slots
- Red X with alternative dates for unavailable slots
- Option to extend until next available date

### Cost Calculation
- Base rental cost per additional day
- Pro-rated charges for partial hours
- GST calculation (18%)
- Total cost breakdown
- Real-time updates with duration changes

### Owner Approval System
- Instant confirmation for auto-approved owners
- Manual approval with estimated response time
- Different UI states for each approval type

### Payment Integration
- Multiple payment methods (UPI, Cards, Net Banking, Wallet)
- Payment method selection modal
- Security deposit information
- Payment processing simulation

### Important Notes Section
- KM limit increase information
- Terms and conditions
- Extension limitations
- Multiple extension capability

### Success Flow
- Success modal with confirmation
- Updated booking details display
- Owner notification status
- Navigation back to booking details

## API Integration Points

### Required APIs (to be implemented):
1. **Check Availability**: `POST /api/bookings/{id}/check-extension`
2. **Calculate Pricing**: `POST /api/bookings/{id}/calculate-extension`
3. **Request Extension**: `POST /api/bookings/{id}/extend`
4. **Process Payment**: `POST /api/payments/process`
5. **Get Booking Details**: `GET /api/bookings/{id}`

### Data Flow:
1. Screen loads with booking data from route params or API
2. User selects new return date/time
3. Availability check API called in real-time
4. Pricing calculation API called on date/time change
5. Extension request submitted with payment
6. Success confirmation with updated booking details

## State Management
- Local state for UI interactions
- Real-time updates for availability and pricing
- Form validation for date/time selection
- Payment flow state management

## Error Handling
- Network error handling for API calls
- Validation errors for invalid date selections
- Payment failure handling
- Graceful fallbacks for unavailable features

## Accessibility
- Screen reader support
- Color contrast compliance
- Touch target sizing
- Keyboard navigation support

## Performance Considerations
- Debounced API calls for availability checking
- Optimized re-renders with useMemo/useCallback
- Lazy loading of payment methods
- Efficient date/time picker handling

## Future Enhancements
- Push notifications for approval status
- Calendar integration for booking reminders
- Multiple vehicle extension support
- Advanced pricing rules (weekends, holidays)
- Loyalty program integration
- Social sharing of extended trips

## Testing Checklist
- [ ] Navigation from all entry points works
- [ ] Date/time validation prevents invalid selections
- [ ] Availability check shows correct status
- [ ] Pricing calculation is accurate
- [ ] Payment flow completes successfully
- [ ] Success modal shows correct information
- [ ] Back navigation preserves app state
- [ ] Error states display helpful messages
- [ ] Accessibility features work correctly
- [ ] Performance is smooth on all devices
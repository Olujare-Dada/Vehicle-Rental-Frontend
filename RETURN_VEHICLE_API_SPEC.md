# Vehicle Return API Specification

## Overview
This document outlines the API endpoint required for implementing vehicle return functionality in the RentEasy vehicle rental system.

## API Endpoint

### **POST** `/rentals/return`

**URL:** `https://vehicle-rental-backend-deployment.onrender.com/rentals/return`

**Description:** Processes a vehicle return request and updates the rental status.

---

## Request Format

### Headers
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```

### Request Body (JSON)
```json
{
  "rentalId": 123,
  "returnDate": "2025-08-10",
  "returnNotes": "Vehicle returned in good condition",
  "mileageAtReturn": 1500
}
```

### Field Descriptions

| Field | Type | Required | Description | Example Values |
|-------|------|----------|-------------|----------------|
| `rentalId` | integer | ✅ | Unique identifier of the rental to return | `123` |
| `returnDate` | string (YYYY-MM-DD) | ✅ | Date when vehicle was returned | `"2025-08-10"` |
| `returnNotes` | string | ✅ | Notes about vehicle condition upon return | `"Vehicle returned in good condition"` |
| `mileageAtReturn` | integer | ✅ | Current mileage of vehicle at return | `1500` |

---

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Vehicle returned successfully",
  "data": {
    "rentalId": 123,
    "vehicleId": 32,
    "vehicleName": "Generic Off-Road Utility Truck",
    "returnDate": "2025-08-10",
    "originalEndDate": "2025-08-21",
    "totalRentalCost": "$1430.00",
    "lateFees": "$0.00",
    "finalAmount": "$1430.00",
    "returnStatus": "Returned",
    "returnNotes": "Vehicle returned in good condition"
  },
  "timestamp": "2025-08-10T12:00:00Z"
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `message` | string | Human-readable success message |
| `data.rentalId` | integer | ID of the rental being returned |
| `data.vehicleId` | integer | ID of the vehicle being returned |
| `data.vehicleName` | string | Name of the vehicle being returned |
| `data.returnDate` | string | Date when vehicle was returned |
| `data.originalEndDate` | string | Original scheduled end date of rental |
| `data.totalRentalCost` | string | Total cost of the rental |
| `data.lateFees` | string | Any late return fees applied |
| `data.finalAmount` | string | Final amount to be charged |
| `data.returnStatus` | string | Status of the return (e.g., "Returned") |
| `data.returnNotes` | string | Notes about the vehicle return |
| `timestamp` | string | Timestamp of the API response |

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Return failed",
  "error": "This rental has already been returned",
  "timestamp": "2025-08-10T12:00:00Z"
}
```

```json
{
  "success": false,
  "message": "Return failed",
  "error": "You can only return vehicles from your own rentals",
  "timestamp": "2025-08-10T12:00:00Z"
}
```

```json
{
  "success": false,
  "message": "Return failed",
  "error": "An unexpected error occurred during vehicle return",
  "timestamp": "2025-08-10T12:00:00Z"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Return failed",
  "error": "Authentication required",
  "timestamp": "2025-08-10T12:00:00Z"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Return failed",
  "error": "Rental does not belong to authenticated user",
  "timestamp": "2025-08-10T12:00:00Z"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Return failed",
  "error": "Rental not found",
  "timestamp": "2025-08-10T12:00:00Z"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Return failed",
  "error": "An unexpected error occurred during vehicle return",
  "timestamp": "2025-08-10T12:00:00Z"
}
```

---

## Business Logic Requirements

### 1. Validation Rules
- Verify that the rental exists and belongs to the authenticated user
- Check that the rental is currently active (not already returned)
- Validate that return date is not in the future
- Ensure all required fields are provided

### 2. Calculations
- Calculate final cost based on actual rental duration
- Apply late fees if vehicle is returned after scheduled end date
- Calculate damage fees based on vehicle condition
- Determine refund amount (if any)

### 3. Status Updates
- Update rental status to "Returned" or "Completed"
- Update vehicle status to "Available"
- Update vehicle availability in the fleet

### 4. Database Operations
- Create a new return record
- Update the rental record
- Update the vehicle record
- Log the return transaction

---

## Example Usage

### cURL Example
```bash
curl -X POST \
  https://vehicle-rental-backend-deployment.onrender.com/rentals/return \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -d '{
    "rentalId": 123,
    "returnDate": "2025-08-10",
    "returnNotes": "Vehicle returned in good condition",
    "mileageAtReturn": 1500
  }'
```

### JavaScript Example
```javascript
const returnVehicle = async (rentalId) => {
  const response = await fetch('/rentals/return', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      rentalId: rentalId,
      returnDate: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
      returnNotes: 'Vehicle returned in good condition',
      mileageAtReturn: 1500
    })
  });
  
  const data = await response.json();
  return data;
};
```

---

## Notes for Implementation

1. **Authentication**: Ensure JWT token validation is performed
2. **Authorization**: Verify user owns the rental being returned
3. **Transaction Safety**: Use database transactions for data consistency
4. **Logging**: Log all return operations for audit purposes
5. **Notifications**: Consider sending confirmation emails to users
6. **Rate Limiting**: Implement rate limiting to prevent abuse
7. **Validation**: Validate all input data thoroughly
8. **Error Handling**: Provide meaningful error messages

---

## Testing Scenarios

1. **Valid Return**: Normal vehicle return with all required fields
2. **Late Return**: Vehicle returned after scheduled end date
3. **Damaged Vehicle**: Vehicle returned with damage
4. **Already Returned**: Attempt to return already returned vehicle
5. **Invalid Rental ID**: Return request with non-existent rental
6. **Unauthorized Access**: Return request from different user
7. **Missing Fields**: Return request with missing required data
8. **Future Return Date**: Return date set in the future

---

**Version:** 1.0  
**Last Updated:** January 2024  
**Contact:** Frontend Development Team 
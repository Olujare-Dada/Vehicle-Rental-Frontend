# Late Fees API Specification

## Overview
This document outlines the API endpoints required for implementing late fees management in the RentEasy vehicle rental system. The late fees system allows users to pay late return fees separately from their rental costs.

## API Endpoints

### **1. GET** `/late-fees/user`

**URL:** `https://vehicle-rental-backend-deployment.onrender.com/late-fees/user`

**Description:** Retrieves all late fees for the authenticated user.

---

#### Request Format

##### Headers
```
Authorization: Bearer {JWT_TOKEN}
```

##### Request Body
*No request body required*

---

#### Response Format

##### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Late fees retrieved successfully",
  "data": [
    {
      "id": 1,
      "username": "jaredada",
      "rentalId": 123,
      "daysLate": 3,
      "totalCost": 80.00,
      "createdAt": "2025-08-10T12:00:00Z"
    },
    {
      "id": 2,
      "username": "jaredada",
      "rentalId": 124,
      "daysLate": 1,
      "totalCost": 30.00,
      "createdAt": "2025-08-11T10:00:00Z"
    }
  ],
  "timestamp": "2025-08-11T15:00:00Z"
}
```

##### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `message` | string | Human-readable success message |
| `data` | array | Array of late fee objects |
| `data[].id` | integer | Unique identifier for the late fee |
| `data[].username` | string | Username of the user with the late fee |
| `data[].rentalId` | integer | ID of the rental associated with the late fee |
| `data[].daysLate` | integer | Number of days the vehicle was returned late |
| `data[].totalCost` | decimal | Total cost of the late fee |
| `data[].createdAt` | string | Timestamp when the late fee was created |
| `timestamp` | string | Timestamp of the API response |

---

### **2. POST** `/late-fees/pay`

**URL:** `https://vehicle-rental-backend-deployment.onrender.com/late-fees/pay`

**Description:** Processes a payment for a late fee.

---

#### Request Format

##### Headers
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```

##### Request Body (JSON)
```json
{
  "lateFeeId": 1,
  "paymentAmount": 50.00,
  "paymentNotes": "Partial payment for late return"
}
```

##### Field Descriptions

| Field | Type | Required | Description | Example Values |
|-------|------|----------|-------------|----------------|
| `lateFeeId` | integer | ✅ | Unique identifier of the late fee to pay | `1` |
| `paymentAmount` | decimal | ✅ | Amount to pay (can be partial) | `50.00` |
| `paymentNotes` | string | ❌ | Optional notes about the payment | `"Partial payment for late return"` |

---

#### Response Format

##### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Late fee payment successful",
  "lateFeeId": 1,
  "paymentId": 5,
  "paymentAmount": 50.00,
  "totalAmountPaid": 80.00,
  "remainingAmount": 20.00,
  "newBalance": -20.00,
  "isFullyPaid": false
}
```

##### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `message` | string | Human-readable success message |
| `lateFeeId` | integer | ID of the late fee being paid |
| `paymentId` | integer | Unique identifier for the payment record |
| `paymentAmount` | decimal | Amount of the current payment |
| `totalAmountPaid` | decimal | Total amount paid towards this late fee |
| `remainingAmount` | decimal | Remaining amount to be paid |
| `newBalance` | decimal | User's new account balance after payment |
| `isFullyPaid` | boolean | Whether the late fee is fully paid |

---

### **3. GET** `/late-fees/{lateFeeId}/payments`

**URL:** `https://vehicle-rental-backend-deployment.onrender.com/late-fees/{lateFeeId}/payments`

**Description:** Retrieves payment history for a specific late fee.

---

#### Request Format

##### Headers
```
Authorization: Bearer {JWT_TOKEN}
```

##### Path Parameters
- `lateFeeId`: ID of the late fee to get payment history for

##### Request Body
*No request body required*

---

#### Response Format

##### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Payment history retrieved successfully",
  "data": [
    {
      "paymentId": 3,
      "lateFeeId": 1,
      "paymentAmount": 30.00,
      "paymentNotes": "First payment",
      "paymentDate": "2025-08-10T14:30:00Z",
      "remainingAmount": 50.00
    },
    {
      "paymentId": 5,
      "lateFeeId": 1,
      "paymentAmount": 50.00,
      "paymentNotes": "Final payment",
      "paymentDate": "2025-08-11T10:00:00Z",
      "remainingAmount": 0.00
    }
  ],
  "timestamp": "2025-08-11T15:00:00Z"
}
```

---

### **4. GET** `/late-fees/payments/user`

**URL:** `https://vehicle-rental-backend-deployment.onrender.com/late-fees/payments/user`

**Description:** Retrieves complete payment history for the authenticated user.

---

#### Request Format

##### Headers
```
Authorization: Bearer {JWT_TOKEN}
```

##### Request Body
*No request body required*

---

#### Response Format

##### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Payment history retrieved successfully",
  "data": [
    {
      "paymentId": 3,
      "lateFeeId": 1,
      "rentalId": 123,
      "paymentAmount": 30.00,
      "paymentNotes": "First payment",
      "paymentDate": "2025-08-10T14:30:00Z"
    },
    {
      "paymentId": 5,
      "lateFeeId": 1,
      "rentalId": 123,
      "paymentAmount": 50.00,
      "paymentNotes": "Final payment",
      "paymentDate": "2025-08-11T10:00:00Z"
    }
  ],
  "timestamp": "2025-08-11T15:00:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Payment failed",
  "error": "Payment amount cannot exceed the late fee amount",
  "timestamp": "2025-08-10T12:00:00Z"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Payment failed",
  "error": "Authentication required",
  "timestamp": "2025-08-10T12:00:00Z"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Payment failed",
  "error": "You can only pay late fees from your own account",
  "timestamp": "2025-08-10T12:00:00Z"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Payment failed",
  "error": "Late fee record not found",
  "timestamp": "2025-08-10T12:00:00Z"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Payment failed",
  "error": "An unexpected error occurred during late fee payment",
  "timestamp": "2025-08-10T12:00:00Z"
}
```

---

## Business Logic Requirements

### 1. Validation Rules
- Verify that the late fee exists and belongs to the authenticated user
- Check that payment amount is positive and doesn't exceed remaining late fee amount
- Ensure user has sufficient balance for the payment
- Validate all required fields are provided

### 2. Payment Processing
- Allow partial payments towards late fees
- Track total amount paid vs. remaining amount
- Update user account balance after payment
- Create payment records for audit trail

### 3. Status Updates
- Mark late fee as fully paid when total amount is reached
- Update late fee remaining amount after each payment
- Maintain payment history for each late fee

### 4. Database Operations
- Create payment records
- Update late fee records
- Update user balance
- Log all payment transactions

---

## Example Usage

### cURL Examples

#### Get User's Late Fees
```bash
curl -X GET \
  https://vehicle-rental-backend-deployment.onrender.com/late-fees/user \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

#### Make Late Fee Payment
```bash
curl -X POST \
  https://vehicle-rental-backend-deployment.onrender.com/late-fees/pay \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -d '{
    "lateFeeId": 1,
    "paymentAmount": 50.00,
    "paymentNotes": "Partial payment for late return"
  }'
```

#### Get Payment History for Specific Late Fee
```bash
curl -X GET \
  https://vehicle-rental-backend-deployment.onrender.com/late-fees/1/payments \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### JavaScript Examples

#### Get User's Late Fees
```javascript
const getLateFees = async () => {
  const response = await fetch('/late-fees/user', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data;
};
```

#### Make Late Fee Payment
```javascript
const payLateFee = async (lateFeeId, amount, notes) => {
  const response = await fetch('/late-fees/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      lateFeeId: lateFeeId,
      paymentAmount: amount,
      paymentNotes: notes
    })
  });
  
  const data = await response.json();
  return data;
};
```

---

## Key Benefits of the System

1. **Better Audit Trail**: Every payment is recorded separately
2. **Accurate Tracking**: `amount_paid` shows exactly how much has been paid
3. **Payment History**: Can see all payments made for each late fee
4. **Flexible Payments**: Users can make partial payments over time
5. **Data Integrity**: Original late fee amounts are never modified
6. **Complete Transparency**: Users can see their payment progress
7. **Separate from Rentals**: Late fees are managed independently from rental costs

---

## Notes for Implementation

1. **Authentication**: Ensure JWT token validation is performed
2. **Authorization**: Verify user owns the late fee being paid
3. **Transaction Safety**: Use database transactions for data consistency
4. **Logging**: Log all payment operations for audit purposes
5. **Balance Management**: Properly handle user account balance updates
6. **Partial Payments**: Support multiple payments towards the same late fee
7. **Validation**: Validate all input data thoroughly
8. **Error Handling**: Provide meaningful error messages

---

## Testing Scenarios

1. **Valid Payment**: Normal late fee payment with valid amount
2. **Partial Payment**: Payment less than total late fee amount
3. **Full Payment**: Payment equal to remaining late fee amount
4. **Excessive Payment**: Payment amount exceeding late fee amount
5. **Invalid Late Fee ID**: Payment for non-existent late fee
6. **Unauthorized Access**: Payment from different user
7. **Insufficient Balance**: Payment when user has insufficient funds
8. **Multiple Payments**: Multiple payments towards the same late fee

---

**Version:** 1.0  
**Last Updated:** January 2024  
**Contact:** Frontend Development Team 
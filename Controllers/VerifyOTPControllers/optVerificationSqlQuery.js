// Update existing pending OTPs to expired status
export const updateOtpStatusToExpiredQuery = `
  UPDATE [dbo].[otp_details]
  SET status = 'expired'
  WHERE phone = @phone 
    AND status = 'pending';
`;

// Generate and insert new OTP
export const generateOtpQuery = `
  INSERT INTO [dbo].[otp_details] (
    phone,
    otp,
    expiry,
    created_at,
    status
  )
  VALUES (
    @phone,
    @otp,
    DATEADD(MINUTE, 5, GETDATE()),
    GETDATE(),
    'pending'
  );
`;

// Check for existing pending OTP
export const checkExistingOtpQuery = `
  SELECT TOP 1
    id,
    phone,
    otp,
    expiry,
    created_at,
    status
  FROM [dbo].[otp_details]
  WHERE phone = @phone
    AND status = 'pending'
    AND expiry > GETDATE()
  ORDER BY created_at DESC;
`;

// Validate OTP
export const validateOtpQuery = `
  SELECT TOP 1
    id,
    phone,
    otp,
    expiry,
    created_at,
    status
  FROM [dbo].[otp_details]
  WHERE phone = @phone
    AND otp = @otp
    AND status = 'pending'
    AND expiry > GETDATE()
  ORDER BY created_at DESC;
`;

// Update OTP status to verified
export const updateOtpToVerifiedQuery = `
  UPDATE [dbo].[otp_details]
  SET status = 'verified'
  WHERE phone = @phone
    AND otp = @otp
    AND status = 'pending';
`;
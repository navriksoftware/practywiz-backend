export const InsertCaseStudyPurchaseDetails = `
INSERT INTO [dbo].[case_study_purchase_dtls]
    (
      [case_study_purchase_user_dtls_id], 
      [case_study_dtls_id], 
      [case_study_purchase_amount], 
      [case_study_purchase_razorpay_payment_id], 
      [case_study_purchase_razorpay_order_id], 
      [case_study_purchase_razorpay_signature], 
      [case_study_purchase_amount_paid_status]
    )
VALUES 
    (
      @userDtlsId, 
      @caseStudyDtlsId, 
      @purchaseAmount, 
      @razorpayPaymentId, 
      @razorpayOrderId, 
      @razorpaySignature, 
      @amountPaidStatus
    );`;

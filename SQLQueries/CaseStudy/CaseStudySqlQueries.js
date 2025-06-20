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

/**
 * SQL Queries for mentee_result_dtls partial upsert and existence check
 */

// Check if a mentee result record exists for given mentee and faculty_case_assign
export const checkMenteeResultExists = `
  SELECT mentee_result_dtls_id, mentee_result_fact_details, mentee_result_analysis_details, mentee_result_research_details,
         mentee_result_total_score, mentee_result_max_score
  FROM dbo.mentee_result_dtls
  WHERE mentee_result_mentee_dtls_id = @menteeId AND mentee_result_faculty_case_assign_dtls_id = @facultyCaseAssignId
`;

// Partial update for existing record (dynamic field to be set)
export function getUpdateMenteeResultQuery(fields) {
  // fields: array of { dbField, param }
  const setClause = fields.map(f => `${f.dbField} = @${f.param}`).join(", ");
  return `
    UPDATE dbo.mentee_result_dtls
    SET ${setClause},
        mentee_result_update_date = GETDATE()
    WHERE mentee_result_mentee_dtls_id = @menteeId AND mentee_result_faculty_case_assign_dtls_id = @facultyCaseAssignId
  `;
}

// Insert new record with only provided fields (others as null)
export const insertMenteeResult = `
  INSERT INTO dbo.mentee_result_dtls (
    mentee_result_faculty_case_assign_dtls_id,
    mentee_result_mentee_dtls_id,
    mentee_result_fact_details,
    mentee_result_analysis_details,
    mentee_result_research_details,
    mentee_result_total_score,
    mentee_result_max_score,
    mentee_result_cr_date,
    mentee_result_update_date
  ) VALUES (
    @facultyCaseAssignId,
    @menteeId,
    @factDetails,
    @analysisDetails,
    @researchDetails,
    @totalScore,
    @maxScore,
    GETDATE(),
    GETDATE()
  )
`;
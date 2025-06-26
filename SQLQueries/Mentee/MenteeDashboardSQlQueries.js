// fetch single mentee details from the dashboard after login
// to fetch the booking details and timeslots and everything this is working right now
export const fetchMenteeSingleDashboardQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email] as mentee_email,
    u.[user_firstname] as mentee_firstname,
    u.[user_lastname] as mentee_lastname,
    u.[user_phone_number] as mentee_phone_number,
    u.[user_type] ,
    u.[user_is_superadmin],
    m.[mentee_dtls_id],
    m.[mentee_user_dtls_id],
    m.[mentee_about],
    m.[mentee_skills],
    m.[mentee_gender],
    m.[mentee_type],
    m.[mentee_profile_pic_url],
    m.[mentee_institute_details],
    m.[mentee_certificate_details],
    m.[mentee_experience_details],
    m.[mentee_language],
    m.[mentee_linkedin_url],
    m.[mentee_twitter_url],
    m.[mentee_instagram_url],
    m.[mentee_dtls_update_date],
    m.[mentee_additional_details],
    (
        SELECT 
        n.[notification_dtls_id],
        n.[notification_user_dtls_id],
        n.[notification_type],
        n.[notification_heading],
        n.[notification_message],
        n.[notification_is_read],
        n.[notification_created_at],
        n.[notification_read_at]
        FROM 
            [dbo].[notifications_dtls] n
        WHERE 
            u.[user_dtls_id] = n.[notification_user_dtls_id]
        ORDER BY 
            n.[notification_created_at] DESC
        FOR JSON PATH
    ) AS notification_list,
     (
        SELECT  b.[mentor_booking_appt_id]
      ,b.[mentor_dtls_id]
      ,b.[mentee_user_dtls_id]
      ,b.[mentor_session_booking_date]
      ,b.[mentor_booked_date]
      ,b.[mentor_booking_time]
      ,b.[mentor_amount]
      ,b.[mentor_razorpay_payment_id]
      ,b.[mentor_razorpay_order_id]
      ,b.[mentor_amount_paid_status]
  FROM [dbo].[mentor_booking_appointments_dtls] b
        WHERE 
            u.[user_dtls_id] = b.[mentee_user_dtls_id]
        ORDER BY 
            b.[mentor_booking_appt_id] DESC
        FOR JSON PATH
    ) AS booking_list
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentee_dtls] m
ON 
    u.[user_dtls_id] = m.[mentee_user_dtls_id]
WHERE 
    u.[user_dtls_id] = @desired_mentee_dtls_id
`;

export const MenteeApprovedBookingQueryTest = `SELECT  [mentor_booking_appt_id]
      ,[mentor_dtls_id]
      ,[mentee_user_dtls_id]
      ,[mentor_session_booking_date]
      ,[mentor_booking_time]
      ,[mentor_booking_confirmed]
      ,[mentor_host_url]
      ,[trainee_join_url]
      ,[mentor_amount_paid_status]
      ,[mentor_session_status]
      ,[mentor_rescheduled_times]
      ,[trainee_session_status]
      ,[trainee_modification_changed_times]
      ,[trainee_rescheduled_times]
      ,[trainee_and_mentor_reward_points]
  FROM [dbo].[mentor_booking_appointments_dtls] 
  where 
  mentee_user_dtls_id = @menteeUserDtlsId 
and mentor_booking_confirmed = 'No' or mentor_booking_confirmed = 'Yes'`;

export const MenteeApprovedBookingQuery = `SELECT 
    mba.[mentor_booking_appt_id],
    mba.[mentor_dtls_id],
    mba.[mentee_user_dtls_id],
    mba.[mentor_session_booking_date],
    mba.[mentor_booking_time],
    mba.[mentor_booking_confirmed],
    mba.[mentor_host_url],
    mba.[trainee_join_url],
    mba.[mentor_amount_paid_status],
    mba.[mentor_session_status],
    mba.[mentor_rescheduled_times],
    mba.[trainee_session_status],
    mba.[trainee_modification_changed_times],
    mba.[trainee_rescheduled_times],
    mba.[trainee_and_mentor_reward_points],
    md.[mentor_dtls_id],
    md.[mentor_profile_photo],
    md.[mentor_user_dtls_id], 
    md.[mentor_job_title],   
    ud.[user_firstname],
    ud.[user_lastname] 
FROM 
    [dbo].[mentor_booking_appointments_dtls] mba
INNER JOIN 
    [dbo].[mentor_dtls] md
ON 
    mba.[mentor_dtls_id] = md.[mentor_dtls_id]
INNER JOIN 
    [dbo].[users_dtls] ud
ON 
    md.[mentor_user_dtls_id] = ud.[user_dtls_id]  -- Assuming user_dtls_id is the primary key in users_dtls
WHERE 
    mba.[mentee_user_dtls_id] = @menteeUserDtlsId 
   AND (mba.[mentor_booking_confirmed] = 'No' 
    OR mba.[mentor_booking_confirmed] = 'Yes' 
    AND mba.[mentor_session_status] = 'upcoming' 
    AND mba.[trainee_session_status] = 'upcoming')
    -- Future date check
    AND mba.[mentor_session_booking_date] > CAST(GETDATE() AS DATE)
    OR (
        mba.[mentor_session_booking_date] = CAST(GETDATE() AS DATE)  -- If session is today
         AND mba.[mentor_booking_starts_time] > CAST(GETDATE() AS TIME)
    )
order by mentor_session_booking_date;

`;
// mentee completed booking queries with feedback
export const MenteeCompletedBookingQuery = `SELECT 
    mba.[mentor_booking_appt_id],
    mba.[mentor_dtls_id],
    mba.[mentee_user_dtls_id],
    mba.[mentor_session_booking_date],
    mba.[mentor_booking_time],
    mba.[mentor_booking_confirmed],
    mba.[mentor_host_url],
    mba.[trainee_join_url],
    mba.[mentor_amount_paid_status],
    mba.[mentor_session_status],
    mba.[mentor_rescheduled_times],
    mba.[trainee_session_status],
    mba.[trainee_modification_changed_times],
    mba.[trainee_rescheduled_times],
    mba.[trainee_and_mentor_reward_points],
    md.[mentor_dtls_id],
    md.[mentor_profile_photo],
    md.[mentor_user_dtls_id], 
    md.[mentor_job_title],   
    ud.[user_firstname] as mentor_firstname,
    ud.[user_lastname] as mentor_lastname,
    mfd.[mentor_feedback_dtls_id],
    mfd.[mentor_feedback_session_relevant],
    mfd.[mentor_feedback_communication_skills],
    mfd.[mentor_feedback_session_appropriate],
    mfd.[mentor_feedback_detailed_fb],
    mfd.[mentor_feedback_add_fb_sugg],
    mfd.[mentor_feedback_another_session],
    mfd.[mentor_feedback_session_overall_rating],
    mfd.[mentor_feedback_session_platform_rating],
    mfd.[mentor_feedback_dtls_cr_date]
FROM 
    [dbo].[mentor_booking_appointments_dtls] mba
INNER JOIN 
    [dbo].[mentor_dtls] md
ON 
    mba.[mentor_dtls_id] = md.[mentor_dtls_id]
INNER JOIN 
    [dbo].[users_dtls] ud
ON 
    md.[mentor_user_dtls_id] = ud.[user_dtls_id]
LEFT JOIN 
    [dbo].[mentor_feedback_dtls] mfd
ON 
    mba.[mentor_booking_appt_id] = mfd.[mentor_appt_booking_dtls_id]
WHERE 
    mba.[mentee_user_dtls_id] = @menteeUserDtlsId 
    AND (mba.[mentor_booking_confirmed] = 'Yes' AND mba.[mentor_session_status] = 'completed' AND mba.[trainee_session_status] = 'completed')
order by mentor_session_booking_date;
`;
// checking the feedback is submitted
export const IsFeedbackSubmittedQuery = `SELECT [mentor_appt_booking_dtls_id]
FROM [dbo].[mentor_feedback_dtls] where mentor_appt_booking_dtls_id = @mentorBookingID`;
// submitting the feedback
export const MenteeFeedbackSubmitHandlerQuery = `INSERT INTO [dbo].[mentor_feedback_dtls] (
                [mentor_dtls_id]
                ,[mentor_user_dtls_id]
                ,[mentor_appt_booking_dtls_id]
                ,[mentee_user_dtls_id]
                ,[mentor_feedback_session_relevant]
                ,[mentor_feedback_communication_skills]
                ,[mentor_feedback_session_appropriate]
                ,[mentor_feedback_detailed_fb]
                ,[mentor_feedback_add_fb_sugg]
                ,[mentor_feedback_another_session]
                ,[mentor_feedback_session_overall_rating]
                ,[mentor_feedback_session_platform_rating]
                ,[mentor_feedback_dtls_cr_date]
            ) VALUES (
                @mentorDtlsId,
                @mentorUserDtlsId,
                @mentorApptBookingDtlsId,
                @menteeUserDtlsId,
                @sessionRelevant,
                @commSkills,
                @sessionAppropriate,
                @detailedFb,
                @fbSugg,
                @anotherSession,
                @overallRating,
                @platformRating,
                @mentorFeedbackDtlsCrDate
            );`;

export const MarkMenteeAllMessagesAsReadQuery = `update notifications_dtls set notification_is_read = 1, notification_read_at =@timestamp where notification_user_dtls_id = @menteeUserDtlsId`;

export const MarkMenteeSingleMessageAsReadQuery = `update notifications_dtls set notification_is_read = 1, notification_read_at =@timestamp where notification_user_dtls_id = @menteeUserDtlsId and notification_dtls_id = @menteeNotificationId
`;

export const GetMenteeAppliedInternshipsSqlQuery = `
SELECT 
    ia.[internship_post_dtls_id],
    ia.[mentee_user_dtls_id],
    ia.[mentee_dtls_id],
    ia.[mentee_resume_link],
    ia.[mentee_internship_applied_status],
    ia.[internship_applicant_dtls_cr_date],
    ia.[internship_applicant_dtls_update_date],
    ei.[employer_internship_post_position],
    ei.[employer_internship_post_type],
    ei.[employer_internship_post_part_full_time],
    ei.[employer_internship_post_location],
    ei.[employer_internship_post_duration],
    ei.[employer_internship_post_stipend_type],
    ei.[employer_internship_post_currency_type],
    ei.[employer_internship_post_stipend_amount],
    ei.[employer_internship_post_status],
    eo.[employer_organization_name],
    eo.[employer_organization_logo],
    eo.[employer_organization_industry]
FROM 
    [dbo].[internship_applicants_dtls] ia
INNER JOIN 
    [dbo].[employer_internship_posts_dtls] ei 
ON 
    ia.[internship_post_dtls_id] = ei.[employer_internship_post_dtls_id]
INNER JOIN 
    [dbo].[employer_organization_dtls] eo
ON 
    ei.[employer_internship_post_org_dtls_id] = eo.[employer_organization_dtls_id]
WHERE 
    ia.[mentee_user_dtls_id] = @mentee_user_dtls_id
ORDER BY 
    ia.[internship_applicant_dtls_cr_date] DESC`;
export const GetCaseDetailsByMenteeIdSqlQuery = `
SELECT 
        -- Case Assignment Details
        f.faculty_case_assign_dtls_id,
        f.faculty_case_assign_faculty_dtls_id,
        f.faculty_case_assign_case_study_id,
        f.faculty_case_assign_class_dtls_id,
        f.faculty_case_assign_start_date,
        f.faculty_case_assign_end_date,
        f.faculty_case_assign_owned_by_practywiz,
        f.faculty_case_assign_fact_question_time,
        f.faculty_case_assign_analysis_question_time,
        f.faculty_case_assign_class_start_date,
        f.faculty_case_assign_class_end_date,
        f.faculty_case_assign_cr_date,
        f.faculty_case_assign_update_date,
        f.faculty_case_assign_fact_question_qty,
        f.faculty_case_assign_analysis_question_qty,
        f.faculty_case_assign_question_distribution,

        -- Practywiz Case Details
        c.case_study_title,
        c.case_study_categories,
        c.case_study_content,
        c.case_study_questions,

        -- Non-Practywiz Case Details
        np.non_practywiz_case_title,
        np.non_practywiz_case_author,
        np.non_practywiz_case_question,
        np.non_practywiz_case_category,

        -- Class Details
        cd.class_name,
        cd.class_subject,
        cd.class_subject_code,
        cd.class_sem_end_date,
        cd.class_faculty_dtls_id,
        cd.class_dtls_cr_date,
        cd.class_dtls_update_date,
        cd.class_status

    FROM [dbo].[faculty_case_assign_dtls] f

    INNER JOIN [dbo].[class_mentee_mapping] m
        ON f.faculty_case_assign_class_dtls_id = m.class_dtls_id

    INNER JOIN [dbo].[class_dtls] cd
        ON f.faculty_case_assign_class_dtls_id = cd.class_dtls_id

    LEFT JOIN [dbo].[case_study_details] c
        ON f.faculty_case_assign_case_study_id = c.case_study_id
        AND f.faculty_case_assign_owned_by_practywiz = 1

    LEFT JOIN [dbo].[non_practywiz_case_dtls] np
        ON f.faculty_case_assign_case_study_id = np.non_practywiz_case_dtls_id
        AND f.faculty_case_assign_owned_by_practywiz = 0

    WHERE m.mentee_dtls_id = @menteeId;
`;


// It returns the submission details such as fact-based questions, analysis-based questions, and research-based questions.
export const GetMenteeResultSubmissionStatusSqlQuery = `
SELECT 
    [mentee_result_dtls_id],
    [mentee_result_faculty_case_assign_dtls_id],
    [mentee_result_mentee_dtls_id],
    [mentee_result_fact_details],
    [mentee_result_analysis_details],
    [mentee_result_research_details],
    [mentee_result_total_score],
    [mentee_result_max_score],
    [mentee_result_cr_date],
    [mentee_result_update_date]
FROM 
    [dbo].[mentee_result_dtls]
WHERE 
    [mentee_result_mentee_dtls_id] = @menteeId 
    AND [mentee_result_faculty_case_assign_dtls_id] = @facultyCaseAssignId
`;
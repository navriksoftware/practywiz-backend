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
    m.[mentee_experience_details]
    ,m.[mentee_language],
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
    AND (mba.[mentor_booking_confirmed] = 'No' OR mba.[mentor_booking_confirmed] = 'Yes' AND mba.[mentor_session_status] = 'upcoming' AND mba.[trainee_session_status] = 'upcoming')
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

// check Bank details exists are not
export const CheckBankDetailsExistsQuery = `
select mentor_bank_user_dtls_id from  mentor_bank_dtls where mentor_bank_user_dtls_id = @mentorBankUserDtlsId`;

// inserting the bank details in to database
export const InsertBankDetailsQuery = `INSERT INTO [dbo].[mentor_bank_dtls] (
    [mentor_bank_user_dtls_id],
    [mentor_bank_mentor_dtls_id],
    [mentor_bank_account_holder_name],
    [mentor_bank_account_number],
    [mentor_bank_name],
    [mentor_bank_account_ifsc_code],
    [mentor_bank_branch],
    [mentor_bank_account_type],
    [mentor_bank_address],
    [mentor_bank_pan_number],
    [mentor_bank_swift_code],
    [mentor_bank_cr_date]
) VALUES (
    @mentorBankUserDtlsId,
    @mentorBankMentorDtlsId,
    @mentorBankAccountHolderName,
    @mentorBankAccountNumber,
    @mentorBankName,
    @mentorBankAccountIfscCode,
    @mentorBankBranch,
    @mentorBankAccountType,
    @mentorBankAddress,
    @mentorBankPanNumber,
    @mentorBankSwiftCode,
    @mentorBankCrDate
);
`;

// get the mentor details in the dashboard after login

// to fetch the booking details and timeslots and everything this is working right now
export const fetchMentorSingleDashboardQuery = `WITH FeedbackData AS (
    SELECT 
        f.[mentor_user_dtls_id],
        COUNT(*) AS feedback_count,
        AVG(CAST(f.[mentor_feedback_session_overall_rating] AS FLOAT)) AS avg_mentor_rating
    FROM 
        [dbo].[mentor_feedback_dtls] f
    GROUP BY 
        f.[mentor_user_dtls_id]
),
FeedbackDetails AS (
    SELECT 
        f.[mentor_feedback_dtls_id],
        f.[mentor_appt_booking_dtls_id],
        f.[mentee_user_dtls_id],
        f.[mentor_feedback_detailed_fb],
        f.[mentor_feedback_add_fb_sugg],
        f.[mentor_feedback_session_overall_rating],
        f.[mentor_feedback_dtls_cr_date],
        mentee.[mentee_profile_pic_url],
        uma.[user_firstname] AS mentee_firstname,
        uma.[user_lastname] AS mentee_lastname,
        f.[mentor_user_dtls_id]
    FROM 
        [dbo].[mentor_feedback_dtls] f
    JOIN
        [dbo].[mentee_dtls] mentee ON f.[mentee_user_dtls_id] = mentee.[mentee_user_dtls_id]
    JOIN 
        [dbo].[users_dtls] uma ON f.[mentee_user_dtls_id] = uma.[user_dtls_id]
),
BookingDetails AS (
    SELECT 
        b.[mentor_dtls_id],
        b.[mentor_session_booking_date],
        b.[mentor_booked_date],
        b.[mentor_booking_starts_time],
        b.[mentor_booking_end_time],
        b.[mentor_booking_time],
        b.[mentor_booking_confirmed],
        b.[mentor_session_status]
    FROM 
        [dbo].[mentor_booking_appointments_dtls] b
    WHERE 
        b.[mentor_booking_confirmed] IN ('Yes', 'No')
),
TimeslotDetails AS (
    SELECT 
        t.[mentor_timeslot_id],
        t.[mentor_dtls_id],
        t.[mentor_timeslot_day],
        t.[mentor_timeslot_from],
        t.[mentor_timeslot_to],
        t.[mentor_timeslot_rec_indicator],
        t.[mentor_timeslot_rec_end_timeframe],
        t.[mentor_timeslot_rec_cr_date],
        t.[mentor_timeslot_booking_status],
        t.[mentor_timeslot_duration],
        t.[mentor_timeslot_status]
    FROM 
        [dbo].[mentor_timeslots_dtls] t
),
NotificationDetails AS (
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
),
CaseStudyDetails AS (
    SELECT 
        c.[case_study_dtls_id],
        c.[case_study_dtls_user_id],
        c.[case_study_dtls_mentor_id],
        c.[case_study_dtls_topic_category],
        c.[case_study_dtls_title],
        c.[case_study_dtls_summary],
        c.[case_study_dtls_background],
        c.[case_study_dtls_main_challenge],
        c.[case_study_dtls_no_characters],
        c.[case_study_dtls_roles],
        c.[case_study_dtls_main_role],
      c.[case_study_dtls_lesson_learn],
      c.[case_study_dtls_skills_to_develop],
      c.[case_study_dtls_resources],
      c.[case_study_cr_date],
      c.[case_study_update_date]
    FROM 
        [dbo].[case_studies_dtls] c
),
BankDetails AS (
    SELECT 
        bank.[mentor_bank_dtls_id],
        bank.[mentor_bank_user_dtls_id],
        bank.[mentor_bank_mentor_dtls_id],
        bank.[mentor_bank_account_holder_name],
        bank.[mentor_bank_account_number],
        bank.[mentor_bank_name],
        bank.[mentor_bank_account_ifsc_code],
        bank.[mentor_bank_branch],
        bank.[mentor_bank_account_type],
        bank.[mentor_bank_address],
        bank.[mentor_bank_pan_number],
        bank.[mentor_bank_swift_code],
        bank.[mentor_bank_cr_date]
    FROM 
        [dbo].[mentor_bank_dtls] bank
)

SELECT 
    u.[user_dtls_id] AS mentor_user_dtls_id,
    u.[user_email] AS mentor_email,
    u.[user_firstname] AS mentor_firstname,
    u.[user_lastname] AS mentor_lastname,
    u.[user_phone_number] AS mentor_phone_number,
    m.[mentor_dtls_id],
    m.[mentor_profile_photo],
    m.[mentor_social_media_profile],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_years_of_experience],
    m.[mentor_academic_qualification],
    m.[mentor_recommended_area_of_mentorship],
    m.[mentor_guest_lectures_interest],
    m.[mentor_curating_case_studies_interest],
    m.[mentor_sessions_free_of_charge],
    m.[mentor_language],
    m.[mentor_timezone],
    m.[mentor_country],
    m.[mentor_dtls_cr_date],
    m.[mentor_dtls_update_date],
    m.[mentor_headline],
    m.[mentor_approved_status],
    m.[mentor_session_price],
    m.[mentor_currency_type],
    m.[mentor_city],
    m.[mentor_institute],
    m.[mentor_area_expertise],
    m.[mentor_passion_dtls],
    m.[mentor_domain],
    m.[mentor_timeslots_json],
    'Yes' AS mentor_dtls_found,
    (
        CASE 
            WHEN m.mentor_dtls_id IS NOT NULL 
                 AND m.mentor_job_title <> ''
                 AND m.mentor_company_name <> ''
                 AND m.mentor_years_of_experience <> ''
                 AND CAST(m.mentor_headline AS varchar(max)) <> ''
                 AND m.mentor_area_expertise IS NOT NULL THEN
                CASE 
                    WHEN EXISTS (SELECT 1 FROM TimeslotDetails t WHERE t.mentor_dtls_id = m.mentor_dtls_id) 
                        THEN 
                            CASE 
                                WHEN 
                                    m.mentor_profile_photo IS NOT NULL
                                    AND m.mentor_academic_qualification IS NOT NULL
                                    AND m.mentor_recommended_area_of_mentorship IS NOT NULL
                                    AND m.mentor_guest_lectures_interest IS NOT NULL
                                    AND m.mentor_curating_case_studies_interest IS NOT NULL
                                    AND m.mentor_sessions_free_of_charge IS NOT NULL
                                    AND m.mentor_language IS NOT NULL
                                    AND m.mentor_timezone IS NOT NULL
                                    AND m.mentor_country IS NOT NULL
                                    AND m.mentor_city IS NOT NULL
                                    AND m.mentor_institute IS NOT NULL
                                    AND m.mentor_passion_dtls IS NOT NULL
                                    AND m.mentor_domain IS NOT NULL THEN 100
                                ELSE 80
                            END
                    ELSE 50
                END
            ELSE 20
        END
    ) AS total_progress,
    (
        SELECT 
            * 
        FROM TimeslotDetails t
        WHERE t.[mentor_dtls_id] = m.[mentor_dtls_id] and t.[mentor_timeslot_status] = 'unarchieve'
        FOR JSON PATH
    ) AS timeslot_list,
    (
        SELECT 
            * 
        FROM NotificationDetails n
        WHERE n.[notification_user_dtls_id] = u.[user_dtls_id] 
        ORDER BY 
            n.[notification_created_at] DESC
        FOR JSON PATH
    ) AS notification_list,
    (
        SELECT 
            * 
        FROM CaseStudyDetails c
        WHERE c.[case_study_dtls_user_id] = u.[user_dtls_id]
        FOR JSON PATH
    ) AS case_studies_list,
    (
        SELECT 
            * 
        FROM BookingDetails b
        WHERE b.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS booking_dtls_list,
    (
        SELECT 
            * 
        FROM BankDetails bank
        WHERE bank.[mentor_bank_user_dtls_id] = u.[user_dtls_id]
        FOR JSON PATH
    ) AS banking_dtls_list,
    COALESCE(fb.feedback_count, 0) AS feedback_count,
    fb.avg_mentor_rating,
    (
        SELECT 
            * 
        FROM FeedbackDetails fd
        WHERE fd.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]
        FOR JSON PATH
    ) AS feedback_details
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m ON u.[user_dtls_id] = m.[mentor_user_dtls_id]
LEFT JOIN 
    FeedbackData fb ON fb.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]
WHERE 
    u.[user_dtls_id] = @desired_mentor_dtls_id;
`;

export const fetchMentorNotUpdatedDetailsQuery = `
    SELECT 
        u.[user_dtls_id] as mentor_user_dtls_id,
        u.[user_email] as mentor_email,
        u.[user_firstname] as mentor_firstname,
        u.[user_lastname] as mentor_lastname,
        u.[user_phone_number] as mentor_phone_number,
        '' as mentor_dtls_id,
        '' as mentor_social_media_profile,
        '' as mentor_job_title,
        '' as mentor_company_name,
        '' as mentor_years_of_experience,
        'No' AS mentor_dtls_found,
        '' as mentor_academic_qualification,
        '' as mentor_recommended_area_of_mentorship,
        'No' as mentor_guest_lectures_interest,
        'No' as mentor_curating_case_studies_interest,
        'No' as mentor_sessions_free_of_charge,
        'English' as mentor_language,
        'UTC+05:30: Indian Standard Time (IST), Sri Lanka Time (SLT)' as mentor_timezone,
        '' as mentor_country,
        '' as mentor_dtls_cr_date,
        '' as mentor_dtls_update_date,
        '' as mentor_headline,
        'No' as mentor_approved_status,
        '0' as mentor_session_price,
        '' as mentor_currency_type,
        '' as mentor_city,
        '' as mentor_institute,
        '[]' as mentor_area_expertise,
        '[{\"id\":\"draggable2\",\"text\":\"Management\",\"inside\":false},{\"id\":\"draggable3\",\"text\":\"Leadership\",\"inside\":false},{\"id\":\"draggable4\",\"text\":\"Career Guidance\",\"inside\":false},{\"id\":\"draggable5\",\"text\":\"Public Speaking\",\"inside\":false},{\"id\":\"draggable6\",\"text\":\"Creativity\",\"inside\":false},{\"id\":\"draggable7\",\"text\":\"Teamwork\",\"inside\":false},{\"id\":\"draggable8\",\"text\":\"Problem Solving\",\"inside\":false},{\"id\":\"draggable9\",\"text\":\"Mentorship\",\"inside\":false},{\"id\":\"draggable10\",\"text\":\"Critical Thinking\",\"inside\":false},{\"id\":\"draggable15\",\"text\":\"Innovation\",\"inside\":false},{\"id\":\"draggable16\",\"text\":\"Inclusivity\",\"inside\":false},{\"id\":\"draggable17\",\"text\":\"Curiosity\",\"inside\":false},{\"id\":\"draggable18\",\"text\":\"Health and Wellness\",\"inside\":false},{\"id\":\"draggable19\",\"text\":\"Continuous Learning\",\"inside\":false},{\"id\":\"draggable20\",\"text\":\"Community Involvement\",\"inside\":false},{\"id\":\"draggable21\",\"text\":\"Resume Building\",\"inside\":false},{\"id\":\"draggable22\",\"text\":\"Interview Preparation\",\"inside\":false},{\"id\":\"draggable23\",\"text\":\"Networking\",\"inside\":false},{\"id\":\"draggable24\",\"text\":\"Skill Development\",\"inside\":false},{\"id\":\"draggable25\",\"text\":\"Personal Branding\",\"inside\":false},{\"id\":\"draggable26\",\"text\":\"Time Management\",\"inside\":false},{\"id\":\"draggable27\",\"text\":\"Goal Setting\",\"inside\":false},{\"id\":\"draggable28\",\"text\":\"Job Search Strategies\",\"inside\":false},{\"id\":\"draggable29\",\"text\":\"Salary Negotiation\",\"inside\":false},{\"id\":\"draggable30\",\"text\":\"Career Transitions\",\"inside\":false},{\"id\":\"draggable31\",\"text\":\"Work-Life Balance\",\"inside\":false},{\"id\":\"draggable32\",\"text\":\"Adaptability\",\"inside\":false},{\"id\":\"draggable33\",\"text\":\"Emotional Intelligence\",\"inside\":false},{\"id\":\"draggable34\",\"text\":\"Stress Management\",\"inside\":false},{\"id\":\"draggable35\",\"text\":\"Personal Development\",\"inside\":false},{\"id\":\"draggable36\",\"text\":\"Conflict Resolution\",\"inside\":false},{\"id\":\"draggable37\",\"text\":\"Self-Motivation\",\"inside\":false},{\"id\":\"draggable38\",\"text\":\"Project Management\",\"inside\":false},{\"id\":\"draggable39\",\"text\":\"Job Satisfaction\",\"inside\":false},{\"id\":\"draggable40\",\"text\":\"Professional Growth\",\"inside\":false},{\"id\":\"draggable41\",\"text\":\"Effective Feedback\",\"inside\":false},{\"id\":\"draggable42\",\"text\":\"Portfolio Building\",\"inside\":false},{\"id\":\"draggable43\",\"text\":\"Freelancing Tips\",\"inside\":false},{\"id\":\"draggable44\",\"text\":\"Online Learning\",\"inside\":false},{\"id\":\"draggable45\",\"text\":\"Remote Work\",\"inside\":false},{\"id\":\"draggable46\",\"text\":\"Industry Trends\",\"inside\":false},{\"id\":\"draggable47\",\"text\":\"Workplace Etiquette\",\"inside\":false},{\"id\":\"draggable48\",\"text\":\"Confidence Building\",\"inside\":false},{\"id\":\"draggable49\",\"text\":\"Effective Communication\",\"inside\":false},{\"id\":\"draggable50\",\"text\":\"Lifelong Learning\",\"inside\":false}]' as mentor_passion_dtls,
        '' as mentor_domain,
        '[]' as timeslot_list,
        '' as case_studies_list,
        '' as booking_dtls_list,
        '' as banking_dtls_list,
        0 as feedback_count,
        '' as avg_mentor_rating ,
        '' as feedback_details,
        (
            SELECT 
                * 
            FROM notifications_dtls n
            WHERE n.[notification_user_dtls_id] = u.[user_dtls_id]
            ORDER BY 
            n.[notification_created_at] DESC
            FOR JSON PATH
        ) AS notification_list
    FROM 
        [dbo].[users_dtls] u
    WHERE 
        u.[user_dtls_id] = @desired_mentor_dtls_id1;  -- Replace with the dynamic user id as needed`;

export const MarkMentorAllMessagesAsReadQuery = `update notifications_dtls set notification_is_read = 1, notification_read_at =@timestamp where notification_user_dtls_id = @mentorUserDtlsId`;

export const MarkMentorSingleMessageAsReadQuery = `update notifications_dtls set notification_is_read = 1, notification_read_at =@timestamp where notification_user_dtls_id = @mentorUserDtlsId and notification_dtls_id = @mentorNotificationId
`;

//showing the mentor completed session in the mentor dashboard completed page
export const MentorCompletedSessionsBookingQuery = ` SELECT 
    u.user_dtls_id,
    u.user_firstname as mentee_firstname,
    u.user_lastname as mentee_lastname,
    m.mentor_user_dtls_id,
    m.mentor_job_title,
    m.mentor_company_name,
    mba.mentor_booking_appt_id,
    mba.mentee_user_dtls_id,
    mba.mentor_session_booking_date,
    mba.mentor_booking_time
FROM 
    dbo.users_dtls u
INNER JOIN 
    dbo.mentor_dtls m ON u.user_dtls_id = m.mentor_user_dtls_id
INNER JOIN 
    dbo.mentor_booking_appointments_dtls mba ON m.mentor_dtls_id = mba.mentor_dtls_id
WHERE 
    u.user_dtls_id = @mentorUserDtlsId
    AND (mba.[mentor_booking_confirmed] = 'Yes' and mba.[mentor_session_status] = 'completed' AND mba.[trainee_session_status] = 'completed');
`;

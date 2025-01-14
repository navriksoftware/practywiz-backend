// fetch all mentor queries
export const fetchAllApprovedMentorQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_type],
    u.[user_is_superadmin],
    m.[mentor_dtls_id],
    m.[mentor_user_dtls_id],
    m.[mentor_phone_number],
    m.[mentor_email],
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
    m.[mentor_institute]
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE
    m.[mentor_approved_status] = 'Yes'
`;
export const fetchAllNotApprovedMentorQuery = `WITH TimeslotDetails AS (
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
)

SELECT 
    u.[user_dtls_id] AS mentor_user_dtls_id,
    u.[user_email] AS mentor_email,
    u.[user_firstname] AS mentor_firstname,
    u.[user_lastname] AS mentor_lastname,
    u.[user_phone_number] AS mentor_phone_number,
    m.[mentor_dtls_id],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_years_of_experience],
    m.[mentor_country],
    m.[mentor_approved_status],
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
    ) AS total_progress
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m ON u.[user_dtls_id] = m.[mentor_user_dtls_id]
where 
    m.[mentor_approved_status] = 'No'

`;

export const UpdateMentorToDisapproveQuery = `update mentor_dtls set mentor_approved_status = 'No' where mentor_dtls_id = @mentorUserDtls;
`;
export const UpdateMentorToApproveQuery = `update mentor_dtls set mentor_approved_status = 'Yes' where mentor_dtls_id = @mentorUserDtls`;

export const fetchAllMentorUpcomingSessionsQuery = `SELECT 
    mba.[mentor_booking_appt_id],
    mba.[mentor_dtls_id],
    mba.[mentee_user_dtls_id],
    mba.[mentor_session_booking_date],
    mba.[mentor_session_status],
    mba.[trainee_session_status],
    mba.[mentor_booking_time],
    mba.[mentor_booking_confirmed],
    mba.[practy_team_host_url],
    mentee.[user_email] AS mentee_email,
    mentee.[user_firstname] AS mentee_firstname,
    mentee.[user_lastname] AS mentee_lastname,
    mentee.[user_phone_number] AS mentee_phone_number,
    mentor.[user_email] AS mentor_email,
    mentor.[user_firstname] AS mentor_firstname,
    mentor.[user_lastname] AS mentor_lastname,
    mentor.[user_phone_number] AS mentor_phone_number,
    mentor.[user_dtls_id] AS mentor_dtls_id
FROM 
    [dbo].[mentor_booking_appointments_dtls] mba
JOIN 
    [dbo].[users_dtls] mentee 
ON 
    mba.[mentee_user_dtls_id] = mentee.[user_dtls_id]
JOIN 
    [dbo].[mentor_dtls] md 
ON 
    mba.[mentor_dtls_id] = md.[mentor_dtls_id]
JOIN 
    [dbo].[users_dtls] mentor
ON 
    md.[mentor_user_dtls_id] = mentor.[user_dtls_id]
where 
    mba.[mentor_session_status] = 'upcoming' and mba.[trainee_session_status] = 'upcoming' and mba.[mentor_session_booking_date] >= CAST(GETDATE() AS DATE);`;

export const fetchAllMentorCompletedSessionsQuery = `
SELECT 
    mba.[mentor_booking_appt_id],
    mba.[mentor_dtls_id],
    mba.[mentee_user_dtls_id],
    mba.[mentor_session_booking_date],
    mba.[mentor_booking_time],
    mba.[mentor_booking_confirmed],
    mba.[practy_team_host_url],
    mba.[mentor_session_status],
    mentee.[user_email] AS mentee_email,
    mentee.[user_firstname] AS mentee_firstname,
    mentee.[user_lastname] AS mentee_lastname,
    mentee.[user_phone_number] AS mentee_phone_number,
    mentor.[user_email] AS mentor_email,
    mentor.[user_firstname] AS mentor_firstname,
    mentor.[user_lastname] AS mentor_lastname,
    mentor.[user_phone_number] AS mentor_phone_number,
    feedback.[mentor_appt_booking_dtls_id],
    feedback.[mentor_feedback_session_overall_rating],
    feedback.[mentor_feedback_session_platform_rating],
    feedback.[mentor_feedback_dtls_cr_date],
    mentee1.[mentee_profile],
    mentee1.[mentee_dtls_id]
FROM 
    [dbo].[mentor_booking_appointments_dtls] mba
JOIN 
    [dbo].[users_dtls] mentee 
ON 
    mba.[mentee_user_dtls_id] = mentee.[user_dtls_id]
JOIN 
    [dbo].[mentor_dtls] md 
ON 
    mba.[mentor_dtls_id] = md.[mentor_dtls_id]
JOIN 
    [dbo].[users_dtls] mentor
ON 
    md.[mentor_user_dtls_id] = mentor.[user_dtls_id]
JOIN 
    [dbo].[mentee_dtls] mentee1 
ON 
    mba.[mentee_user_dtls_id] = mentee1.[mentee_user_dtls_id]
LEFT JOIN 
    [dbo].[mentor_feedback_dtls] feedback
ON
    mba.[mentor_booking_appt_id] = feedback.[mentor_appt_booking_dtls_id]
WHERE 
    mba.[mentor_session_status] = 'completed' 
    AND mba.[trainee_session_status] = 'completed' 
    AND mba.[mentor_session_booking_date] < CAST(GETDATE() AS DATE);
`;

export const fetchAllMentorInCompletedSessionsQuery = `
SELECT 
    mba.[mentor_booking_appt_id],
    mba.[mentor_dtls_id],
    mba.[mentee_user_dtls_id],
    mba.[mentor_session_booking_date],
    mba.[mentor_session_status],
    mba.[trainee_session_status],
    mba.[mentor_booking_time],
    mba.[mentor_booking_confirmed],
    mba.[practy_team_host_url],
    mentee.[user_email] AS mentee_email,
    mentee.[user_firstname] AS mentee_firstname,
    mentee.[user_lastname] AS mentee_lastname,
    mentee.[user_phone_number] AS mentee_phone_number,
    mentor.[user_email] AS mentor_email,
    mentor.[user_firstname] AS mentor_firstname,
    mentor.[user_lastname] AS mentor_lastname,
    mentor.[user_phone_number] AS mentor_phone_number,
    mentor.[user_dtls_id] AS mentor_dtls_id
FROM 
    [dbo].[mentor_booking_appointments_dtls] mba
JOIN 
    [dbo].[users_dtls] mentee 
ON 
    mba.[mentee_user_dtls_id] = mentee.[user_dtls_id]
JOIN 
    [dbo].[mentor_dtls] md 
ON 
    mba.[mentor_dtls_id] = md.[mentor_dtls_id]
JOIN 
    [dbo].[users_dtls] mentor
ON 
    md.[mentor_user_dtls_id] = mentor.[user_dtls_id]
where 
    mba.[mentor_session_status] = 'upcoming' and mba.[trainee_session_status] = 'upcoming' and mba.[mentor_session_booking_date] < CAST(GETDATE() AS DATE);
`;

export const fetchSingleMentorProfileForPrivateQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_firstname] as mentor_firstname,
    u.[user_lastname] as mentor_lastname,
    u.[user_phone_number],
    m.[mentor_dtls_id],
    m.[mentor_email],
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
    m.[mentor_headline],
    m.[mentor_approved_status],
    m.[mentor_session_price],
    m.[mentor_currency_type],
    m.[mentor_city],
    m.[mentor_institute],
    m.[mentor_area_expertise],
    m.[mentor_passion_dtls],
    m.[mentor_domain],
    (
        SELECT 
            t.[mentor_timeslot_id],
            t.[mentor_dtls_id],
            t.[mentor_timeslot_day],
            t.[mentor_timeslot_from],
            t.[mentor_timeslot_to],
            t.[mentor_timeslot_rec_indicator],
            t.[mentor_timeslot_rec_end_timeframe],
            t.[mentor_timeslot_rec_cr_date],
            t.[mentor_timeslot_booking_status]
        FROM 
            [dbo].[mentor_timeslots_dtls] t
        WHERE 
            t.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS timeslot_list,
    (
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
            b.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS booking_dtls_list,
    ISNULL(
        (SELECT COUNT(*) 
        FROM [dbo].[mentor_feedback_dtls] f
        WHERE f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]),
        0
    ) AS feedback_count,
    (
        SELECT 
            f.[mentor_feedback_dtls_id],
            f.[mentor_appt_booking_dtls_id],
            f.[mentee_user_dtls_id],
            f.[mentor_feedback_detailed_fb],
            f.[mentor_feedback_add_fb_sugg],
            f.[mentor_feedback_session_overall_rating],
            f.[mentor_feedback_dtls_cr_date],
            mentee.[mentee_profile_pic_url],
            uma.[user_firstname] as mentee_firstname,
            uma.[user_lastname] as mentee_lastname
        FROM 
            [dbo].[mentor_feedback_dtls] f
        JOIN
            [dbo].[mentee_dtls] mentee
        ON
            f.[mentee_user_dtls_id] = mentee.[mentee_user_dtls_id] 
        JOIN 
            [dbo].[users_dtls] uma
        ON
            f.[mentee_user_dtls_id] = uma.[user_dtls_id]
        WHERE 
            f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]
        FOR JSON PATH
    ) AS feedback_details,
    (
        SELECT AVG(CAST(f.[mentor_feedback_session_overall_rating] AS FLOAT))
        FROM [dbo].[mentor_feedback_dtls] f
        WHERE f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]
    ) AS avg_mentor_rating
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
    ON u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE 
    u.[user_dtls_id] = @desired_mentor_dtls_id;
`;

export const autoApproveFetchAllNotApprovedMentorQuery = `WITH TimeslotDetails AS (
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
)

SELECT 
    u.[user_dtls_id] AS mentor_user_dtls_id,
    u.[user_email] AS mentor_email,
    u.[user_firstname] AS mentor_firstname,
    u.[user_lastname] AS mentor_lastname,
    u.[user_phone_number] AS mentor_phone_number,
    m.[mentor_dtls_id],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_years_of_experience],
    m.[mentor_country],
    m.[mentor_approved_status],
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
    ) AS total_progress
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m ON u.[user_dtls_id] = m.[mentor_user_dtls_id]
where 
    m.[mentor_approved_status] = 'No'

`;

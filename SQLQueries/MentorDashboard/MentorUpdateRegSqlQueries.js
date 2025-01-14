export const mentorDtlsUpdatedRegistrationQuery = `
INSERT INTO [dbo].[mentor_dtls] (
    [mentor_user_dtls_id],
    [mentor_phone_number],
    [mentor_email],
    [mentor_profile_photo],
    [mentor_social_media_profile],
    [mentor_job_title],
    [mentor_company_name],
    [mentor_years_of_experience],
    [mentor_academic_qualification],
    [mentor_recommended_area_of_mentorship],
    [mentor_guest_lectures_interest],
    [mentor_curating_case_studies_interest],
    [mentor_sessions_free_of_charge],
    [mentor_language],
    [mentor_timezone],
    [mentor_country],
    [mentor_headline],   
    [mentor_session_price],
    [mentor_currency_type],
    [mentor_city],
    [mentor_institute],
    [mentor_area_expertise],
    [mentor_passion_dtls],
    [mentor_domain],
    [mentor_linkedin_checked_status]
) OUTPUT INSERTED.mentor_dtls_id VALUES (
    @mentor_user_dtls_id,
    @mentor_phone_number,
    @mentor_email,
    @mentor_profile_photo,
    @mentor_social_media_profile,
    @mentor_job_title,
    @mentor_company_name,
    @mentor_years_of_experience,
    @mentor_academic_qualification,
    @mentor_recommended_area_of_mentorship,
    @mentor_guest_lectures_interest,
    @mentor_curating_case_studies_interest,
    @mentor_sessions_free_of_charge,
    @mentor_language,
    @mentor_timezone,
    @mentor_country,
    @mentor_headline,
    @mentor_session_price,
    @mentor_currency,
    @City,
    @Institute,
    @areaOfExpertise,
    @passionAbout,
    @mentorDomain,
    @mentor_linkedin_checked_status
);
`;

export const mentorDashboardSqlUpdateSqlQuery = `WITH FeedbackData AS (
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
        t.[mentor_timeslot_booking_status]
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
        c.[case_study_dtls_lesson],
        c.[case_study_dtls_people_after_read],
        c.[case_study_dtls_roles],
        c.[case_study_dtls_main_role],
        c.[case_study_dtls_main_challenge],
        c.[case_study_cr_date]
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
        WHERE t.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS timeslot_list,
    (
        SELECT 
            * 
        FROM NotificationDetails n
        WHERE n.[notification_user_dtls_id] = u.[user_dtls_id]
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

export const MentorRegistrationStep2SqlQuery = `UPDATE [dbo].[mentor_dtls]
SET
    [mentor_job_title] = @jobtitle,
    [mentor_company_name] = @companyName,
    [mentor_years_of_experience] = @experience,
    [mentor_recommended_area_of_mentorship] = @areaofmentorship,
    [mentor_timezone] = @Timezone,
    [mentor_headline] = @headline,
    [mentor_area_expertise] = @AreaOfexpertise,
    [mentor_passion_dtls] = @passionateAbout,
    [mentor_domain] = @Mentor_Domain
WHERE
    [mentor_dtls_id] = @mentor_dtls_id;
`;

export const MentorOnboardingFeedbackSqlQuery = `
INSERT INTO [dbo].[users_website_feedback_dtls] 
    ([user_website_feedback_user_dtls_id], 
     [user_website_feedback_dtls_name], 
     [user_website_feedback_rating], 
     [user_website_feedback_description])
VALUES 
    (@UserDtlsID, 
     @FeedbackName, 
     @FeedbackRating, 
     @FeedbackDescription);
`;
export const mentorDtlsUpdatedRegistrationQuery2 = `
INSERT INTO [dbo].[mentor_dtls] (
    [mentor_user_dtls_id],
    [mentor_phone_number],
    [mentor_email],
    [mentor_profile_photo],
    [mentor_social_media_profile],
    [mentor_job_title],
    [mentor_company_name],
    [mentor_years_of_experience],
    [mentor_academic_qualification],
    [mentor_recommended_area_of_mentorship],
    [mentor_guest_lectures_interest],
    [mentor_curating_case_studies_interest],
    [mentor_sessions_free_of_charge],
    [mentor_language],
    [mentor_timezone],
    [mentor_country],
    [mentor_headline],   
    [mentor_session_price],
    [mentor_currency_type],
    [mentor_city],
    [mentor_institute],
    [mentor_area_expertise],
    [mentor_passion_dtls],
    [mentor_domain],
    [mentor_linkedin_checked_status]
) OUTPUT INSERTED.mentor_dtls_id VALUES (
    @mentor_user_dtls_id,
    @mentor_phone_number,
    @mentor_email,
    @mentor_profile_photo,
    @mentor_social_media_profile,
    @mentor_job_title,
    @mentor_company_name,
    @mentor_years_of_experience,
    @mentor_academic_qualification,
    @mentor_recommended_area_of_mentorship,
    @mentor_guest_lectures_interest,
    @mentor_curating_case_studies_interest,
    @mentor_sessions_free_of_charge,
    @mentor_language,
    @mentor_timezone,
    @mentor_country,
    @mentor_headline,
    @mentor_session_price,
    @mentor_currency,
    @City,
    @Institute,
    @areaOfExpertise,
    @passionAbout,
    @mentorDomain,
    @mentor_linkedin_checked_status
);
`;
export const MentorRegistrationStep2SqlQuery2 = `UPDATE [dbo].[mentor_dtls]
SET
    [mentor_job_title] = @jobtitle,
    [mentor_years_of_experience] = @experience,
    [mentor_company_name] = @companyName,
    [mentor_domain] = @MentorDomain,
    [mentor_area_expertise] = @AreaOfexpertise,
    [mentor_passion_dtls] = @passionateAbout,
    [mentor_headline] = @headline,
    [mentor_recommended_area_of_mentorship] = @areaofmentorship,
    [mentor_timezone] = @Timezone,
    [mentor_currency_type] = @currency,
    [mentor_session_price] = @sessionprice,
    [mentor_guest_lectures_interest] = @guestlecturesinterest,
    [mentor_curating_case_studies_interest] = @casestudiesinterest,
    [mentor_sessions_free_of_charge] = @sessionsfreecharge,
    [mentor_institute] = @Institute,
    [mentor_country] = @country,
    [mentor_city] = @City,
    [mentor_timeslots_json] = @timeslotJson
WHERE
    [mentor_dtls_id] = @mentor_dtls_id;
`;

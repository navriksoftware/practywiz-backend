export const userDtlsQuery = `
    MERGE INTO [dbo].[users_dtls] AS target
    USING (VALUES 
        (@user_email, @user_pwd, @user_firstname, @user_lastname, 
        @user_phone_number, @user_status, 
        @user_type)
    ) AS source (user_email, user_pwd, user_firstname, user_lastname, 
                user_phone_number, user_status, 
                user_type)
    ON (target.user_email = source.user_email)
    -- Update if exists
    WHEN MATCHED THEN 
        UPDATE SET 
            target.user_pwd = source.user_pwd,
            target.user_firstname = source.user_firstname,
            target.user_lastname = source.user_lastname,
            target.user_phone_number = source.user_phone_number,
            target.user_status = source.user_status,
            target.user_type = source.user_type
    -- Insert if not exists
    WHEN NOT MATCHED THEN 
        INSERT ([user_email], [user_pwd], [user_firstname], 
                [user_lastname], [user_phone_number], 
                [user_status],[user_type])
        VALUES (source.user_email, source.user_pwd, 
                source.user_firstname, source.user_lastname, 
                source.user_phone_number, source.user_status,source.user_type )
    -- Output the inserted/updated record ID
    OUTPUT inserted.user_dtls_id;
`;

export const mentorRegistrationDtlsQuery = `
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
    [mentor_dtls_cr_date],
    [mentor_dtls_update_date],
    [mentor_headline],   
    [mentor_session_price],
    [mentor_currency_type],
    [mentor_city],
    [mentor_institute],
    [mentor_area_expertise],
    [mentor_passion_dtls],
    [mentor_domain]
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
    @mentor_dtls_cr_date,
    @mentor_dtls_update_date,
    @mentor_headline,
    @mentor_session_price,
    @mentor_currency,
    @City,
    @Institute,
    @areaOfExpertise,
    @passionAbout,
    @mentorDomain
);
`;

export const mentorExpertiseQuery = `
        INSERT INTO mentor_expertise_dtls 
        (mentor_dtls_id, mentor_expertise, mentor_exp_cr_date, mentor_exp_update_date)
        VALUES (@mentor_dtls_id, @mentor_expertise, @mentor_exp_cr_date, @mentor_exp_update_date)
`;
// fetch single mentor working
export const fetchSingleMentorQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_type],
    u.[user_is_superadmin],
    m.[mentor_dtls_id],
    m.[mentor_user_dtls_id],
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
    m.[mentor_institute],
    (
        SELECT 
            e.[mentor_expertise_id],
            e.[mentor_expertise],
            e.[mentor_exp_cr_date],
            e.[mentor_exp_update_date]
        FROM 
            [dbo].[mentor_expertise_dtls] e
        WHERE 
            e.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS expertise_list,
    (
        SELECT 
            p.[mentor_passion_id],
            p.[mentor_passion],
            p.[mentor_passion_cr_date],
            p.[mentor_passion_update_date],
            p.[mentor_passion_boolean]
        FROM 
            [dbo].[mentor_passion_dtls] p
        WHERE 
            p.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS passion_list,
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
    ) AS timeslot_list
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE 
    u.[user_dtls_id] = @desired_mentor_dtls_id 
AND
    m.[mentor_approved_status] = 'Yes'
`;
// fetch all mentor queries in the mentor club for card
export const fetchAllMentorQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    m.[mentor_dtls_id],
    m.[mentor_phone_number],
    m.[mentor_profile_photo],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_years_of_experience],
    m.[mentor_academic_qualification],
    m.[mentor_language],
    m.[mentor_timezone],
    m.[mentor_country],
    m.[mentor_session_price],
    m.[mentor_currency_type],
    m.[mentor_city],
    m.[mentor_institute],
    m.[mentor_passion_dtls],
    m.[mentor_area_expertise],
    m.[mentor_domain],
    (
        SELECT 
            t.[mentor_timeslot_id],
            t.[mentor_dtls_id],
            t.[mentor_timeslot_rec_indicator],
            t.[mentor_timeslot_rec_end_timeframe]
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
            b.[mentor_booking_confirmed],
            b.[mentor_session_status],
            b.[mentor_timeslot_dtls_id]
        FROM 
            [dbo].[mentor_booking_appointments_dtls] b
        WHERE 
            b.[mentor_dtls_id] = m.[mentor_dtls_id] 
            AND (b.[mentor_booking_confirmed] = 'Yes' OR b.[mentor_booking_confirmed] = 'No')
            AND b.[mentor_session_booking_date] >= CONVERT(DATE, GETDATE())  -- Only future or current bookings
        FOR JSON PATH
    ) AS booking_dtls_list,
    ISNULL(
        (SELECT COUNT(*) 
        FROM [dbo].[mentor_booking_appointments_dtls] b
        WHERE b.[mentor_dtls_id] = m.[mentor_dtls_id] 
          AND b.[mentor_session_status] = 'completed' 
          AND b.[trainee_session_status] = 'completed'),
        0
    ) AS mentor_session_count,
    ISNULL(
        (SELECT COUNT(*) 
        FROM [dbo].[mentor_feedback_dtls] f
        WHERE f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]),
        0
    ) AS feedback_count,
    (
        SELECT AVG(CAST(f.[mentor_feedback_session_overall_rating] AS FLOAT))
        FROM [dbo].[mentor_feedback_dtls] f
        WHERE f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]
    ) AS avg_mentor_rating
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE
    m.[mentor_approved_status] = 'Yes'
ORDER BY m.[mentor_dtls_id]  DESC;

`;

export const fetchMentorExpertQuery = `
SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    m.[mentor_dtls_id],
    m.[mentor_phone_number],
    m.[mentor_profile_photo],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_years_of_experience],
    m.[mentor_academic_qualification],
    m.[mentor_language],
    m.[mentor_timezone],
    m.[mentor_country],
    m.[mentor_session_price],
    m.[mentor_currency_type],
    m.[mentor_city],
    m.[mentor_institute],
    m.[mentor_passion_dtls],
    m.[mentor_area_expertise],
    m.[mentor_domain],
    (
        SELECT 
            t.[mentor_timeslot_id],
            t.[mentor_dtls_id],
            t.[mentor_timeslot_rec_indicator],
            t.[mentor_timeslot_rec_end_timeframe]
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
            b.[mentor_booking_confirmed],
            b.[mentor_session_status],
            b.[mentor_timeslot_dtls_id]
        FROM 
            [dbo].[mentor_booking_appointments_dtls] b
        WHERE 
            b.[mentor_dtls_id] = m.[mentor_dtls_id] 
            AND (b.[mentor_booking_confirmed] = 'Yes' OR b.[mentor_booking_confirmed] = 'No')
            AND b.[mentor_session_booking_date] >= CONVERT(DATE, GETDATE())  -- Only future or current bookings
        FOR JSON PATH
    ) AS booking_dtls_list,
    ISNULL(
        (SELECT COUNT(*) 
        FROM [dbo].[mentor_booking_appointments_dtls] b
        WHERE b.[mentor_dtls_id] = m.[mentor_dtls_id] 
          AND b.[mentor_session_status] = 'completed' 
          AND b.[trainee_session_status] = 'completed'),
        0
    ) AS mentor_session_count,
    ISNULL(
        (SELECT COUNT(*) 
        FROM [dbo].[mentor_feedback_dtls] f
        WHERE f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]),
        0
    ) AS feedback_count,
    (
        SELECT AVG(CAST(f.[mentor_feedback_session_overall_rating] AS FLOAT))
        FROM [dbo].[mentor_feedback_dtls] f
        WHERE f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]
    ) AS avg_mentor_rating
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
CROSS APPLY 
    OPENJSON(m.[mentor_area_expertise]) 
    WITH (
        id INT '$.id'
    ) AS jsonData
WHERE
    m.[mentor_approved_status] = 'Yes'
    AND jsonData.id = @SearchID;  -- Only return rows where JSON id matches the given ID
`;

export const fetchNavbarMentorExpertQuery = `SELECT DISTINCT
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    m.[mentor_dtls_id],
    m.[mentor_phone_number],
    CAST(m.[mentor_profile_photo] AS NVARCHAR(MAX)) AS mentor_profile_photo,
    CAST(m.[mentor_job_title] AS NVARCHAR(MAX)) AS mentor_job_title,
    CAST(m.[mentor_company_name] AS NVARCHAR(MAX)) AS mentor_company_name,
    m.[mentor_years_of_experience],
    m.[mentor_academic_qualification],
    m.[mentor_language],
    m.[mentor_timezone],
    m.[mentor_country],
    m.[mentor_session_price],
    m.[mentor_currency_type],
    m.[mentor_city],
    m.[mentor_institute],
    CAST(m.[mentor_passion_dtls] AS NVARCHAR(MAX)) AS mentor_passion_dtls,
    CAST(m.[mentor_area_expertise] AS NVARCHAR(MAX)) AS mentor_area_expertise,
    CAST(m.[mentor_domain] AS NVARCHAR(MAX)) AS mentor_domain,
    (
        SELECT 
            t.[mentor_timeslot_id],
            t.[mentor_dtls_id],
            t.[mentor_timeslot_rec_indicator],
            t.[mentor_timeslot_rec_end_timeframe]
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
            b.[mentor_booking_confirmed],
            b.[mentor_session_status],
            b.[mentor_timeslot_dtls_id]
        FROM 
            [dbo].[mentor_booking_appointments_dtls] b
        WHERE 
            b.[mentor_dtls_id] = m.[mentor_dtls_id] 
            AND (b.[mentor_booking_confirmed] = 'Yes' OR b.[mentor_booking_confirmed] = 'No')
            AND b.[mentor_session_booking_date] >= CONVERT(DATE, GETDATE())  -- Only future or current bookings
        FOR JSON PATH
    ) AS booking_dtls_list,
    ISNULL(
        (SELECT COUNT(*) 
        FROM [dbo].[mentor_booking_appointments_dtls] b
        WHERE b.[mentor_dtls_id] = m.[mentor_dtls_id] 
          AND b.[mentor_session_status] = 'completed' 
          AND b.[trainee_session_status] = 'completed'),
        0
    ) AS mentor_session_count,
    ISNULL(
        (SELECT COUNT(*) 
        FROM [dbo].[mentor_feedback_dtls] f
        WHERE f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]),
        0
    ) AS feedback_count,
    (
        SELECT AVG(CAST(f.[mentor_feedback_session_overall_rating] AS FLOAT))
        FROM [dbo].[mentor_feedback_dtls] f
        WHERE f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]
    ) AS avg_mentor_rating
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
JOIN 
    mentors_keyword_mapping km ON km.mentor_keyword_mapping_category = @SearchCategory
WHERE
    m.[mentor_approved_status] = 'Yes'
    AND LOWER(m.[mentor_job_title]) LIKE '%' + LOWER(km.mentor_keyword_mapping_keyword) + '%';`;
// to fetch the booking details and timeslots feedbacks also and everything this is working right now
export const fetchSingleMentorQueryWithBookings = `SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    m.[mentor_dtls_id],
    m.[mentor_user_dtls_id],
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
    (
        SELECT 
            e.[mentor_expertise_id],
            e.[mentor_expertise],
            e.[mentor_exp_cr_date],
            e.[mentor_exp_update_date]
        FROM 
            [dbo].[mentor_expertise_dtls] e
        WHERE 
            e.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS expertise_list,
    (
        SELECT 
            p.[mentor_passion_id],
            p.[mentor_passion],
            p.[mentor_passion_cr_date],
            p.[mentor_passion_update_date],
            p.[mentor_passion_boolean]
        FROM 
            [dbo].[mentor_passion_dtls] p
        WHERE 
            p.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS passion_list,
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
            f.[mentor_feedback_session_relevant],
            f.[mentor_feedback_communication_skills],
            f.[mentor_feedback_session_appropriate],
            f.[mentor_feedback_detailed_fb],
            f.[mentor_feedback_add_fb_sugg],
            f.[mentor_feedback_another_session],
            f.[mentor_feedback_session_overall_rating]
        FROM 
            [dbo].[mentor_feedback_dtls] f
        WHERE 
            f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]
        FOR JSON PATH
    ) AS feedback_details
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
    ON u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE 
    u.[user_dtls_id] = @desired_mentor_dtls_id 
AND 
    m.[mentor_approved_status] = 'Yes';

`;

export const fetchSingleMentorProfileForPublicQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email] as mentor_email,
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
            t.[mentor_timeslot_rec_start_timeframe],
            t.[mentor_timeslot_booking_status],
            t.[mentor_timeslot_duration],
            t.[mentor_timeslot_status]
        FROM 
            [dbo].[mentor_timeslots_dtls] t
        WHERE 
            t.[mentor_dtls_id] = m.[mentor_dtls_id] and t.[mentor_timeslot_status] = 'unarchieve'
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
    u.[user_dtls_id] = @desired_mentor_dtls_id
AND 
    m.[mentor_approved_status] = 'Yes';
`;
// Prepare the SQL query
export const MentorBookingOrderQuery = `
            INSERT INTO [dbo].[mentor_bookings_raz_order_dtls] 
            (
                [mentor_booking_raz_dlts_id],
                [mentee_booking_raz_user_dtls_id],
                [mentee_email],
                [amount],
                [amount_due],
                [amount_paid],
                [attempts],
                [created_at],
                [currency],
                [entity],
                [id],
                [offer_id],
                [receipt],
                [status],
                [mentor_bookings_raz_order_type]
            ) 
            VALUES 
            (
                @mentorBookingRazDltsId,
                @menteeBookingRazUserDtlsId,
                @menteeEmail,
                @amount,
                @amountDue,
                @amountPaid,
                @attempts,
                @createdAt,
                @currency,
                @entity,
                @id,
                @offerId,
                @receipt,
                @status,
                @type
            )
        `;

export const RazorpayBookingOrderQuery = `
            INSERT INTO [dbo].[razorpay_booking_order_dtls] 
            (
                [razorpay_booking_order_dtls_mc_id],
                [razorpay_booking_order_dtls_user_id],
                [user_email],
                [amount],
                [amount_due],
                [amount_paid],
                [attempts],
                [created_at],
                [currency],
                [entity],
                [id],
                [offer_id],
                [receipt],
                [status],
                [razorpay_booking_order_dtls_type]
            ) 
            VALUES 
            (
                @bookingMCRazDltsId,
                @bookingRazUserDtlsId,
                @userEmail,
                @amount,
                @amountDue,
                @amountPaid,
                @attempts,
                @createdAt,
                @currency,
                @entity,
                @id,
                @offerId,
                @receipt,
                @status,
                @type
            )
        `;
// Prepare the SQL query
export const MentorBookingAppointmentQuery = `
            INSERT INTO [dbo].[mentor_booking_appointments_dtls] 
            (
                [mentor_dtls_id],
                [mentee_user_dtls_id],
                [mentor_session_booking_date],
                [mentor_booked_date],
                [mentor_booking_starts_time],
                [mentor_booking_end_time],
                [mentor_booking_time],
                [mentor_amount],
                [mentor_options],
                [mentor_questions],
                [mentor_razorpay_payment_id],
                [mentor_razorpay_order_id],
                [mentor_razorpay_signature],
                [mentor_host_url],
                [trainee_join_url],
                [mentor_amount_paid_status],
                [mentor_timeslot_dtls_id]
            ) 
            VALUES 
            (
                @mentorDtlsId,
                @menteeUserDtlsId,
                @mentorSessionBookingDate,
                @mentorBookedDate,
                @mentorBookingStartsTime,
                @mentorBookingEndTime,
                @mentorBookingTime,
                @mentorAmount,
                @mentorOptions,
                @mentorQuestions,
                @mentorRazorpayPaymentId,
                @mentorRazorpayOrderId,
                @mentorRazorpaySignature,
                @mentorHostUrl,
                @traineeJoinUrl,
                @mentorAmountPaidStatus,
                @mentorTimeslotId
            )
        `;

// fetch top 10 mentor queries in Home page
export const fetch10MentorQuery = `SELECT TOP 10
    u.[user_dtls_id],
    u.[user_email] AS mentor_email,
    u.[user_firstname] AS mentor_firstname,
    u.[user_lastname] AS mentor_lastname,
    u.[user_type],
    m.[mentor_user_dtls_id],
    m.[mentor_profile_photo],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_language],
    m.[mentor_country],
    m.[mentor_headline],
    m.[mentor_approved_status],
    COUNT(mfd.[mentor_user_dtls_id]) AS feedback_count,
    AVG(mfd.[mentor_feedback_session_overall_rating]) AS avg_feedback_rating
FROM 
    [dbo].[users_dtls] u
LEFT JOIN 
    [dbo].[mentor_dtls] m
    ON u.[user_dtls_id] = m.[mentor_user_dtls_id]
LEFT JOIN 
    [dbo].[mentor_feedback_dtls] mfd
    ON m.[mentor_user_dtls_id] = mfd.[mentor_user_dtls_id]
WHERE
    m.[mentor_approved_status] = 'Yes'
GROUP BY
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_type],
    m.[mentor_user_dtls_id],
    m.[mentor_profile_photo],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_language],
    m.[mentor_country],
    m.[mentor_headline],
    m.[mentor_approved_status]
ORDER BY
    feedback_count DESC;
`;

export const fetchGuestLecturesQuery = `SELECT
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
    m.[mentor_guest_lectures_interest],
    m.[mentor_curating_case_studies_interest],
    m.[mentor_sessions_free_of_charge],
    m.[mentor_language],
    m.[mentor_country],
    m.[mentor_approved_status],
    (
        SELECT 
            e.[mentor_expertise_id],
            e.[mentor_expertise],
            e.[mentor_exp_cr_date],
            e.[mentor_exp_update_date]
        FROM 
            [dbo].[mentor_expertise_dtls] e
        WHERE 
            e.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS expertise_list
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE
    m.[mentor_approved_status] = 'Yes' AND m.[mentor_guest_lectures_interest] = 'Yes' 
`;

// end of queries
export const testQuery = `SELECT 
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
    (
        SELECT 
            e.[mentor_expertise_id],
            e.[mentor_expertise],
            e.[mentor_exp_cr_date],
            e.[mentor_exp_update_date]
        FROM 
            [dbo].[mentor_expertise_dtls] e
        WHERE 
            e.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS expertise_list,
    (
        SELECT 
            p.[mentor_passion_id],
            p.[mentor_passion],
            p.[mentor_passion_cr_date],
            p.[mentor_passion_update_date],
            p.[mentor_passion_boolean]
        FROM 
            [dbo].[mentor_passion_dtls] p
        WHERE 
            p.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS passion_list,
    (
        SELECT 
            t.[mentor_timeslot_id],
            t.[mentor_dtls_id],
            t.[mentor_timeslot_day],
            t.[mentor_timeslot_from],
            t.[mentor_timeslot_to],
            t.[mentor_timeslot_rec_indicator],
            t.[mentor_timeslot_rec_end_timeframe],
            t.[mentor_timeslot_rec_cr_date]
        FROM 
            [dbo].[mentor_timeslots_dtls] t
        WHERE 
            t.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS timeslot_list
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
`;

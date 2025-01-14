// test queries
export const mentorSelectSQLQuery = `
SELECT 
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
    u.[user_dtls_id],
    u.[user_email],
    u.[user_pwd],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_type],
    u.[user_is_superadmin]
FROM 
    [dbo].[mentor_dtls] m
INNER JOIN 
    [dbo].[users_dtls] u
ON 
    m.[mentor_user_dtls_id] = u.[user_dtls_id]
WHERE 
    m.[mentor_approved_status] = 'Yes';

`;

export const newQuery = `SELECT 
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
    STRING_AGG(p.[mentor_passion], ', ') AS mentor_passions,
    STRING_AGG(e.[mentor_expertise], ', ') AS mentor_expertise,
    STRING_AGG(
        t.[mentor_timeslot_day] + ' ' +
        t.[mentor_timeslot_from] + '-' +
        t.[mentor_timeslot_to] + ' (' +
        t.[mentor_timeslot_rec_indicator] + ', ' +
        t.[mentor_timeslot_rec_end_timeframe] + ', ' +
        t.[mentor_timeslot_booking_status] + ')', '; '
    ) AS mentor_timeslots
FROM 
    [dbo].[mentor_dtls] m
LEFT JOIN 
    [dbo].[mentor_passion_dtls] p ON m.[mentor_dtls_id] = p.[mentor_dtls_id]
LEFT JOIN 
    [dbo].[mentor_expertise_dtls] e ON m.[mentor_dtls_id] = e.[mentor_dtls_id]
LEFT JOIN 
    [dbo].[mentor_timeslots_dtls] t ON m.[mentor_dtls_id] = t.[mentor_dtls_id]
WHERE 
    m.[mentor_approved_status] = 'Yes'
GROUP BY
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
    m.[mentor_approved_status];
`;

export const createQuery = `SELECT 
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
    m.[mentor_headline],
    m.[mentor_approved_status],
    e.[mentor_expertise_id],
    e.[mentor_expertise],
    p.[mentor_passion_id],
    p.[mentor_passion],
    t.[mentor_timeslot_id],
    t.[mentor_timeslot_day],
    t.[mentor_timeslot_from],
    t.[mentor_timeslot_to],
    t.[mentor_timeslot_rec_indicator],
    t.[mentor_timeslot_rec_end_timeframe],
    t.[mentor_timeslot_booking_status]
FROM 
    [dbo].[mentor_dtls] m
LEFT JOIN 
    [dbo].[mentor_expertise_dtls] e ON m.[mentor_dtls_id] = e.[mentor_dtls_id]
LEFT JOIN 
    [dbo].[mentor_passion_dtls] p ON m.[mentor_dtls_id] = p.[mentor_dtls_id]
LEFT JOIN 
    [dbo].[mentor_timeslots_dtls] t ON m.[mentor_dtls_id] = t.[mentor_dtls_id];
`;
export const testQuery2 = `SELECT 
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
            e.[mentor_expertise]
        FROM 
            [dbo].[mentor_expertise_dtls] e
        WHERE 
            e.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS expertise_list,
    (
        SELECT 
            p.[mentor_passion_id],
            p.[mentor_passion]
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
    [dbo].[mentor_dtls] m
WHERE 
    m.[mentor_dtls_id] = 12  -- Replace with the specific mentor_dtls_id you want to fetch

`;


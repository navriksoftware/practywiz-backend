// showing the sql queries in the homepage

export const ShowTop10MentorsInHomeQuery = `SELECT TOP 10
    u.[user_dtls_id],
    u.[user_firstname] as mentor_firstname,
    u.[user_lastname] as mentor_lastname,
    m.[mentor_profile_photo],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_years_of_experience],
    m.[mentor_headline],
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
    ON u.[user_dtls_id] = m.[mentor_user_dtls_id]
AND 
    m.[mentor_approved_status] = 'Yes';
`;

export const fetchInstituteSingleDashboardQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email] AS institute_email,
    u.[user_firstname] AS institute_firstname,
    u.[user_lastname] AS institute_lastname,
    u.[user_phone_number] AS institute_phone_number,
    u.[user_type],
    i.[institute_dtls_id],
    i.[institute_name],
    i.[institute_about],
    i.[institute_profile_pic],
    i.[institute_dtls_cr_date],
    i.[institute_dtls_update_date],
    i.[institute_code],
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
    ) AS notification_list
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[institute_dtls] i
ON 
    u.[user_dtls_id] = i.[institute_user_dtls_id]
WHERE 
    u.[user_dtls_id] = @instituteUserId;

`;
export const fetchfacultyDetailsDashboardQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email] AS faculty_email,
    u.[user_firstname] AS faculty_firstname,
    u.[user_lastname] AS faculty_lastname,
    u.[user_phone_number] AS faculty_phone_number,
    u.[user_type],
    f.[faculty_user_dtls_id],
    f.[faculty_about],
    f.[faculty_profile_pic],
    f.[faculty_dtls_cr_date],
    f.[faculty_dtls_update_date],
    f.[faculty_institute_name],
    f.[faculty_institute_code]
    
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[faculty_dtls] f
ON 
    u.[user_dtls_id] = f.[faculty_user_dtls_id]
WHERE 
    f.[faculty_institute_code] = @institute_Code;
`;
export const fetchSinglefacultyDetailsQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email] AS faculty_email,
    u.[user_firstname] AS faculty_firstname,
    u.[user_lastname] AS faculty_lastname,
    u.[user_phone_number] AS faculty_phone_number,
    u.[user_type],
    f.[faculty_user_dtls_id],
    f.[faculty_about],
    f.[faculty_profile_pic],
    f.[faculty_dtls_cr_date],
    f.[faculty_dtls_update_date],
    f.[faculty_institute_name],
    f.[faculty_institute_code]
    
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[faculty_dtls] f
ON 
    u.[user_dtls_id] = f.[faculty_user_dtls_id]
WHERE 
    f.[faculty_user_dtls_id] = @faculty_id;
`;

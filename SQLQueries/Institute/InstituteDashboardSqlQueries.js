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
    f.[faculty_dtls_id],
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
    -- User Details
    u.[user_dtls_id],
    u.[user_email] AS faculty_email,
    u.[user_firstname] AS faculty_firstname,
    u.[user_lastname] AS faculty_lastname,
    u.[user_phone_number] AS faculty_phone_number,
    
    -- Faculty Details
    f.[faculty_dtls_id],
    f.[faculty_user_dtls_id],
    f.[faculty_about],
    f.[faculty_profile_pic],
    f.[faculty_dtls_cr_date],
    f.[faculty_institute_name],
    f.[faculty_institute_code],

    -- Case Study Assignment Details
    ica.[institute_case_assign_dtls_id],
    ica.[institute_case_assign_institute_dtls_id],
    ica.[institute_case_assign_case_study_id],
    ica.[institute_case_assign_faculty_dtls_id],
   

    -- Case Study Details
    cs.[case_study_id],
    cs.[case_study_categories],
    cs.[case_study_title],
    cs.[case_study_lesson],
    cs.[case_study_future_skills],
    cs.[case_study_num_characters],
    cs.[case_study_roles],
    cs.[case_study_main_character_role],
    cs.[case_study_challenge],
    cs.[case_study_content],
    cs.[case_study_questions],
    cs.[case_study_video_link],
    cs.[case_study_image_link],
    cs.[case_study_price],
    cs.[case_study_rating]

FROM 
    [dbo].[faculty_dtls] f
JOIN 
    [dbo].[users_dtls] u
    ON f.[faculty_user_dtls_id] = u.[user_dtls_id]
LEFT JOIN 
    [dbo].[institute_case_assign_dtls] ica
    ON f.[faculty_dtls_id] = ica.[institute_case_assign_faculty_dtls_id]
LEFT JOIN 
    [dbo].[case_study_details] cs
    ON ica.[institute_case_assign_case_study_id] = cs.[case_study_id]
WHERE 
    f.[faculty_dtls_id] = @faculty_id;

`;
export const fetchCaseStudiesListForInstituteQuery = `SELECT 
    a.institute_case_assign_dtls_id,
    a.institute_case_assign_institute_dtls_id,
    a.institute_case_assign_case_study_id,   
    b.case_study_title,
    b.case_study_categories,
    b.case_study_lesson,
    b.case_study_future_skills,
    b.case_study_num_characters,
    b.case_study_roles,
    b.case_study_main_character_role,
    b.case_study_challenge,
    b.case_study_content,
    b.case_study_questions,
    b.case_study_video_link,
    b.case_study_image_link,
    b.case_study_price,
    b.case_study_rating
FROM 
    dbo.institute_case_assign_dtls AS a
INNER JOIN 
    dbo.case_study_details AS b
    ON a.institute_case_assign_case_study_id = b.case_study_id
WHERE 
    a.institute_case_assign_institute_dtls_id = @institute_Id;

`;

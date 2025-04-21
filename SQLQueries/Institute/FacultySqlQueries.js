
export const createClassQuery = `INSERT INTO [dbo].[class_dtls]
(
    [class_name],
    [class_subject],
    [class_subject_code],
    [class_sem_end_date],
    [class_faculty_dtls_id]
)
VALUES
(
    @class_name,
    @subject_name,
    @subject_code,
    @semister_end,
    @faculty_id
)`;

export const fetchFacultySingleDashboardQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email] as faculty_email,
    u.[user_firstname] as faculty_firstname,
    u.[user_lastname] as faculty_lastname,
    u.[user_phone_number] as faculty_phone_number,
    u.[user_type] ,
    u.[user_is_superadmin],
    f.[faculty_dtls_id],
    f.[faculty_user_dtls_id],
    f.[faculty_about],
    f.[faculty_profile_pic],
    f.[faculty_dtls_cr_date],
    f.[faculty_dtls_update_date],
    f.[faculty_institute_name],
    f.[faculty_institute_code],
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
    [dbo].[faculty_dtls] f
ON 
    u.[user_dtls_id] = f.[faculty_user_dtls_id]
WHERE 
    u.[user_dtls_id] = @FacultyUserId`;


export const fetchFacultyClassQuery = `SELECT 
    
      [class_dtls_id],
      [class_name],
      [class_subject],
      [class_subject_code],
      [class_sem_end_date],
      [class_faculty_dtls_id],
      [class_dtls_cr_date],
      [class_dtls_update_date],
      [class_status]
FROM 
    [dbo].[class_dtls]

WHERE 
    [class_faculty_dtls_id] = @FacultyUserId`;

export const fetchFacultySingleClassQuery = `SELECT 
    
      [class_dtls_id],
      [class_name],
      [class_subject],
      [class_subject_code],
      [class_sem_end_date],
      [class_faculty_dtls_id],
      [class_dtls_cr_date],
      [class_dtls_update_date],
      [class_status]
FROM 
    [dbo].[class_dtls]

WHERE 
    [class_dtls_id] = @single_classId`;

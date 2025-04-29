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


export const fetchFacultySingleClassUpdateQuery = `UPDATE [dbo].[class_dtls]
SET 
    [class_name] = @class_name,
    [class_subject] = @class_subject,
    [class_subject_code] = @class_subject_code,
    [class_sem_end_date] = @class_sem_end_date,
    [class_dtls_update_date] = GETDATE()
    
WHERE 
    [class_dtls_id] = @single_ClassId`;

export const MenteeRegisterByFacultyQuery = `
          INSERT INTO [dbo].[mentee_dtls] (
            [mentee_user_dtls_id],
            [mentee_about],
            [mentee_skills],
            [mentee_gender],
            [mentee_type],
            [mentee_profile_pic_url],
            [mentee_institute_details],
            [mentee_roll_no]
        ) OUTPUT INSERTED.mentee_dtls_id VALUES (
            @menteeUserDtlsId,
            @menteeAbout,
            @menteeSkills,
            @menteeGender,
            @menteeType,
            @menteeProfilePic,
            @menteeInstitute,
            @menteeRollNumber
        );
`;

export const fetchStudentListofClassQuery = `
SELECT 
     u.[user_dtls_id],
     u.[user_email],
     u.[user_firstname],
     u.[user_lastname],
     u.[user_phone_number],
     m.[mentee_dtls_id],
     m.[mentee_about],
     m.[mentee_skills],
     m.[mentee_gender],
     m.[mentee_profile_pic_url],
     m.[mentee_institute_details],
     m.[mentee_roll_no],
     m.[mentee_institute_code]
FROM [dbo].[class_mentee_mapping] cm
JOIN [dbo].[mentee_dtls] m ON cm.[mentee_dtls_id] = m.[mentee_dtls_id]
JOIN [dbo].[users_dtls] u ON m.[mentee_user_dtls_id] = u.[user_dtls_id]
WHERE cm.[class_dtls_id] = @classId
`;

export const AvailableCaseStudiesForfacultyQuery = `SELECT 
    a.institute_case_assign_dtls_id,
    a.institute_case_assign_institute_dtls_id,
    a.institute_case_assign_case_study_id,
    a.institute_case_assign_faculty_dtls_id,
    a.institute_case_assign_cr_date,
    a.institute_case_assign_update_date,
    
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
    a.institute_case_assign_faculty_dtls_id = @faculty_Id;
`;

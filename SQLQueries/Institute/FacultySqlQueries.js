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

export const fetchSinglePractywizCaseStudyQuery = `SELECT 
   
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
   
    [dbo].[case_study_details] cs
WHERE 
   
    cs.[case_study_id] = @caseStudy_Id;
`;
export const fetchSingleNonPractywizCaseStudyQuery = `
 SELECT 
    [non_practywiz_case_dtls_id],
    [non_practywiz_case_title],
    [non_practywiz_case_author],
    [non_practywiz_case_category],
    [non_practywiz_case_question],
    [non_practywiz_case_faculty_dtls_id],
    [non_practywiz_case_cr_date],
    [non_practywiz_case_update_date]
FROM 
    [dbo].[non_practywiz_case_dtls]
WHERE 
    [non_practywiz_case_dtls_id] = @caseStudy_Id;

`;

export const fetchClassListDataQuery = `SELECT
    c.[class_dtls_id],
    c.[class_name],
    c.[class_subject],
    c.[class_subject_code],
    c.[class_sem_end_date],
    c.[class_faculty_dtls_id],
    c.[class_dtls_cr_date],
    c.[class_dtls_update_date],
    c.[class_status]
FROM

    [dbo].[class_dtls] c    
WHERE
    c.[class_faculty_dtls_id] = @faculty_Id
    
   `;
export const fetchStudentListDataQuery = `SELECT
  cm.class_dtls_id,
  cd.class_name,
  cd.class_subject,
  cd.class_subject_code,
  cd.class_faculty_dtls_id,

  m.mentee_dtls_id,
  m.mentee_about,
  m.mentee_skills,
  m.mentee_gender,
  m.mentee_type,
  m.mentee_profile_pic_url,
  m.mentee_institute_details,
  m.mentee_language,
  m.mentee_roll_no,

  u.user_dtls_id,
  u.user_firstname,
  u.user_lastname,
  u.user_email,
  u.user_phone_number

FROM class_mentee_mapping cm
JOIN mentee_dtls m ON cm.mentee_dtls_id = m.mentee_dtls_id
JOIN users_dtls u ON m.mentee_user_dtls_id = u.user_dtls_id
JOIN class_dtls cd ON cm.class_dtls_id = cd.class_dtls_id
WHERE cm.class_dtls_id =@class_id;
 

    
   `;

export const assignCaseStudyToClassQuery = `
   Insert into faculty_case_assign_dtls (
       [faculty_case_assign_faculty_dtls_id]
       ,[faculty_case_assign_class_dtls_id]
      ,[faculty_case_assign_case_study_id]
      ,[faculty_case_assign_start_date]
      ,[faculty_case_assign_end_date]
      ,[faculty_case_assign_owned_by_practywiz]
      ,[faculty_case_assign_fact_question_time]
      ,[faculty_case_assign_analysis_question_time]
      ,[faculty_case_assign_class_start_date]
      ,[faculty_case_assign_class_end_date]
      ,[faculty_case_assign_fact_question_qty]
      ,[faculty_case_assign_analysis_question_qty]
      ,[faculty_case_assign_question_distribution]
      ,[faculty_case_assign_cr_date]
      ,faculty_case_assign_update_date
      ) VALUES(
       @faculty_Id,
       @class_id,
       @caseStudy_Id,
       @startDateTime,
       @deadline,
       @owned_by_who,
       @factTiming,
       @analysisTiming,
       @classStart,
       @classEnd,
       @factQuestions,
       @analysisQuestions,
       @questionType,
         GETDATE(),
         GETDATE()
       )
   `;

export const insertNonPractywizCaseStudyQuery = `
  INSERT INTO non_practywiz_case_dtls
    (non_practywiz_case_title, non_practywiz_case_author, non_practywiz_case_category, non_practywiz_case_question, non_practywiz_case_faculty_dtls_id)
  VALUES
    (@title, @author, @category, @questions, @facultyId)
`;

export const getNonPractywizCaseStudiesByFacultyQuery = `
  SELECT 
    non_practywiz_case_dtls_id,
    non_practywiz_case_title,
    non_practywiz_case_author,
    non_practywiz_case_category,
    non_practywiz_case_faculty_dtls_id,
    non_practywiz_case_cr_date,
    non_practywiz_case_update_date
  FROM non_practywiz_case_dtls
  WHERE non_practywiz_case_faculty_dtls_id = @facultyId
  ORDER BY non_practywiz_case_cr_date DESC
`;

export const fetchAssignCaseStudiesDetailsQuery = `
SELECT
    fca.faculty_case_assign_dtls_id,
    fca.faculty_case_assign_case_study_id AS case_id,
    CASE
        WHEN fca.faculty_case_assign_owned_by_practywiz = 1 THEN cs.case_study_title
        WHEN fca.faculty_case_assign_owned_by_practywiz = 0 THEN npc.non_practywiz_case_title
    END AS case_title,
    cd.class_name,
    cd.class_subject_code AS class_code,
    (SELECT COUNT(*) FROM class_mentee_mapping cmm WHERE cmm.class_dtls_id = cd.class_dtls_id) AS number_of_students,
    fca.faculty_case_assign_end_date AS due_date,
    CASE
        WHEN fca.faculty_case_assign_owned_by_practywiz = 1 THEN 'Practywiz'
        WHEN fca.faculty_case_assign_owned_by_practywiz = 0 THEN 'Non-Practywiz'
    END AS case_type,
    fca.faculty_case_assign_faculty_dtls_id,
    fca.faculty_case_assign_class_dtls_id,
    fca.faculty_case_assign_start_date,
    fca.faculty_case_assign_fact_question_time,
    fca.faculty_case_assign_analysis_question_time,
    fca.faculty_case_assign_class_start_date,
    fca.faculty_case_assign_class_end_date,
    fca.faculty_case_assign_fact_question_qty,
    fca.faculty_case_assign_analysis_question_qty,
    fca.faculty_case_assign_question_distribution
FROM
    dbo.faculty_case_assign_dtls fca
LEFT JOIN
    dbo.case_study_details cs ON fca.faculty_case_assign_case_study_id = cs.case_study_id
    AND fca.faculty_case_assign_owned_by_practywiz = 1
LEFT JOIN
    dbo.non_practywiz_case_dtls npc ON fca.faculty_case_assign_case_study_id = npc.non_practywiz_case_dtls_id
    AND fca.faculty_case_assign_owned_by_practywiz = 0
JOIN
    dbo.class_dtls cd ON fca.faculty_case_assign_class_dtls_id = cd.class_dtls_id
WHERE
    fca.faculty_case_assign_faculty_dtls_id = @FacultyId
ORDER BY
    fca.faculty_case_assign_end_date;
`;
export const fetchCaseStudiesQuery = `
SELECT 
    
    f.[faculty_case_assign_case_study_id],
    f.[faculty_case_assign_class_dtls_id],
    f.[faculty_case_assign_start_date],
    f.[faculty_case_assign_end_date],
    f.[faculty_case_assign_owned_by_practywiz],

    -- Practywiz Case Study Details (if owned_by_practywiz = 1)
    c.[case_study_id],
    c.[case_study_title],
    c.[case_study_categories],
    c.[case_study_lesson],
    c.[case_study_future_skills],
    c.[case_study_num_characters],
    c.[case_study_roles],
    c.[case_study_main_character_role],
    c.[case_study_challenge],
    c.[case_study_content],
   

    -- Non-Practywiz Case Study Details (if owned_by_practywiz = 0)
    n.[non_practywiz_case_dtls_id],
    n.[non_practywiz_case_title],
    n.[non_practywiz_case_author],
    n.[non_practywiz_case_category]

FROM 
    [dbo].[faculty_case_assign_dtls] f
LEFT JOIN 
    [dbo].[case_study_details] c 
    ON f.[faculty_case_assign_case_study_id] = c.[case_study_id]
    AND f.[faculty_case_assign_owned_by_practywiz] = 1
LEFT JOIN 
    [dbo].[non_practywiz_case_dtls] n 
    ON f.[faculty_case_assign_case_study_id] = n.[non_practywiz_case_dtls_id]
    AND f.[faculty_case_assign_owned_by_practywiz] = 0
WHERE 
    f.[faculty_case_assign_class_dtls_id] = @single_classId;


`;


export const getSingleNonPractywizCaseStudyQuery = `
  SELECT * FROM non_practywiz_case_dtls
  WHERE non_practywiz_case_dtls_id = @caseStudyId
`;
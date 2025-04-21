export const EmployerOrganizationDtlsSqlQuery = `
INSERT INTO [dbo].[employer_organization_dtls] (
    [employer_organization_user_dtls_id],
    [employer_organization_email],
    [employer_organization_name],
    [employer_organization_desc],
    [employer_organization_logo],
    [employer_organization_industry],
    [employer_organization_location],
    [employer_organization_no_of_emp]
) OUTPUT INSERTED.employer_organization_dtls_id VALUES (
    @employerUserDtlsId,
    @employerEmail,
    @employerOrgName,
    @employerOrgDesc,
    @employerOrgLogo,
    @employerOrgIndustry,
    @employerOrgLocation,
    @employerOrgNoOfEmp
);
`;

export const fetchEmployerSingleDashboardQuery = `WITH NotificationDetails AS (
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
InternshipPosts AS (
    SELECT 
        ei.[employer_internship_post_dtls_id],
        ei.[employer_internship_post_org_dtls_id],
        ei.[employer_internship_post_supervision_type],
        ei.[employer_internship_post_position],
        ei.[employer_internship_post_status],
        ei.[employer_internship_post_cr_date]
    FROM 
        [dbo].[employer_internship_posts_dtls] ei
    WHERE 
        ei.[employer_internship_post_user_dtls_id] = @employerUserDtlsId
)

SELECT 
    u.[user_dtls_id] AS employer_user_dtls_id,
    u.[user_email] AS employer_email,
    u.[user_firstname] AS employer_firstname,
    u.[user_lastname] AS employer_lastname,
    u.[user_phone_number] AS employer_phone_number,
    e.[employer_organization_dtls_id],
    e.[employer_organization_user_dtls_id],
    e.[employer_organization_email],
    e.[employer_organization_website],
    e.[employer_organization_linkedin],
    e.[employer_organization_designation],
    CAST(e.[employer_organization_complete_address] AS VARCHAR(MAX)) AS employer_organization_complete_address,
    CAST(e.[employer_organization_name] AS VARCHAR(MAX)) AS employer_organization_name,
    CAST(e.[employer_organization_desc] AS VARCHAR(MAX)) AS employer_organization_desc,
    CAST(e.[employer_organization_logo] AS VARCHAR(MAX)) AS employer_organization_logo,
    CAST(e.[employer_organization_industry] AS VARCHAR(MAX)) AS employer_organization_industry,
    CAST(e.[employer_organization_location] AS VARCHAR(MAX)) AS employer_organization_location,
    CAST(e.[employer_organization_no_of_emp] AS VARCHAR(MAX)) AS employer_organization_no_of_emp,
    CASE 
        WHEN CAST(e.[employer_organization_name] AS VARCHAR(MAX)) IS NULL OR CAST(e.[employer_organization_name] AS VARCHAR(MAX)) = ''
          OR CAST(e.[employer_organization_desc] AS VARCHAR(MAX)) IS NULL OR CAST(e.[employer_organization_desc] AS VARCHAR(MAX)) = ''
          OR CAST(e.[employer_organization_industry] AS VARCHAR(MAX)) IS NULL OR CAST(e.[employer_organization_industry] AS VARCHAR(MAX)) = ''
          OR CAST(e.[employer_organization_location] AS VARCHAR(MAX)) IS NULL OR CAST(e.[employer_organization_location] AS VARCHAR(MAX)) = ''
          OR CAST(e.[employer_organization_no_of_emp] AS VARCHAR(MAX)) IS NULL OR CAST(e.[employer_organization_no_of_emp] AS VARCHAR(MAX)) = ''
          THEN 50
        WHEN CAST(e.[employer_organization_logo] AS VARCHAR(MAX)) IS NULL OR CAST(e.[employer_organization_logo] AS VARCHAR(MAX)) = ''
          THEN 90
        ELSE 100
    END AS total_progress,
    (
        SELECT 
            n.[notification_dtls_id],
            n.[notification_type],
            n.[notification_heading],
            n.[notification_message],
            n.[notification_is_read],
            n.[notification_created_at],
            n.[notification_read_at]
        FROM NotificationDetails n
        WHERE n.[notification_user_dtls_id] = u.[user_dtls_id] 
        ORDER BY 
            n.[notification_created_at] DESC
        FOR JSON PATH
    ) AS notification_list,
    ISNULL((
        SELECT 
            ei.[employer_internship_post_dtls_id],
            ei.[employer_internship_post_org_dtls_id],
            ei.[employer_internship_post_supervision_type],
            ei.[employer_internship_post_position],
            ei.[employer_internship_post_status],
            ei.[employer_internship_post_cr_date]
        FROM InternshipPosts ei
         ORDER BY 
            ei.[employer_internship_post_cr_date] DESC
        FOR JSON PATH
    ), '[]') AS internship_post_list,
    ISNULL(
        (SELECT COUNT(*) 
        FROM [dbo].[employer_internship_posts_dtls] ei
    WHERE 
        ei.[employer_internship_post_user_dtls_id] = @employerUserDtlsId
       ),
        0
    ) AS total_internships_posts_count,
    ISNULL(
        (SELECT COUNT(*) 
        FROM [dbo].[employer_internship_posts_dtls] ei
    WHERE 
        ei.[employer_internship_post_status] = 'open' and  ei.[employer_internship_post_user_dtls_id] = @employerUserDtlsId 
       ),
        0
    ) AS total_active_internships_posts_count,
    ISNULL(
        (SELECT COUNT(*) 
        FROM [dbo].[employer_internship_posts_dtls] ei
    WHERE 
       ei.[employer_internship_post_status] = 'closed' and ei.[employer_internship_post_user_dtls_id] = @employerUserDtlsId
       ),
        0
    ) AS total_inactive_internships_posts_count
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[employer_organization_dtls] e ON u.[user_dtls_id] = e.[employer_organization_user_dtls_id]
WHERE 
    u.[user_dtls_id] = @employerUserDtlsId;
`;

export const UpdateEMployerOrgDetailsQuery = `UPDATE [dbo].[employer_organization_dtls]
SET
    [employer_organization_name] = @employerOrgName,
    [employer_organization_desc] = @employerOrgDesc,
    [employer_organization_industry] = @employerOrgIndustry,
    [employer_organization_location] = @employerOrgLocation,
    [employer_organization_no_of_emp] = @employerOrgNoOfEmp,
    [employer_organization_website] = @organization_website,
    [employer_organization_linkedin] = @organization_linkedin,
    [employer_organization_designation] = @organization_employee_designation,
    [employer_organization_complete_address] = @organization_address,
    [employer_organization_logo] = @organization_logo_url

WHERE 
    [employer_organization_user_dtls_id] = @employerUserDtlsId;
`;

export const FetchInternshipPostDetailsSqlQuery = `
SELECT 
    ei.[employer_internship_post_dtls_id],
    ei.[employer_internship_post_user_dtls_id],
    ei.[employer_internship_post_org_dtls_id],
    ei.[employer_internship_post_supervision_type],
    ei.[employer_internship_post_position],
    ei.[employer_internship_post_type],
    ei.[employer_internship_post_openings],
    ei.[employer_internship_post_part_full_time],
    ei.[employer_internship_post_coll_hours],
    ei.[employer_internship_post_timezone],
    ei.[employer_internship_post_location],
    ei.[employer_internship_post_internship_start],
    ei.[employer_internship_post_internship_start_date],
    ei.[employer_internship_post_duration],
    ei.[employer_internship_post_skills],
    ei.[employer_internship_post_req],
    ei.[employer_internship_post_res],
    ei.[employer_internship_post_stipend_type],
    ei.[employer_internship_post_currency_type],
    ei.[employer_internship_post_stipend_amount],
    ei.[employer_internship_post_pay_type],
    ei.[employer_internship_post_perks],
    ei.[employer_internship_post_ppo],
    ei.[employer_internship_post_support],
    ei.[employer_internship_post_project],
    ei.[employer_internship_post_contribution],
    ei.[employer_internship_post_status],
    ei.[employer_internship_post_cr_date],
    ei.[employer_internship_post_update_date],
    ei.[employer_internship_post_domain],
    eo.[employer_organization_dtls_id],
    eo.[employer_organization_user_dtls_id],
    eo.[employer_organization_email],
    eo.[employer_organization_name],
    eo.[employer_organization_desc],
    eo.[employer_organization_logo],
    eo.[employer_organization_industry],
    eo.[employer_organization_location],
    eo.[employer_organization_no_of_emp],    
    eo.[employer_organization_website],
    eo.[employer_organization_complete_address],
    eo.[employer_organization_dtls_cr_date],
    eo.[employer_organization_dtls_update_date]
FROM 
    [dbo].[employer_internship_posts_dtls] ei
INNER JOIN 
    [dbo].[employer_organization_dtls] eo
ON 
    ei.[employer_internship_post_org_dtls_id] = eo.[employer_organization_dtls_id]
WHERE 
    ei.[employer_internship_post_dtls_id] = @internshipPostId;
`;

export const GetAllApplicantsForInternshipSqlQuery = `
SELECT 
    us.[user_email] as mentee_email,
    us.[user_firstname] as mentee_firstname,
    us.[user_lastname] as mentee_lastname,
    us.[user_phone_number] as mentee_phone_number,
    us.[user_type] ,
    m.[mentee_about],
    m.[mentee_skills],
    m.[mentee_gender],
    m.[mentee_type],
    m.[mentee_profile_pic_url],
    m.[mentee_institute_details],
    m.[mentee_certificate_details],
    m.[mentee_experience_details],
    m.[mentee_language],
    m.[mentee_linkedin_url],
    m.[mentee_twitter_url],
    m.[mentee_instagram_url],
    m.[mentee_dtls_update_date],
    m.[mentee_additional_details],
    ia.[internship_post_dtls_id],
    ia.[mentee_user_dtls_id],
    ia.[mentee_dtls_id],
    ia.[mentee_resume_link],
    ia.[mentee_internship_applied_status],
    ia.[internship_applicant_dtls_cr_date],
    ia.[internship_applicant_dtls_update_date],
    ei.[employer_internship_post_position],
    ei.[employer_internship_post_type],
    ei.[employer_internship_post_part_full_time],
    ei.[employer_internship_post_location],
    ei.[employer_internship_post_duration],
    ei.[employer_internship_post_stipend_type],
    ei.[employer_internship_post_currency_type],
    ei.[employer_internship_post_stipend_amount],
    ei.[employer_internship_post_status],
    eo.[employer_organization_name],
    eo.[employer_organization_logo],
    eo.[employer_organization_industry]
FROM 
    [dbo].[internship_applicants_dtls] ia
INNER JOIN 
    [dbo].[employer_internship_posts_dtls] ei 
ON 
    ia.[internship_post_dtls_id] = ei.[employer_internship_post_dtls_id]
INNER JOIN 
    [dbo].[employer_organization_dtls] eo
ON 
    ei.[employer_internship_post_org_dtls_id] = eo.[employer_organization_dtls_id]
INNER JOIN
    [dbo].[users_dtls] US
ON 
    ia.[mentee_user_dtls_id] = us.[user_dtls_id]
INNER JOIN
    [dbo].[mentee_dtls] m
ON
    ia.[mentee_dtls_id] = m.[mentee_dtls_id]

WHERE 
    ia.[internship_post_dtls_id] = @internship_post_dtls_id
ORDER BY 
    ia.[internship_applicant_dtls_cr_date] DESC
`;

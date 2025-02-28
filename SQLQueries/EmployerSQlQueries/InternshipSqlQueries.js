export const CreateInternshipPostSqlQuery = `INSERT INTO [dbo].[employer_internship_posts_dtls] (
    employer_internship_post_user_dtls_id,
    employer_internship_post_org_dtls_id,
    employer_internship_post_supervision_type,
    employer_internship_post_position,
    employer_internship_post_type,
    employer_internship_post_openings,
    employer_internship_post_part_full_time,
    employer_internship_post_coll_hours,
    employer_internship_post_timezone,
    employer_internship_post_location,
    employer_internship_post_internship_start,
    employer_internship_post_internship_start_date,
    employer_internship_post_duration,
    employer_internship_post_skills,
    employer_internship_post_req,
    employer_internship_post_res,
    employer_internship_post_stipend_type,
    employer_internship_post_currency_type,
    employer_internship_post_stipend_amount,
    employer_internship_post_pay_type,
    employer_internship_post_perks,
    employer_internship_post_ppo,
    employer_internship_post_support,
    employer_internship_post_project,
    employer_internship_post_contribution,
    employer_internship_post_domain
)
VALUES (
    @employer_internship_post_user_dtls_id,
    @employer_internship_post_org_dtls_id,
    @employer_internship_post_supervision_type,
    @employer_internship_post_position,
    @employer_internship_post_type,
    @employer_internship_post_openings,
    @employer_internship_post_part_full_time,
    @employer_internship_post_coll_hours,
    @employer_internship_post_timezone,
    @employer_internship_post_location,
    @employer_internship_post_internship_start,
    @employer_internship_post_internship_start_date,
    @employer_internship_post_duration,
    @employer_internship_post_skills,
    @employer_internship_post_req,
    @employer_internship_post_res,
    @employer_internship_post_stipend_type,
    @employer_internship_post_currency_type,
    @employer_internship_post_stipend_amount,
    @employer_internship_post_pay_type,
    @employer_internship_post_perks,
    @employer_internship_post_ppo,
    @employer_internship_post_support,
    @employer_internship_post_project,
    @employer_internship_post_contribution,
    @employer_internship_post_domain
)`;

export const FetchAllInternshipPostsSqlQuery = `
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
    eo.[employer_organization_dtls_id],
    eo.[employer_organization_user_dtls_id],
    eo.[employer_organization_email],
    eo.[employer_organization_name],
    eo.[employer_organization_desc],
    eo.[employer_organization_logo],
    eo.[employer_organization_industry],
    eo.[employer_organization_location],
    eo.[employer_organization_no_of_emp],
    eo.[employer_organization_dtls_cr_date],
    eo.[employer_organization_dtls_update_date]
FROM 
    [dbo].[employer_internship_posts_dtls] ei
INNER JOIN 
    [dbo].[employer_organization_dtls] eo
ON 
    ei.[employer_internship_post_org_dtls_id] = eo.[employer_organization_dtls_id]
WHERE 
    ei.[employer_internship_post_status] = 'open'
ORDER BY 
    ei.[employer_internship_post_cr_date] DESC`;
export const Show10InternshipsSqlQuery = `
SELECT TOP 10
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
    eo.[employer_organization_dtls_id],
    eo.[employer_organization_user_dtls_id],
    eo.[employer_organization_email],
    eo.[employer_organization_name],
    eo.[employer_organization_desc],
    eo.[employer_organization_logo],
    eo.[employer_organization_industry],
    eo.[employer_organization_location],
    eo.[employer_organization_no_of_emp],
    eo.[employer_organization_dtls_cr_date],
    eo.[employer_organization_dtls_update_date]
FROM 
    [dbo].[employer_internship_posts_dtls] ei
INNER JOIN 
    [dbo].[employer_organization_dtls] eo
ON 
    ei.[employer_internship_post_org_dtls_id] = eo.[employer_organization_dtls_id]
WHERE 
    ei.[employer_internship_post_status] = 'open'
ORDER BY 
    ei.[employer_internship_post_cr_date] DESC`;

export const ApplyInternshipSqlQuery = `
INSERT INTO [dbo].[internship_applicants_dtls] (
    mentee_user_dtls_id,
    mentee_dtls_id,
    internship_post_dtls_id,
    mentee_resume_link,
    mentee_internship_applied_status,
    internship_applicant_dtls_cr_date,
    internship_applicant_dtls_update_date
)
VALUES (
    @mentee_user_dtls_id,
    @mentee_dtls_id,
    @internship_post_dtls_id,
    @mentee_resume_link,
    @mentee_internship_applied_status, -- Default value will be 'applied'
    GETDATE(), -- Automatically set creation date
    GETDATE()  -- Automatically set update date
)`;


// export const GetAppliedInternshipsSqlQuery = `
// SELECT
//     ia.[internship_post_dtls_id],
//     ia.[mentee_user_dtls_id],
//     ia.[mentee_dtls_id],
//     ia.[mentee_resume_link],
//     ia.[mentee_internship_applied_status],
//     ia.[internship_applicant_dtls_cr_date],
//     ia.[internship_applicant_dtls_update_date],
//     ei.[employer_internship_post_position],
//     ei.[employer_internship_post_type],
//     ei.[employer_internship_post_part_full_time],
//     ei.[employer_internship_post_location],
//     ei.[employer_internship_post_duration],
//     ei.[employer_internship_post_stipend_type],
//     ei.[employer_internship_post_currency_type],
//     ei.[employer_internship_post_stipend_amount],
//     ei.[employer_internship_post_status],
//     eo.[employer_organization_name],
//     eo.[employer_organization_logo],
//     eo.[employer_organization_industry]
// FROM
//     [dbo].[internship_applicants_dtls] ia
// INNER JOIN
//     [dbo].[employer_internship_posts_dtls] ei
// ON
//     ia.[internship_post_dtls_id] = ei.[employer_internship_post_dtls_id]
// INNER JOIN
//     [dbo].[employer_organization_dtls] eo
// ON
//     ei.[employer_internship_post_org_dtls_id] = eo.[employer_organization_dtls_id]
// WHERE
//     ia.[mentee_user_dtls_id] = @mentee_user_dtls_id
// ORDER BY
//     ia.[internship_applicant_dtls_cr_date] DESC`;

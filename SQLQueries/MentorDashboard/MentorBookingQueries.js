// get the mentor approved or not approved booking session in the mentor dashboard
export const MentorApprovedBookingQuery = ` SELECT 
    u.user_dtls_id,
    m.mentor_dtls_id,
    m.mentor_email,
    mba.mentor_booking_appt_id,
    mba.mentor_dtls_id AS booking_mentor_dtls_id,
    mba.mentee_user_dtls_id,
    mba.mentor_session_booking_date,
    mba.mentor_booking_time,
    mba.mentor_booking_starts_time,
    mba.mentor_options,
    mba.mentor_questions,
    mba.mentor_booking_confirmed,
    mba.mentor_host_url,
    mba.trainee_join_url,
    mba.mentor_amount_paid_status,
    mba.mentor_session_status,
    mba.mentor_rescheduled_times,
    mba.trainee_session_status,
    mentee.mentee_profile_pic_url,    
    mentee.mentee_type,
    mentee_user.user_firstname as mentee_firstname,
    mentee_user.user_lastname as mentee_lastname -- Fetch the mentee's first name
FROM 
    dbo.users_dtls u
INNER JOIN 
    dbo.mentor_dtls m ON u.user_dtls_id = m.mentor_user_dtls_id
INNER JOIN 
    dbo.mentor_booking_appointments_dtls mba ON m.mentor_dtls_id = mba.mentor_dtls_id
INNER JOIN 
    dbo.mentee_dtls mentee ON mentee.mentee_user_dtls_id = mba.mentee_user_dtls_id
INNER JOIN 
    dbo.users_dtls mentee_user ON mentee_user.user_dtls_id = mentee.mentee_user_dtls_id -- Self-join to fetch mentee details
WHERE 
    u.user_dtls_id = @mentorUserDtlsId
    AND (mba.[mentor_booking_confirmed] = 'No' OR mba.[mentor_booking_confirmed] = 'Yes' 
         AND mba.[mentor_session_status] = 'upcoming' 
         AND mba.[trainee_session_status] = 'upcoming')
  
     AND mba.[mentor_session_booking_date] > CAST(GETDATE() AS DATE)
    OR (
        mba.[mentor_session_booking_date] = CAST(GETDATE() AS DATE)  -- If session is today
        AND mba.[mentor_booking_starts_time] > CAST(GETDATE() AS TIME)
       
    )
    
ORDER BY 
    mba.mentor_session_booking_date;;
`;
// generate the meeting link when mentor approved the session
export const UpdateMentorBookingAppointmentQuery = `update mentor_booking_appointments_dtls set mentor_booking_confirmed = 'Yes',
mentor_host_url = @joinURL1,
trainee_join_url = @joinURL2,
practy_team_host_url = @hostURL,
practy_team_meeting_id = @meetingID,
practy_team_meeting_password = @meetingPassword 
where mentor_booking_appt_id = @bookingId`;

// get the mentor booking appoint details for generating the meeting link and sending the email
export const FetchMentorBookingAppointmentQuery = `SELECT 
    mba.[mentor_booking_appt_id],
    mba.[mentor_dtls_id],
    mba.[mentor_session_booking_date],
    mba.[mentor_booking_starts_time],
    mba.[mentor_booking_end_time],
    mba.[mentor_booking_time],
    ud.[user_email] AS mentee_email,
    ud.[user_firstname] AS mentee_firstname,
    ud.[user_lastname] AS mentee_lastname,
    md.[mentor_user_dtls_id],
    mdu.[user_email] AS mentor_email,
    mdu.[user_firstname] AS mentor_firstname,
    mdu.[user_lastname] AS mentor_lastname,
    ud.[user_phone_number] As mentee_phonenumber,
    mdu.[user_phone_number] As mentor_phonenumber
FROM 
    [dbo].[mentor_booking_appointments_dtls] mba
JOIN 
    [dbo].[users_dtls] ud
ON 
    mba.[mentee_user_dtls_id] = ud.[user_dtls_id]
JOIN 
    [dbo].[mentor_dtls] md
ON 
    mba.[mentor_dtls_id] = md.[mentor_dtls_id]
JOIN 
    [dbo].[users_dtls] mdu
ON 
    md.[mentor_user_dtls_id] = mdu.[user_dtls_id]
WHERE
  mentor_booking_appt_id = @UnapprovedBookingId 
and 
mentor_booking_confirmed = 'No'`;

export const MentorCompletedSessionsBookingMenteeNameQuery = `
SELECT 
    u.user_dtls_id,
    m.mentor_user_dtls_id,
    m.mentor_job_title,
    m.mentor_company_name,
    mba.mentor_booking_appt_id,
    mba.mentee_user_dtls_id,
    mba.mentor_session_booking_date,
    mba.mentor_booking_time,
    mba.mentor_session_status,
    mba.mentor_booking_confirmed,
    mentee.mentee_profile_pic_url,
    mentee.mentee_type,
    uma.user_firstname as mentee_firstname,
    uma.user_lastname as mentee_lastname,
    (
        SELECT 
            f.mentor_feedback_dtls_id,
            f.mentor_appt_booking_dtls_id,
            f.mentee_user_dtls_id,
            f.mentor_feedback_detailed_fb,
            f.mentor_feedback_add_fb_sugg,
            f.mentor_feedback_session_overall_rating,
            f.mentor_feedback_dtls_cr_date
        FROM 
            dbo.mentor_feedback_dtls f
        WHERE 
            f.mentor_user_dtls_id = m.mentor_user_dtls_id
        AND 
            f.mentor_appt_booking_dtls_id = mba.mentor_booking_appt_id
        FOR JSON PATH
    ) AS feedback_details
FROM 
    dbo.users_dtls u
INNER JOIN 
    dbo.mentor_dtls m ON u.user_dtls_id = m.mentor_user_dtls_id
INNER JOIN 
    dbo.mentor_booking_appointments_dtls mba ON m.mentor_dtls_id = mba.mentor_dtls_id
INNER JOIN 
    dbo.mentee_dtls mentee ON mba.mentee_user_dtls_id = mentee.mentee_user_dtls_id
INNER JOIN 
    dbo.users_dtls uma ON mba.mentee_user_dtls_id = uma.user_dtls_id
WHERE 
    u.user_dtls_id = @mentorUserDtlsId
AND 
    mba.mentor_booking_confirmed = 'Yes'
AND 
    mba.mentor_session_status = 'completed'
AND 
    mba.trainee_session_status = 'completed';

`;

export const MentorSessionBookingRemainderSqlQuery = `SELECT 
    mba.[mentor_booking_appt_id],
    mba.[mentor_dtls_id],
    mba.[mentee_user_dtls_id],
    mba.[mentor_session_booking_date],
    mba.[mentor_booking_starts_time],
    mba.[mentor_booking_time],
    mba.[mentor_booking_confirmed],
    mba.[mentor_host_url],
    mba.[trainee_join_url],
    md.[mentor_user_dtls_id], 
    md.[mentor_job_title],   
    mentor.[user_firstname] as mentor_firstname,
    mentor.[user_lastname] as mentor_lastname,    
    mentor.[user_email] as mentor_email,
    mentee.[user_firstname] as mentee_firstname,
    mentee.[user_lastname] as mentee_lastname,
    mentee.[user_email] as mentee_email
FROM 
    [dbo].[mentor_booking_appointments_dtls] mba
INNER JOIN 
    [dbo].[mentor_dtls] md
ON 
    mba.[mentor_dtls_id] = md.[mentor_dtls_id]
INNER JOIN 
    [dbo].[users_dtls] mentor
ON 
    md.[mentor_user_dtls_id] = mentor.[user_dtls_id]
INNER JOIN 
    [dbo].[users_dtls] mentee
ON 
    mba.[mentee_user_dtls_id] = mentee.[user_dtls_id]  -- Assuming user_dtls_id is the primary key in users_dtls
WHERE 
   mba.[mentor_booking_confirmed] = 'Yes' AND mba.[mentor_session_status] = 'upcoming' AND mba.[trainee_session_status] = 'upcoming' and mba.[mentor_session_booking_date] >= CAST(GETDATE() AS DATE)`;

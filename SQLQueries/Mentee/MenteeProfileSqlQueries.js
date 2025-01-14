export const MenteeProfileUpdateQuery = `update mentee_dtls set mentee_language = @menteeLanguage, mentee_linkedin_url = @linkedinUrl,  mentee_gender = @menteeGender,mentee_about = @menteeAbout where mentee_user_dtls_id = @menteeUserDtlsId`;

export const MenteeEduWorkUpdateQuery = `
update mentee_dtls set mentee_skills = @menteeSkills, mentee_type = @menteeType, mentee_institute_details = @instituteDetails, mentee_certificate_details = @certificateDetails,mentee_experience_details = @experienceDetails,mentee_additional_details = @additionalDetails where mentee_user_dtls_id = @menteeUserDtlsId`;

export const MenteeProfilePictureUpdateQuery = `
update mentee_dtls set mentee_profile_pic_url = @menteeProfileUrl where mentee_user_dtls_id = @menteeUserDtlsId`;

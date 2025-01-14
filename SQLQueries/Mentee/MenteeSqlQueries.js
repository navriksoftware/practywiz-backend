export const MenteeRegisterQuery = `
          INSERT INTO [dbo].[mentee_dtls] (
            [mentee_user_dtls_id],
            [mentee_about],
            [mentee_skills],
            [mentee_gender],
            [mentee_type],
            [mentee_profile_pic_url],
            [mentee_institute_details]
        ) OUTPUT INSERTED.mentee_dtls_id VALUES (
            @menteeUserDtlsId,
            @menteeAbout,
            @menteeSkills,
            @menteeGender,
            @menteeType,
            @menteeProfilePic,
            @menteeInstitute
        );
`;

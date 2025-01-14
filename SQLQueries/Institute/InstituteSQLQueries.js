export const InstituteRegisterSqlQuery = `
          INSERT INTO [dbo].[users_dtls] (
            [user_email],
            [user_pwd],
            [user_firstname],
            [user_lastname],
            [user_phone_number],
            [user_status],
            [user_type]
        ) OUTPUT INSERTED.user_dtls_id VALUES (
            @user_email,
            @user_pwd,
            @user_firstname,
            @user_lastname,
            @user_phone_number,
            @user_status,
            @user_type
        );
`;

export const InstituteTableInsertQuery = `
Insert into institute_dtls (
    [institute_user_dtls_id],
    [institute_name],
	[institute_about],
	[institute_profile_pic]) VALUES(
    @instituteUserId,
    @instituteName,
    @instituteAbout,
    @instituteProfilePic
    )
`;

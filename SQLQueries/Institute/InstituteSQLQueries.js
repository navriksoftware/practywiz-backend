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
    [institute_code],
	[institute_about],
	[institute_profile_pic]) VALUES(
    @userId,
    @organizationName,
    @organizationCode,
    @organizationAbout,
    @organizationProfilePic
    )
`;
export const FacultyTableInsertQuery = `
Insert into faculty_dtls (
    [faculty_user_dtls_id],
    [faculty_institute_name],
    [faculty_institute_code],
    [faculty_about],
    [faculty_profile_pic]) VALUES(
     @userId,
    @organizationName,
    @organizationCode,
    @organizationAbout,
    @organizationProfilePic
    )
`;

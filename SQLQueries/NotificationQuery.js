export const InsertNotificationQuery = `
           INSERT INTO [dbo].[notifications_dtls] (
                [notification_user_dtls_id],
                [notification_type],
                [notification_heading],
                [notification_message]
            )  VALUES (
                @notificationUserDtlsId,
                @notificationType,
                @notificationHeading,
                @notificationMessage
            );
        `;

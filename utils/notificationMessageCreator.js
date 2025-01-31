const notificationMessageCreator = (title, token, body,data)=>{
    return {
        notification: {
            title: title,
            body: body || 'You have a new notification'
        },
        token: token,
        data: data || {}
    }
}

export default notificationMessageCreator;
import { MailAddresses, MailMetadata } from '../../../config/mailservice'

export const registerMetadata: MailMetadata = {
    from: MailAddresses.blogMail,
    subject: 'Your registration at travelfeed.blog'
}

export const unregisterMetadata: MailMetadata = {
    from: MailAddresses.blogMail,
    subject: 'Your unregistration at travelfeed.blog'
}

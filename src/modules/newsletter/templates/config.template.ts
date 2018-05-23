import { MailAddresses, MailMetadata } from '../../../config/mailservice'

export const channelMetadata: MailMetadata = {
    from: MailAddresses.newsletterMail,
    subject: 'Travelfeed.blog newsletter'
}

export const subscribeMetadata: MailMetadata = {
    from: MailAddresses.newsletterMail,
    subject: 'Your travelfeed.blog newsletter registration'
}

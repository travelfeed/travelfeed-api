import { mailAddresses, MailMetadata } from '../../../services/mail'

export const channelMetadata: MailMetadata = {
    from: mailAddresses.newsletter,
    subject: 'Travelfeed.blog newsletter',
}

export const subscribeMetadata: MailMetadata = {
    from: mailAddresses.newsletter,
    subject: 'Your travelfeed.blog newsletter registration',
}

import { mailAddresses, MailMetadata } from '../../../services/mail'

export const registerMetadata: MailMetadata = {
    from: mailAddresses.blog,
    subject: 'Your registration at travelfeed.blog',
}

export const unregisterMetadata: MailMetadata = {
    from: mailAddresses.blog,
    subject: 'Your unregistration at travelfeed.blog',
}

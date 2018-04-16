import { mailAddresses } from '../../../../config/mailservice'

// have to match with html template
export interface MailParams {
    text: string
    unsubLink: string
}

export const metadata = {
    from: mailAddresses.newsletterMail,
    subject: 'Newsletter at travelfeed.blog'
}

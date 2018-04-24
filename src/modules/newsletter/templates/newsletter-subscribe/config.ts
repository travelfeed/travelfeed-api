import { mailAddresses } from '../../../../config/mailservice'

// have to match with html template
export interface MailParams {
    subLink: string
}

export const metadata = {
    from: mailAddresses.newsletterMail,
    subject: 'Newsletter registration at travelfeed.blog'
}

import { mailAddresses } from '../../../../config/mailservice'

// have to match with html template
export interface MailParams {
    confirmUrl: string
}

export const metadata = {
    from: mailAddresses.blogMail,
    subject: 'Your registration at travelfeed.blog'
}

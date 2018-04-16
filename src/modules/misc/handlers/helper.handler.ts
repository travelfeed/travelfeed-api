import * as bcrypt from 'bcrypt-nodejs'
import * as crypto from 'crypto'

import { saltRounds } from '../../../config/auth'

export class HelperHandler {
    protected hashPassword(plainPassword): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(plainPassword, salt, null, (error, hash) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(hash)
                })
            })
        })
    }

    protected verifyPassword(plainPassword, hashedPassword): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainPassword, hashedPassword, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    // sha256 algorithm
    protected hashString(text: string) {
        return crypto
            .createHash('sha256')
            .update(text)
            .digest('hex')
    }

    protected async logMail() {}
}

import * as bcrypt from 'bcrypt-nodejs'
import * as crypto from 'crypto'

import { v1 as uuidv1, v4 as uuidv4 } from 'uuid'
import { sign } from 'jsonwebtoken'
import { saltRounds, jwtConfig, signOptions } from '../../../config/auth'

export interface TokenPair {
    auth: string
    refresh: string
}

export interface RefreshCounts {
    [key: number]: number
}

export interface RefreshTokens {
    [key: string]: number
}

export class HelperHandler {
    public refreshCounts: RefreshCounts = {}
    public refreshTokens: RefreshTokens = {}

    public hashPassword(plainPassword): Promise<string> {
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

    public verifyPassword(plainPassword, hashedPassword): Promise<boolean> {
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
    public hashString(text: string) {
        return crypto
            .createHash('sha256')
            .update(text)
            .digest('hex')
    }

    public createTokenPair(userId: number): TokenPair {
        const payload = { userId: userId }
        const auth = sign(payload, jwtConfig.secretOrKey, signOptions)
        const refresh = `${uuidv1()}-${uuidv4()}`

        // store new refresh token and increase count
        this.refreshCounts[userId] = (this.refreshCounts[userId] || 0) + 1
        this.refreshTokens[refresh] = userId

        return { auth, refresh }
    }

    public validRefreshToken(refreshToken: string, userId: number): boolean {
        // only allow refresh 3 times
        if (this.refreshCounts[userId] > 3) {
            delete this.refreshCounts[userId]
            return false
        }

        // check if refresh token is valid
        if (this.refreshTokens[refreshToken] && this.refreshTokens[refreshToken] === userId) {
            delete this.refreshTokens[refreshToken]
            return true
        }

        return false
    }
}

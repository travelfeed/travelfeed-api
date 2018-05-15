import * as acl from 'acl'

const permissions: acl = new acl(new acl.memoryBackend())

permissions.allow([
    {
        roles: ['Admin'],
        allows: [
            {
                resources: ['user', 'article', 'comment', 'newsletter', 'translation'],
                permissions: '*'
            }
        ]
    },
    {
        roles: ['User'],
        allows: [
            {
                resources: 'article',
                permissions: ['read']
            },
            {
                resources: 'comment',
                permissions: ['read', 'create', 'delete']
            },
            {
                resources: 'newsletter',
                permissions: ['subscribe', 'unsubscribe']
            }
        ]
    }
])

export { permissions }

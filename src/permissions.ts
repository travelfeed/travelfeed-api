import * as Acl from 'acl'

const permissions = new Acl(new Acl.memoryBackend())

permissions.allow([
    {
        roles: ['admin'],
        allows: [
            {
                resources: ['user', 'article', 'comment', 'newsletter', 'translation'],
                permissions: '*',
            },
        ],
    },
    {
        roles: ['admin', 'user'],
        allows: [
            {
                resources: 'comment',
                permissions: ['create', 'edit', 'delete'],
            },
            {
                resources: 'newsletter',
                permissions: ['subscribe', 'unsubscribe'],
            },
        ],
    },
])

export { permissions }

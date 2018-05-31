import * as Acl from 'acl'

const permissions = new Acl(new Acl.memoryBackend())

permissions.allow([
    {
        roles: ['admin'],
        allows: [
            {
                resources: ['user', 'article', 'country', 'comment', 'newsletter', 'translation'],
                permissions: '*',
            },
        ],
    },
    {
        roles: ['user'],
        allows: [
            {
                resources: 'comment',
                permissions: ['read', 'create', 'edit', 'delete'],
            },
            {
                resources: 'newsletter',
                permissions: ['subscribe', 'unsubscribe'],
            },
        ],
    },
])

export { permissions }

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
                resources: 'comment',
                permissions: ['create', 'delete']
            },
            {
                resources: 'newsletter',
                permissions: ['subscribe', 'unsubscribe']
            }
        ]
    }
])

export { permissions }

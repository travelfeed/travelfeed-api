import * as acl from 'acl'

const permissions: acl = new acl(new acl.memoryBackend())

permissions.allow([
    {
        roles: ['Admin'],
        allows: [
            {
                resources: ['user', 'article', 'comment'],
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
            }
        ]
    }
])

export { permissions }

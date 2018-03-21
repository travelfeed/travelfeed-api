import * as acl from 'acl'

const aclInstance: acl = new acl(new acl.memoryBackend())

aclInstance.allow([
    {
        roles: ['Admin'],
        allows: [{ resources: ['user', 'article', 'comment'], permissions: '*' }]
    },
    {
        roles: ['User'],
        allows: [
            { resources: 'article', permissions: ['read'] },
            { resources: 'comment', permissions: ['read', 'create', 'delete'] }
        ]
    }
])

export default aclInstance

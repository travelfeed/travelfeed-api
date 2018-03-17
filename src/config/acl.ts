import * as acl from 'acl'

const aclInstance: acl = new acl(new acl.memoryBackend())

aclInstance.allow([
    {
        roles: ['Admin'],
        allows: [{ resources: ['user', 'article'], permissions: '*' }]
    },
    {
        roles: ['User'],
        allows: [{ resources: 'article', permissions: ['comment', 'react', 'read'] }]
    }
])

export default aclInstance

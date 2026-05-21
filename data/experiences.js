sreBatchBody = `
Along with the SRE team (3 to 6 people), I participated to the maintenance and improvements of the platform, which is built on top of Kafka, Cassandra, Redis, MariaDB, Victoriametrics and Kubernetes.</br>
</br>
Few projects:</br>
<ul>
    <li>Live-update of the reliability of multiple 2-nodes MariaDB clusters using an existing solution based on Orchestrator, allowing a replica node to become the main node in case the main node fails</li>
    <li>Implementation of a software to perform the reinstatement of a crashed MariaDB main node into the cluster (step not available in Orchestrator)</li>
    <li>Introduction of Pulumi to ease the provisioning of the OVH baremetal hosts and have them available and registered in Netbox in one command</li>
    <li>Migration of the DNS entries provisioning done by Ansible on Bind to a self-registration of the hosts using Bind and Consul</li>
    <li>Implementation of a software to partially restore a Cassandra backup made by Medusa</li>
    <li>Zero-downtime upgrades of 30+nodes Cassandra clusters</li>
    <li>Introduction of Vault in Kubernetes along with service-account based authentications for applications</li>
    <li>Migration of AWS entities and GitHub repository management under IaC</li>
    <li>Migration of IPTables to NFTables through Ansible</li>
    <li>Setup of OpenTelemetry to scrap Talos hosts metrics</li>
</ul>

Tasks:
<ul>
    <li>On-call and incident management</li>
    <li>Solution search, design & implementation, along with documentations in RFCs</li>
    <li>Project roadmap design and estimation</li>
</ul>
`

const experienceMap = {
    sreBatch: {
        title: 'DevOps/Site Reliability Engineer',
        company: 'Batch',
        companyLink: 'https://batch.com',
        location: 'Lyon, France',
        period: '2021/09 - 2025/12',
        description: 'SRE at Batch (tech team ~ 30, SRE team ~ 6), in an environment with high availability requirements based on baremetal servers running Kubernetes, Kafka, Cassandra, etc.',
        body: sreBatchBody,
        tags: []
    },
    consultantEnxBnppf: {
        title: 'Lorem Ipsum',
        company: 'Startup Inc',
        companyLink: 'https://startup-inc.com',
        location: 'Brussels, Belgium',
        period: '2020 - 2022',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: []
    }
};
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
        company: '<a style="color: inherit; text-decoration: inherit;" href="https://batch.com" target="_blank" rel="noopener noreferrer">Batch</a>',
        location: 'Lyon, France',
        period: '2021/09 - 2025/12',
        description: 'DevOps/SRE in a relatively small SRE team (3-6 out of 20-30 in the tech dpt.), in an environment with high availability requirements based on baremetal servers running Kubernetes, Kafka, Cassandra, etc.',
        body: sreBatchBody,
        tags: []
    },
    consultantEnxBnppf: {
        title: 'Consultant in data engineering',
        company: '<a style="color: inherit; text-decoration: inherit;" href="https://www.bnpparibasfortis.be" target="_blank" rel="noopener noreferrer">BNP Paribas Fortis</a> (through <a style="color: inherit; text-decoration: inherit;" href="https://euranova.eu" target="_blank" rel="noopener noreferrer">EURA NOVA</a>)',
        location: 'Brussels, Belgium',
        period: '2020/05 - 2021/09',
        description: 'Development of Flink jobs in the context of a platform migration.',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: []
    },
    consultantEnxBics: {
        title: 'Consultant in data engineering',
        company: '<a style="color: inherit; text-decoration: inherit;" href="https://www.bics.com/" target="_blank" rel="noopener noreferrer">BICS</a> (through <a style="color: inherit; text-decoration: inherit;" href="https://euranova.eu" target="_blank" rel="noopener noreferrer">EURA NOVA</a>)',
        location: 'Brussels, Belgium',
        period: '2019/02 - 2020/03',
        description: 'Collaboration with the data scientists in order to deliver prod ready packages of the models, as well as preparing the data with a deidcated ingestion & processing pipeline.',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: []
    },
    consultantEnxSwift: {
        title: 'Consultant in data engineering',
        company: '<a style="color: inherit; text-decoration: inherit;" href="https://www.swift.com/" target="_blank" rel="noopener noreferrer">Swift</a> (through <a style="color: inherit; text-decoration: inherit;" href="https://euranova.eu" target="_blank" rel="noopener noreferrer">EURA NOVA</a>)',
        location: 'La Hulpe, Belgium',
        period: '2015/11 - 2018/12',
        description: 'Realisation of a logging platform on baremetal based on the ELK stack, with a Kafka-based log collection system and a custom log parsing solution to extract structured data from unstructured logs.',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: []
    },
    /*internKeio: {

    }*/
};
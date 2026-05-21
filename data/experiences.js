sreBatchBody = `
Along with the SRE team (3 to 6 people), I participated to the maintenance and improvements of the platform, hosted on baremetal servers and virtual machines.<br/>
The infrastructure uses Redis for caching, Kafka as a log system, MariaDB for hot data and Cassandra for colder and bigger data.
The applications are orchestrated through Kubernetes, and the monitoring is done through VictoriaMetrics and Grafana.<br/>
<br/>
Ususal tasks:
<ul>
    <li>On-call and incident management</li>
    <li>Solution search, design & implementation, along with documentations in RFCs</li>
    <li>Project roadmap design and estimation</li>
</ul>
<br/>
<h2>Few projects</h2>
<details>
    <summary>Implementation of high availability for MariaDB clusters</summary>
    <br/>
    Previously, Batch was using few MariaDB clusters composed of 2 nodes (1 main & 1 replica), without any automatic failover in case the main node was crashing.<br/>
    Such situation meant that in case of a main node failure, the failover had to be done manually along with the reconfiguration of the applications.<br/>
    Hence, I had been tasked to investigate, propose and implement a solution to have an automatic failover of these clusters, providing this way high availability.<br/>
    <br/>
    The solution selected is based on <a href="https://github.com/orchestrator/orchestrator">Orchestrator</a>, a tool authored by Shlomi Noach, which performs an automatic failover depending on the health of the nodes.
    Though, the tool by itself isn't enough to provide high availability, and few other pieces of software were introduced:
    <ul>
        <li><b>Consul</b> has been configured as the backend for Orchestrator.</li>
        <li>So <b>HAProxy</b> could be configured dynamically thanks to <b>Consul-template</b> in order for the traffic to always be routed toward the main node.</li>
        <li>Finally, <b>KeepAlived</b> was used to provide a virtual IP for the cluster's hosts, removing the need to manually reconfigure the applications when a node host crashes.</li>
    </ul>
    <br/>
    Still this solution didn't cover the reinstatement of a crashed main node back into the cluster, but this part has been implemented through a custom made application in Golang.<br/>
    
    The implementation of this solution has been realised live, on all environments without downtime for the clusters and the applications.
    <br/>
    <hr/>
    <br/>
</details>
<details>
    <summary>Introduction of Pulumi to ease the provisioning of platform's servers</summary>
    Migration of the DNS entries provisioning done by Ansible on Bind to a self-registration of the hosts using Bind and Consul
</details>
<details>
    <summary>Setup of the backup system for Cassandra</summary>
    Zero-downtime upgrades of 30+nodes Cassandra clusters
    Implementation of a software to partially restore a Cassandra backup made by Medusa
</details>
<details>
    <summary>Deployment of Vault in Kubernetes along with service-account based authentications for applications</summary>
</details>
<details>
    <summary>Migration of AWS entities and GitHub repository management under IaC</summary>
</details>
<details>
    <summary>Evolution of the infrastructure networking</summary>
    Migration of IPTables to NFTables through Ansible
</details>
<details>
    <summary>Improvement of the infrastructure logging</summary>
    Migration of IPTables to NFTables through Ansible
    Setup of OpenTelemetry to scrap Talos hosts metrics
</details>

`

/*
Simplification du process de provisioning de serveurs passant de scripts python et 3 playbooks Ansible à un système alliant Packer, Pulumi et Ansible, réduisant ainsi les étapes de provisioning et les erreurs humaines.

· Passage en haute disponibilité de serveurs MariaDB, via Orchestrator, KeepAlived, Consul, HAProxy, design & implémentation d’une application en Golang pour remettre dans un cluster un noeud master précédemment tombé, faisant gagner en résilience l’infrastructure.

· Mises à jour sans coupures de clusters Cassandra, allant d’un design du plan de mise à jour, au pilotage de cette mise à jour nécessitant une coordination transverse des équipes afin de pouvoir basculer les applications entre les datacenters d’un même cluster Cassandra.

· Mise en place de backups Cassandra via Medusa, et implémentation d’outil de restauration de sauvegarde de données Cassandra afin de combler le manque de fonctionalité au niveau de la restauration de données via Medusa

· Migration DNS sous le DNS de Consul afin de permettre aux serveurs de s’auto enregistre au sein de notre infrastructure, ainsi que d’y enregistrer les services tournent sur ces serveurs

· Introduction de Vault dans Kubernetes, permettant aux applications de pouvoir s’authentifier au sein de Vault via service accounts ainsi que de pouvoir utiliser les différentes fonctionalitées de Vault, tel les secret engines.

· Migration de 400+ repos GitLab vers GitHub, dans un but de réduire la surface de maintenance demandée à l’équipe SRE

· Mise à jour de notre playbook Ansible gérant les règles IPTables en passants ces dernières sous NFTables, ainsi que déploiement de cette mise à jour dans les différents environnements.

· Passage sous IaC des buckets, de l’IAM et des entrées DNS de Route53 chez AWS sous Terraform
*/

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
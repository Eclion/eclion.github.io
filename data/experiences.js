sreBatchBody = `
Along with the SRE team (3 to 6 people), I participated to the maintenance and improvements of the platform, hosted on baremetal servers and virtual machines.<br/>
The infrastructure uses Redis for caching, Kafka as a log system, MariaDB for hot data and Cassandra for colder and bigger data.
The applications are orchestrated through Kubernetes, and the monitoring is done through VictoriaMetrics and Grafana.<br/>
<br/>
<h2>Usual tasks</h2>
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
    <div class="grid-with-img">
        <div class="text-away-img">
        Previously, Batch was using few MariaDB clusters composed of 2 nodes (1 main & 1 replica), without any automatic failover in case the main node was crashing.<br/>
        Such situation meant that in case of a main node failure, the failover had to be done manually along with the reconfiguration of the applications.<br/>
        Hence, I had been tasked to investigate, propose and implement a solution to have an automatic failover of these clusters, providing this way high availability.<br/>
        <br/>
        </div>
        <div class="text-next-img">        
            The solution selected is based on <a href="https://github.com/orchestrator/orchestrator">Orchestrator</a>, a tool authored by Shlomi Noach, which performs an automatic failover depending on the health of the nodes.
            Though, the tool by itself isn't enough to provide high availability, and few other pieces of software were introduced:
            <ul>
                <li><b>Consul</b> has been configured as the backend for Orchestrator.</li>
                <li>So <b>HAProxy</b> could be configured dynamically thanks to <b>Consul-template</b> in order for the traffic to always be routed toward the main node.</li>
                <li>Finally, <b>KeepAlived</b> was used to provide a virtual IP for the cluster's hosts, removing the need to manually reconfigure the applications when a node host crashes.</li>
            </ul>
        </div>
        <div class="img-in-grid" style="text-align: center">
            <img style="max-width: 100%; max-height: 600px; object-fit: cover;" src="graphs/mariadb-ha.svg" alt="MariaDB High Availability"/>
        </div>
        <div class="text-away-img">
        Still this solution didn't cover the reinstatement of a crashed main node back into the cluster, but this part has been implemented through a custom made application in Golang.<br/>
        The implementation of this solution has been realised live, on all environments without downtime for the clusters and the applications.
        <br/>
        </div>
    </div>
    <br/><hr/><br/>
</details>
<details>
    <summary>Evolution of the provisioning of platform's servers</summary>
    <br/>
    Servers at Batch were originally provisioned through a combination of python scripts, ansible playbooks and manual steps.
    Taking into account that manual steps are error prone and the python scripts were hard to maintain, a revamp of the process was required.<br/>
    As the python scripts were interacting with the various APIs (OVH, Netbox, AWS) and the steps that were performed manually could also be automated through API calls, the obvious choice was to migrate our provisioning process under IaC.
    We decided to go with Pulumi as our IaC tool, as it allowed us to keep our provisioning flexible and to keep one IaC script for all type of servers (baremetal, Proxmox VM, OVH VM).<br/>
    <br/>
    The implementation of the provisioning process followed these steps:
    <ul>
        <li>Reading of the JSON files defining the servers</li>
        <li>
        Depending on the server type, the appropriate IaC resources are created
        <ul>
            <li>For baremetal servers, the host metadata are configured through the OVH API, and a route on AWS R53 is created.</li>
            <li>Proxmox VMs are created based on the resources requested and the hypervisor targeted.</li>
            <li>OVH VMs are spawned following the cloud vm template provided.</li>
        </ul>
        </li>
        <li>The server is then added into Netbox so it can be found in the Ansible inventory</li>
    </ul>
    <br/>
    Still, this iteration of the provisioning process couldn't fill all the gaps: internal DNS entires were served by Bind and provisioned through another Ansible playbook, sometime resulting in inconsistencies when two persons were provisioning the DNS entries, but also in overlooking this provisioning.<br/>
    To fill this gap, I investigated the possible solutions available and designed a solution based on Consul, where the hosts would self-register into our Consul cluster, and bind would forward DNS requests when the name requested match a certain pattern.<br/>
    Including the Consul agent into our provisioning process was quite straightforward, as my colleagues had already defined the base image for our hosts using Packer, meaning that I only had to update the Ansible playbook used for the packer image with the Consul agent installation.<br/>
    The completion of this solution improved not only the automation of the provisioning process, but also made our Bind configuration more robust and maintainable, as we reduced our interactions with said configuration.<br/>
    <br/><hr/><br/>
</details>
<details>
    <summary>Setup of the backup system for Cassandra</summary>
    <br/>
    In the context of the DRP (disaster recovery plan) of the platform, a backup system for Cassandra, the main storage solution of the infrastructure, was required.<br/>
    A solution had already been implemented, using SSTableLoader to collect the backups, and dedicated servers to keep them on a ZFS filesystem via the snapshot mecanism.<br/>
    However, this solution couldn't handle the ever growing size of the Cassandra clusters, and a cloud alternative was then investigated and implemented.<br/>
    We decided to use Medusa, a backup tool for Cassandra developed by TheLastPickle, taking in account of the expertise of the said company and the features of the tool filling our needs.<br/>
    A first implementation on a small cluster has been successfully done, but an issue arose when backuping bigger clusters. Indeed Medusa was using the Cassandra snapshot mecanism to define the backup to upload, and performing snapshots on our clusters was causing performance issues.<br/>
    The cause investigation led us to the conclusion that the clusters were just too outdated (Cassandra v2 while v4 was already out) and that an upgrade was due before being able to use Medusa for our backups.<br/>
    Still, for the same reasons we coudln't perform backups, we also couldn't perform a rolling upgrade due to the rebuild mecanism of Cassandra causing performance degradation. The upgrade plan has then been designed as following:
    <ul>
        <li>Spawning new Cassandra nodes in the cluster, under a new "datacenter"</li>
        <li>Propagating the data by updating the keyspaces configuration</li>
        <li>Upgrade of the mirror DC to v3, reducing the impacts on the DC currently in use</li>
        <li>Once we are sure the new DC is up to date and stable, we update the applications' configurations to use the new DC</li>
        <li>And then we can proceed with the upgrade of the main DC in a similar manner</li>
    </ul>
    This upgrade, requiring coordination between the SRE team and the squads along with monitoring and redeployments, has been successfully performed on all clusters (from 15 to 45 nodes) without downtime, now allowing Medusa to run on them without performance degradation.<br/>
    <br/><hr/><br/>
</details>
<details>
    <summary>Offloading application authorization to Vault in Kubernetes</summary>
    <br/>
    There are few applications at Batch requiring OAuth2 authorization in order to, for example, determine if a user behind a request can access certain pieces of data.<br/>
    Such authorization were performed by a dedicated application in Kubernetes and to reduce maintenance complexity and cost, we decided to offload such capability to the Vault.<br/>
    Though we already had a Vault cluster running on VMs, we decided to configure a new cluster in Kubernetes, taking the opportunity to configure the latter so it can auto-unseal itself in case a Vault pod crashes by delegating the unsealing to the former Vault cluster.<br/>
    Having a Vault cluster in Kubernetes also made it simpler to make the applications in the same cluster authenticate themselves into Vault through Kubernetes services accounts.<br/>
    <br/><hr/><br/>
</details>
<details>
    <br/>
    <summary>Passage sous IaC des buckets, de l’IAM et des entrées DNS de Route53 chez AWS sous Terraform</summary>
    As the infrastructure grew quickly, a part of it hadn't been provisioned under IaC. With the reduction of the maintenance surface in mind, I worked on the migration of the AWS resources to Terraform.<br/>
    In contrario to the provisioning of the servers, we decided to go with Terraform instead of Pulumi, as the resources to provision were more static and didn't require the flexibility of a programming language.<br/>
    The migration was done in two steps: first the Terraform code was written to match the current state of the resources, and then the said resources were imported into Terraform.<br/>
    <br/><hr/><br/>
</details>
<details>
    <summary>Migration de 400+ repos GitLab vers GitHub, dans un but de réduire la surface de maintenance demandée à l’équipe SRE</summary>
    <br/>
    At the time I arrived at Batch, the company was using GitLab on premise as their main source code management tool. However, this setup required maintenance time from the team which would be better spent on other tasks and projects.<br/>
    I have been tasked, together with a colleague, to migrate the repositories from GitLab to GitHub.<br/>
    Before performing the migration, we surveyed the repositories to identify the ones that were still in use, the ones with a CI pipeline, and among them, which pipelines were consequently more complex than usual and would require a more careful migration.<br/>
    Such survey allowed us to identify the repositories that could be migrated in a more automated way, and the ones that would require a more manual approach, but also to prepare the migration plan for the automation script.<br/>
    The migration was then scripted, executed and the repositories were migrated in a few days, taking in account the more complex repositories requiring more care for their CI pipelines to be migrated properly.<br/>
    <br/><hr/><br/>    
</details>
<details open>
    <summary>Evolution of the infrastructure networking firewall rules</summary>
    <br/>
    Firewall rules on our servers were first managed through IPTables, which was provisioned through Ansible playbooks rendering scripts executing iptables commands.<br/>
    As such setup is far from being immutable, and the rules were getting more complex and difficult to maintain, we decided to migrate them for NFTables rules, which can be configured in a declarative way.<br/>
    Firewall rules are currently still provisioned through Ansible, but now configured through NFTables, making maintenance and predicatbility much easier.<br/>
    <br/><hr/><br/>
</details>
<details>
    <summary>Rerouting of the network flow on Kubernetes</summary>
    <br/>
    Our Kubernetes cluster has been first provisioned along two sets of proxies: one for the traffic going to internet, another for the internal traffic, between Kubernetes and the rest of the infrastructure.<br/>
    As the infrastructure grew and such set of proxies were expected to become a bottleneck in the near future, I have been tasked to update the routing of the traffic by using <a href="https://frrouting.org/">free range routing</a>, update made possible thanks to the work done previously on the migration of the infrastructure firewall rules from IPTables to NFTables.<br/>
    Using FRR on the infrastructure makes each servers aware of the services published in Kubernetes, making it possible to directly communicate to a Kubernetes service without having to pass through the previously existing set of proxies.<br/>
    Combined with the dynamic DNS publication of the Kubernetes services into Consul performed in the evolution of the provisioning process, services can now be reached through a name anywhere in the infrastructure!<br/>
    <br/><hr/><br/>
</details>
`

consultantEnxBnppfBody = `
Au sein de l’équipe gérant le logging interne chez BNPPF, j’ai rejoins l’équipe Logging et Monitoring dans la migration de leur infrastructure de logging dans le cadre de cette mission commissionée auprès de l’entreprise EURA NOVA.<br/>

La précédente version de cette infrastructure était basée sur un ensemble de fichiers non structurés, lu de manière plannifiées par des applications faites maison dans le but de générer une table MSSQL par jour.<br/>

La nouvelle version est centrée sur Kafka & Flink, afin de centralisé l’afflux des logs applicatifs, de pouvoir parser ces dernier et les stocker dans une solution S3 interne pour le cold storage, ainsi que dans Elasticsearch pour du storage plus court terme.<br/>

Mon role au sein de cet équipe a été le design de Job Flink ainsi que leur implémentation, ainsi que l’exploration de solutions similaire à Flink afin d’informer l’équipe sur la judicité de leur choix technique tout en respectant les contraintes du secteur.<br/>
`

consultantEnxBicsBody = `
Au sein de l’entreprise BICS, j’ai collaboré avec deux équipes.<br/>

La première équipe a eu pour responsabilité la migration d’une application centrée Informatica sur Teradata vers plusieurs applications autour de l’écosystème Hadoop+Spark, afin de pouvoir non seulement réduire les couts d’infrastructure, mais également de profiter d’une infrastructure plus flexible.<br/>

Cette nouvelle infrastructure est composée de scripts python récoltant des fichiers sur un serveur FTP, fichiers ensuite lus par Apache Nifi pour les envoyer sur Hadoop HDFS. Des jobs Spark sont implémentés pour lire ces fichiers, enrichir les entrées, les transformer et les restocker dans HDFS, selon la logique précédemment définie dans Teradata.<br/>

La seconde équipe que j’ai rejoins a pour role de rechercher et d’effectuer des analyses avancées des données internes. Avec cette équipe, j’ai pu interagir de prêt avec les data scientists pour industrialiser leur modèles ainsi qu’explorer différentes possibilité de parallelisations.<br/>

Réalisations :<br/>

- Extraction de la logique de précédentes requêtes SQL pour passer le processing sous jobs Spark<br/>

- Design & implémentation d’une pipeline de préparation de données pour futures exécutions de modèles alliant SQOOP, HDFS, Spark<br/>

- Utilisation d’Avro afin de bénéficier de la vérification de schéma, via le schema registry Atlas, dans le traitement de données mentionné au dessus.<br/>

- Lead de deux personnes sur le sujet de la préparation de données<br/>

- Conversion de modèles python vers des jobs Spark<br/>

- Industrialisation de notebooks Jupyter en packages python pour leur exécution en production<br/>

- Contribution aux dashboard QlikSense<br/>
`

consultantEnxSwiftBody = `
Au sein de l’équipe logging & monitoring, j’ai participé à la mise en place de la plateforme de logging interne dans le but de facilité l’analyse des logs des différentes applications interne.<br/>

Cette plateforme, installée sur du baremetal en interne, est constituée d’Apache Flume et d’Apache Flink pour l’ingestion et la collecte des logs, d’Apache Kafka comme système de log, d’Apache Spark pour le traitement des logs, et de la stack ELK pour le stockage à chaud et la visualisation des logs. Hadoop HDFS est également installé afin de pouvoir bénéficier du stockage à froid de la donnée. <br/>

Réalisations :<br/>

- Implémentation en équipe de la plateforme de logging, de la gestion des machines, la conteneurisation des logiciels et la mise en place des flux de logs en production<br/>

- Configuration de la sécurity sur la stack ELK via SearchGuard<br/>

- Design et implémentation de job Spark & Flink<br/>

- Design & Implémentation d’une pipeline Jenkins simplifiant la génération de code & pipeline de déploiement à destination des autres équipes<br/>

- Design et implémentation d’outils utilisé par les employés business afin de faciliter l’ingestions de leurs exports, leur permettant de corréler facilement leur donnée<br/>

- Mise en place du cluster HDFS avec un dispositif de réingestion de données ainsi que la mise en place d’Apache Zeppelin en tant que lab analytique<br/>

- Implémentation et maintenance des playbooks ansible pour le provisioning de la plateforme<br/>

- Installation d’une solution de monitoring basée sur la stack ELK<br/>

- Travail en équipe, allant de 3 à 9 personnes dont certaines à Singapour<br/>

- Utilisation de Docker pour isoler certains process et faciliter le déploiement de certaines applications<br/>

- Extraction de la logique de précédentes requêtes SQL pour passer le processing sous jobs Spark <br/>
`


const experienceMap = {
    sreBatch: {
        title: 'DevOps/Site Reliability Engineer',
        company: '<a style="color: inherit; text-decoration: inherit;" href="https://batch.com" target="_blank" rel="noopener noreferrer">Batch</a>',
        location: 'Lyon, France',
        period: '2021/09 - 2025/12',
        description: 'DevOps/SRE in a relatively small SRE team (3-6 out of 20-30 in the tech dpt.), in an environment with high availability requirements based on baremetal servers running Kubernetes, Kafka, Cassandra, etc.',
        body: sreBatchBody,
        tags: ["Ansible", "Kubernetes", "Docker", "Terraform", "Pulumi", "VictoriaMetrics", "Linux", "Kafka", "Cassandra", "GitHub Actions", "AWS", "Python", "Go", "Bash", "HAProxy", "Consul", "KeepAlived", "Orchestrator", "Packer", "Consul-template", "Medusa", "Vault", "NFTables", "OpenTelemetry"]
    },
    consultantEnxBnppf: {
        title: 'Consultant in data engineering',
        company: '<a style="color: inherit; text-decoration: inherit;" href="https://www.bnpparibasfortis.be" target="_blank" rel="noopener noreferrer">BNP Paribas Fortis</a> (through <a style="color: inherit; text-decoration: inherit;" href="https://euranova.eu" target="_blank" rel="noopener noreferrer">EURA NOVA</a>)',
        location: 'Brussels, Belgium',
        period: '2020/05 - 2021/09',
        description: 'Development of Flink jobs in the context of a platform migration.',
        body: consultantEnxBnppfBody,
        tags: ["Linux", "Kafka", "Flink", "S3", "Elasticsearch"]
    },
    consultantEnxBics: {
        title: 'Consultant in data engineering',
        company: '<a style="color: inherit; text-decoration: inherit;" href="https://www.bics.com/" target="_blank" rel="noopener noreferrer">BICS</a> (through <a style="color: inherit; text-decoration: inherit;" href="https://euranova.eu" target="_blank" rel="noopener noreferrer">EURA NOVA</a>)',
        location: 'Brussels, Belgium',
        period: '2019/02 - 2020/03',
        description: 'Collaboration with the data scientists in order to deliver prod ready packages of the models, as well as preparing the data with a deidcated ingestion & processing pipeline.',
        body: consultantEnxBicsBody,
        tags: ["Python", "Spark", "Hadoop", "Nifi", "SQL", "Avro", "Atlas", "SQOOP", "HDFS", "Jupyter", "QlikSense", "Jenkins", "Scala", "SQL"]
    },
    consultantEnxSwift: {
        title: 'Consultant in data engineering',
        company: '<a style="color: inherit; text-decoration: inherit;" href="https://www.swift.com/" target="_blank" rel="noopener noreferrer">Swift</a> (through <a style="color: inherit; text-decoration: inherit;" href="https://euranova.eu" target="_blank" rel="noopener noreferrer">EURA NOVA</a>)',
        location: 'La Hulpe, Belgium',
        period: '2015/11 - 2018/12',
        description: 'Realisation of a logging platform on baremetal based on the ELK stack, with a Kafka-based log collection system and a custom log parsing solution to extract structured data from unstructured logs.',
        body: consultantEnxSwiftBody,
        tags: ["Jenkins", "Kafka", "Elasticsearch", "Logstash", "Kibana", "Linux", "Flink", "Spark", "Docker", "Ansible", "Hadoop", "HDFS", "SearchGuard", "Jupyter", "Python", "Scala"]
    },
    /*internKeio: {

    }*/
};
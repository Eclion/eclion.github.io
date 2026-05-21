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
    Simplification du process de provisioning de serveurs passant de scripts python et 3 playbooks Ansible à un système alliant Packer, Pulumi et Ansible, réduisant ainsi les étapes de provisioning et les erreurs humaines.
</details>
<details>
    <summary>Setup of the backup system for Cassandra</summary>
    Zero-downtime upgrades of 30+nodes Cassandra clusters
    Mises à jour sans coupures de clusters Cassandra, allant d’un design du plan de mise à jour, au pilotage de cette mise à jour nécessitant une coordination transverse des équipes afin de pouvoir basculer les applications entre les datacenters d’un même cluster Cassandra.
    Implementation of a software to partially restore a Cassandra backup made by Medusa
</details>
<details>
    <summary>Deployment of Vault in Kubernetes along with service-account based authentications for applications</summary>
</details>
<details>
    <summary>Passage sous IaC des buckets, de l’IAM et des entrées DNS de Route53 chez AWS sous Terraform</summary>
</details>
<details>
    <summary>Migration de 400+ repos GitLab vers GitHub, dans un but de réduire la surface de maintenance demandée à l’équipe SRE</summary>
    
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

consultantEnxBnppfBody = `
Au sein de l’équipe gérant le logging interne chez BNPPF, j’ai rejoins l’équipe Logging et Monitoring dans la migration de leur infrastructure de logging dans le cadre de cette mission commissionée auprès de l’entreprise EURA NOVA.

La précédente version de cette infrastructure était basée sur un ensemble de fichiers non structurés, lu de manière plannifiées par des applications faites maison dans le but de générer une table MSSQL par jour.

La nouvelle version est centrée sur Kafka & Flink, afin de centralisé l’afflux des logs applicatifs, de pouvoir parser ces dernier et les stocker dans une solution S3 interne pour le cold storage, ainsi que dans Elasticsearch pour du storage plus court terme.

Mon role au sein de cet équipe a été le design de Job Flink ainsi que leur implémentation, ainsi que l’exploration de solutions similaire à Flink afin d’informer l’équipe sur la judicité de leur choix technique tout en respectant les contraintes du secteur.
`

consultantEnxBicsBody = `
Au sein de l’entreprise BICS, j’ai collaboré avec deux équipes.

La première équipe a eu pour responsabilité la migration d’une application centrée Informatica sur Teradata vers plusieurs applications autour de l’écosystème Hadoop+Spark, afin de pouvoir non seulement réduire les couts d’infrastructure, mais également de profiter d’une infrastructure plus flexible.

Cette nouvelle infrastructure est composée de scripts python récoltant des fichiers sur un serveur FTP, fichiers ensuite lus par Apache Nifi pour les envoyer sur Hadoop HDFS. Des jobs Spark sont implémentés pour lire ces fichiers, enrichir les entrées, les transformer et les restocker dans HDFS, selon la logique précédemment définie dans Teradata.

La seconde équipe que j’ai rejoins a pour role de rechercher et d’effectuer des analyses avancées des données internes. Avec cette équipe, j’ai pu interagir de prêt avec les data scientists pour industrialiser leur modèles ainsi qu’explorer différentes possibilité de parallelisations.

Réalisations :

- Extraction de la logique de précédentes requêtes SQL pour passer le processing sous jobs Spark

- Design & implémentation d’une pipeline de préparation de données pour futures exécutions de modèles alliant SQOOP, HDFS, Spark

- Utilisation d’Avro afin de bénéficier de la vérification de schéma, via le schema registry Atlas, dans le traitement de données mentionné au dessus.

- Lead de deux personnes sur le sujet de la préparation de données

- Conversion de modèles python vers des jobs Spark

- Industrialisation de notebooks Jupyter en packages python pour leur exécution en production

- Contribution aux dashboard QlikSense 
`

consultantEnxSwiftBody = `
Au sein de l’équipe logging & monitoring, j’ai participé à la mise en place de la plateforme de logging interne dans le but de facilité l’analyse des logs des différentes applications interne.

Cette plateforme, installée sur du baremetal en interne, est constituée d’Apache Flume et d’Apache Flink pour l’ingestion et la collecte des logs, d’Apache Kafka comme système de log, d’Apache Spark pour le traitement des logs, et de la stack ELK pour le stockage à chaud et la visualisation des logs. Hadoop HDFS est également installé afin de pouvoir bénéficier du stockage à froid de la donnée. 

Réalisations :

- Implémentation en équipe de la plateforme de logging, de la gestion des machines, la conteneurisation des logiciels et la mise en place des flux de logs en production

- Configuration de la sécurity sur la stack ELK via SearchGuard

- Design et implémentation de job Spark & Flink

- Design & Implémentation d’une pipeline Jenkins simplifiant la génération de code & pipeline de déploiement à destination des autres équipes

- Design et implémentation d’outils utilisé par les employés business afin de faciliter l’ingestions de leurs exports, leur permettant de corréler facilement leur donnée

- Mise en place du cluster HDFS avec un dispositif de réingestion de données ainsi que la mise en place d’Apache Zeppelin en tant que lab analytique

- Implémentation et maintenance des playbooks ansible pour le provisioning de la plateforme

- Installation d’une solution de monitoring basée sur la stack ELK

- Travail en équipe, allant de 3 à 9 personnes dont certaines à Singapour

- Utilisation de Docker pour isoler certains process et faciliter le déploiement de certaines applications

- Extraction de la logique de précédentes requêtes SQL pour passer le processing sous jobs Spark 
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
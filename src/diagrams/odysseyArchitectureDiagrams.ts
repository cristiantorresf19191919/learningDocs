/* ------------------------------------------------------------------ */
/*  Odyssey-Api Architecture Diagrams — Mermaid source definitions      */
/* ------------------------------------------------------------------ */

export const highLevelArchitecture = `graph TB
    subgraph Frontend["Driveway.com Frontend"]
        WEB["Web App"]
    end

    subgraph AKS["AKS Cluster — Odyssey Services"]
        ROUTES["routes<br/>REST + GraphQL Mutations"]
        SEARCH["search<br/>GraphQL Queries"]
        CRON["cron<br/>Scheduled Jobs"]
        CONSUMER["consumer<br/>Service Bus Listener"]
        AVAIL["availability<br/>Service Bus Listener"]
    end

    subgraph Shared["Shared Libraries"]
        LIB["library<br/>Models, DAOs, Clients"]
        GQL["graphql-shared<br/>Shared GraphQL Types"]
    end

    subgraph Azure["Azure Services"]
        MONGO[("MongoDB Atlas<br/>shopInventory")]
        BLOB[("Azure Blob Storage<br/>container: inbound")]
        ASB["Azure Service Bus<br/>4 Topics"]
    end

    subgraph External["External APIs"]
        MAXD["MaxDigital API<br/>Vehicle Photos"]
        IMPEL["Impel/SpinCar<br/>360 Spins"]
        LIBRA["Libra API<br/>Dealerships"]
        INCENT["Incentives API<br/>OEM Regions"]
        TAXFEE["Tax & Fee API<br/>Shipping Costs"]
    end

    WEB --> ROUTES
    WEB --> SEARCH

    ROUTES --> LIB
    ROUTES --> GQL
    SEARCH --> LIB
    SEARCH --> GQL
    CRON --> LIB
    CONSUMER --> LIB
    AVAIL --> LIB

    ROUTES --> MONGO
    SEARCH --> MONGO
    CRON --> MONGO
    CONSUMER --> MONGO
    AVAIL --> MONGO

    CRON --> BLOB
    CRON --> ASB
    CONSUMER --> ASB
    AVAIL --> ASB

    SEARCH --> MAXD
    ROUTES --> IMPEL
    CRON --> LIBRA
    CRON --> INCENT
    CRON --> TAXFEE

    classDef routesStyle fill:#4a90d9,stroke:#3a7bc8,color:#fff
    classDef searchStyle fill:#50c878,stroke:#40b868,color:#fff
    classDef cronStyle fill:#f5a623,stroke:#e59613,color:#fff
    classDef consumerStyle fill:#bd10e0,stroke:#ad00d0,color:#fff
    classDef availStyle fill:#d0021b,stroke:#c0020b,color:#fff
    classDef libStyle fill:#7b8a8b,stroke:#6b7a7b,color:#fff

    class ROUTES routesStyle
    class SEARCH searchStyle
    class CRON cronStyle
    class CONSUMER consumerStyle
    class AVAIL availStyle
    class LIB,GQL libStyle`;

export const moduleDependencyGraph = `graph LR
    subgraph Deployable["Deployable Services"]
        ROUTES["routes<br/>Spring Boot"]
        SEARCH["search<br/>Spring Boot"]
        CRON["cron<br/>Spring Boot"]
        CONSUMER["consumer<br/>Spring Boot"]
        AVAIL["availability<br/>Spring Boot"]
    end

    subgraph Libraries["Shared Libraries"]
        LIB["library<br/>Core shared code"]
        GQL["graphql-shared"]
    end

    subgraph Dev["Dev / Test"]
        UTIL["utilities"]
        TESTS["tests"]
    end

    ROUTES --> LIB
    ROUTES --> GQL
    SEARCH --> LIB
    SEARCH --> GQL
    CRON --> LIB
    CONSUMER --> LIB
    AVAIL --> LIB
    GQL --> LIB
    UTIL --> LIB
    TESTS --> LIB

    classDef routesStyle fill:#4a90d9,stroke:#3a7bc8,color:#fff
    classDef searchStyle fill:#50c878,stroke:#40b868,color:#fff
    classDef cronStyle fill:#f5a623,stroke:#e59613,color:#fff
    classDef consumerStyle fill:#bd10e0,stroke:#ad00d0,color:#fff
    classDef availStyle fill:#d0021b,stroke:#c0020b,color:#fff
    classDef libStyle fill:#7b8a8b,stroke:#6b7a7b,color:#fff
    classDef devStyle fill:#bdc3c7,stroke:#adb3b7,color:#333

    class ROUTES routesStyle
    class SEARCH searchStyle
    class CRON cronStyle
    class CONSUMER consumerStyle
    class AVAIL availStyle
    class LIB,GQL libStyle
    class UTIL,TESTS devStyle`;

export const edsImportFlow = `sequenceDiagram
    participant SCHED as Scheduler<br/>every 30 min
    participant EDS as EdsVehicleReaderV2
    participant IMP as CronEdsVehicleImporter
    participant BLOB as Azure Blob Storage
    participant TEMP as temp_vehicleV3
    participant LIVE as vehicleV3
    participant ASB as Service Bus
    participant LEASE as CronLeasing

    SCHED->>EDS: runVehicleReaderImport()
    EDS->>BLOB: List GZIP TSV files
    BLOB-->>EDS: File list

    loop For each GZIP TSV file
        EDS->>BLOB: Download & decompress
        BLOB-->>EDS: TSV rows (76 fields each)
        EDS->>EDS: Parse → Vehicle objects

        loop Batch 500, 5 semaphores
            EDS->>IMP: Import batch
            IMP->>TEMP: Upsert to temp collection
        end
    end

    EDS->>EDS: Validate delta < 15,000

    alt Delta too large
        EDS->>EDS: SUSPICIOUS_FILE — abort
    else Delta acceptable
        EDS->>LIVE: Compare temp vs live
        EDS->>ASB: Publish InventoryDeltas (ADD/UPDATE/DELETE)

        Note over EDS,LIVE: Merge preserves: leasing,<br/>manual suppressions,<br/>purchase pending, availability

        EDS->>LIVE: Merge temp → vehicleV3
        EDS->>LIVE: Mark missing as DELETED
        EDS->>TEMP: Drop temp collection
    end

    SCHED->>LEASE: Check lease expiries
    LEASE->>LIVE: Clear expired leasing data`;

export const searchQueryFlow = `flowchart TB
    subgraph Client["Client Request"]
        CLIENT["Frontend / GraphQL Client"]
    end

    subgraph SearchModule["search module"]
        QUERY["SearchPageQueries<br/>search / getFacets / getSuggestions"]
        PB["PipelineBuilder"]
        SB["SearchBuilder"]
        FB["FilterBuilder"]
        TB2["TextBuilder"]
        SHIP["ShippingBuilder"]
        LEAS["LeasingBuilder"]
    end

    subgraph AggDSL["library — Aggregation DSL"]
        PIPE["Pipeline"]
        SEARCH_BLK["SearchBlock — $search stage"]
        COMPOUND["CompoundBlock<br/>must / should / filter / mustNot"]
        TEXT["TextBlock"]
        RANGE["RangeBlock"]
        NEAR["NearBlock"]
        EQUALS["EqualsBlock"]
        EXISTS["ExistsBlock"]
        PROJ["ProjectBlock / AddFieldsBlock"]
    end

    subgraph Mongo["MongoDB Atlas"]
        ATLAS[("vehicleV3<br/>Atlas Search: shopSearch")]
        WEIGHTS[("searchScoreWeights")]
    end

    CLIENT -->|"GraphQL query"| QUERY
    QUERY --> PB

    PB --> SB
    PB --> FB
    PB --> TB2
    PB --> SHIP
    PB --> LEAS

    SB --> PIPE
    FB --> PIPE

    PIPE --> SEARCH_BLK
    SEARCH_BLK --> COMPOUND
    COMPOUND --> TEXT
    COMPOUND --> RANGE
    COMPOUND --> NEAR
    COMPOUND --> EQUALS
    COMPOUND --> EXISTS

    PIPE --> PROJ
    WEIGHTS --> SEARCH_BLK

    PIPE -->|"List&lt;Bson&gt;"| ATLAS
    ATLAS -->|"Vehicle results"| QUERY
    QUERY -->|"GraphQL response"| CLIENT

    classDef queryStyle fill:#50c878,stroke:#40b868,color:#fff
    classDef atlasStyle fill:#4a90d9,stroke:#3a7bc8,color:#fff
    classDef searchStyle fill:#f5a623,stroke:#e59613,color:#fff

    class QUERY queryStyle
    class ATLAS atlasStyle
    class SEARCH_BLK searchStyle`;

export const serviceBusFlows = `flowchart LR
    subgraph Publishers
        CRON_PUB["cron<br/>EDS Import"]
        CART_SYS["Cart System<br/>External"]
        LEASE_SYS["Leasing System<br/>External"]
    end

    subgraph Topics["Azure Service Bus Topics"]
        IDT["inventory-delta-topic"]
        CST["cart-status-update-topic"]
        LIT["leasing-incentives-topic"]
        VDT["vehicle-data-topic"]
    end

    subgraph Subscribers
        CONSUMER_SVC["consumer<br/>LeaseTopicReceiver"]
        AVAIL_SVC["availability<br/>CartTopicConsumerStarter"]
    end

    subgraph Processing
        LMP["LeasingIncentivesMessageProcessor"]
        LH["LeaseHandler<br/>Update vehicle.leasing"]
        IH["IncentivesHandler<br/>No-op / logs"]
        ARH["AvailabilityRequestHandler<br/>Stale message detection"]
        AP["AvailabilityProcessor<br/>upsertPurchasePending"]
    end

    subgraph MongoDB
        DB[("vehicleV3")]
    end

    CRON_PUB -->|"InventoryDelta<br/>ADD/UPDATE/DELETE"| IDT
    CART_SYS -->|"Cart status events"| CST
    LEASE_SYS -->|"LEASING / INCENTIVE"| LIT

    LIT --> CONSUMER_SVC
    CONSUMER_SVC --> LMP
    LMP -->|"type=LEASING"| LH
    LMP -->|"type=INCENTIVE"| IH
    LH --> DB

    CST --> AVAIL_SVC
    AVAIL_SVC --> ARH
    ARH -->|"not stale"| AP
    AP --> DB

    classDef topicStyle fill:#f5a623,stroke:#e59613,color:#fff
    classDef consumerStyle fill:#bd10e0,stroke:#ad00d0,color:#fff
    classDef availStyle fill:#d0021b,stroke:#c0020b,color:#fff

    class IDT,CST,LIT,VDT topicStyle
    class CONSUMER_SVC consumerStyle
    class AVAIL_SVC availStyle`;

export const restApiFlows = `flowchart TB
    subgraph Incoming["Incoming Requests"]
        IMPEL_WH["Impel Webhook<br/>POST /impel/spin-notification"]
        ADMIN["Admin Tools<br/>Score Weight CRUD"]
        LEASE_SINK["Leasing Sink Client<br/>GET /sink/leasing"]
        GQL_MUT["GraphQL Mutations"]
    end

    subgraph Routers["routes — Routers"]
        IR["ImpelNotificationRouter"]
        SWR["SearchScoreWeightsRouter"]
        LSR["LeasingSinkRouter"]
    end

    subgraph Handlers["routes — Handlers"]
        INH["ImpelNotificationHandler<br/>Validate + update spinUrl"]
        SWH["SearchScoreWeightsHandler<br/>CRUD versioned weights"]
    end

    subgraph Mutations["GraphQL Mutations"]
        MS["updateManualSuppressions"]
        PP["updatePurchasePending"]
        UC["updateCategories"]
        UF["updateFeatures"]
        TV["inputTestVehicle (dev only)"]
    end

    subgraph Ext["External"]
        IMPEL_API["Impel/SpinCar API"]
    end

    subgraph Storage["MongoDB"]
        VDB[("vehicleV3")]
        SWDB[("searchScoreWeights")]
    end

    IMPEL_WH --> IR --> INH
    INH --> IMPEL_API
    INH --> VDB

    ADMIN --> SWR --> SWH
    SWH --> SWDB

    LEASE_SINK --> LSR -->|"NDJSON stream"| VDB

    GQL_MUT --> MS --> VDB
    GQL_MUT --> PP --> VDB
    GQL_MUT --> UC --> VDB
    GQL_MUT --> UF --> VDB
    GQL_MUT --> TV --> VDB

    classDef routerStyle fill:#4a90d9,stroke:#3a7bc8,color:#fff
    classDef handlerStyle fill:#2c3e50,stroke:#1c2e40,color:#fff

    class IR,SWR,LSR routerStyle
    class INH,SWH handlerStyle`;

export const imageSpinFlow = `sequenceDiagram
    participant CLIENT as Frontend
    participant SEARCH as search module<br/>ImageQueries
    participant MAXD as MaxDigital API
    participant IMPEL as Impel/SpinCar API
    participant ROUTES as routes module
    participant DB as MongoDB vehicleV3

    Note over CLIENT,DB: Image Gallery Flow
    CLIENT->>SEARCH: getVehicleImagesById(vehicleId)
    SEARCH->>MAXD: GraphQL query (X-API-Key)
    MAXD-->>SEARCH: Photo gallery (6 sizes)
    SEARCH-->>CLIENT: Image URLs

    Note over CLIENT,DB: 360 Spin Notification Flow
    IMPEL->>ROUTES: POST /impel/spin-notification
    ROUTES->>IMPEL: Validate spin exists
    IMPEL-->>ROUTES: Spin data
    ROUTES->>DB: Update image.spinUrl
    ROUTES-->>IMPEL: 200 OK

    Note over CLIENT,DB: Spin Count Metric (every 5 min)
    DB->>DB: Count vehicles with spinUrl != null`;

export const cicdPipeline = `flowchart LR
    subgraph Source
        PR["Pull Request"]
        MAIN["main branch"]
    end

    subgraph BuildValidate["Build & Validate"]
        BUILD["Gradle Build"]
        TEST["JUnit 5 Tests"]
        COV["Kover Coverage"]
        LINT["Kotlinter Lint"]
    end

    subgraph Package
        DOCKER["Docker Image<br/>JDK 21 + DD Agent"]
    end

    subgraph Infra["Infrastructure"]
        TF["Terraform<br/>MongoDB + Service Bus"]
    end

    subgraph Deploy
        HELM["Helm Deploy<br/>to AKS"]
    end

    subgraph Verify
        SMOKE["Smoke Tests"]
        POSTMAN["Postman<br/>Functional Tests"]
    end

    subgraph Envs["Environments"]
        DEV["DEV<br/>Auto on main<br/>1 replica"]
        UAT["UAT<br/>Manual<br/>3–12 replicas"]
        PROD["PROD<br/>Manual + CR<br/>3–12 replicas"]
    end

    PR --> BUILD
    MAIN --> BUILD
    BUILD --> TEST --> COV --> LINT
    LINT --> DOCKER
    DOCKER --> TF --> HELM
    HELM --> SMOKE --> POSTMAN

    MAIN --> DEV
    DEV -.->|"manual"| UAT
    UAT -.->|"manual + CR"| PROD

    classDef devStyle fill:#50c878,stroke:#40b868,color:#fff
    classDef uatStyle fill:#f5a623,stroke:#e59613,color:#fff
    classDef prodStyle fill:#d0021b,stroke:#c0020b,color:#fff

    class DEV devStyle
    class UAT uatStyle
    class PROD prodStyle`;

export const mongoCollections = `erDiagram
    vehicleV3 {
        string vin PK
        string vehicleId
        enum status
        boolean manuallySuppressed
        object ymmt
        enum vehicleCondition
        int price
        object leasing
        object availability
        object dealer
        object image
        string lastSeenJobId
    }

    searchSuggestion {
        string value UK
        string type
        int count
    }

    postalCodeOemRegions {
        string postalCode PK
        list regions
    }

    searchScoreWeights {
        string sortType PK
        int version PK
        boolean enabled
        list blocks
    }

    inventoryJobDetails {
        string runId PK
        enum status
        enum importType
        datetime startTime
        int vehicleCount
    }

    vehicleV3 ||--o{ searchSuggestion : "feeds autocomplete"
    vehicleV3 }o--|| inventoryJobDetails : "imported by"
    vehicleV3 }o--o{ postalCodeOemRegions : "dealer zip lookup"
    searchScoreWeights ||--o{ vehicleV3 : "ranks search results"`;

export const vehicleLifecycle = `stateDiagram-v2
    [*] --> BlobStorage: EDS TSV uploaded

    BlobStorage --> TempCollection: Cron parses & imports

    TempCollection --> Validation: Delta check
    Validation --> Aborted: delta > 15000
    Validation --> LiveCollection: delta acceptable

    state LiveCollection {
        [*] --> ACTIVE
        ACTIVE --> ACTIVE: EDS update
        ACTIVE --> INACTIVE: Business rules
        ACTIVE --> DELETED: Not in EDS file
        DELETED --> [*]: Stale cleanup hourly
    }

    state Enrichment {
        LeasingUpdate: Leasing Data via Service Bus
        SpinUpdate: 360 Spin URL via Impel
        PurchasePending: Purchase Pending via Cart
        ManualSuppression: Manual Suppression via GraphQL
    }

    LiveCollection --> Enrichment: Vehicle exists
    Enrichment --> LiveCollection: Field updated

    LiveCollection --> SearchIndex: Atlas Search index
    SearchIndex --> Frontend: GraphQL queries

    Aborted --> [*]: Job marked SUSPICIOUS_FILE`;

export const springProfiles = `flowchart TB
    subgraph Laptop["laptop profile"]
        L_MONGO["MongoDB<br/>127.0.0.1:27020"]
        L_BLOB["Azurite<br/>localhost:10010"]
        L_CRON["Cron: DISABLED"]
        L_ASB["DummyMessageSender<br/>logs only"]
        L_BH["BlockHound: OFF"]
        L_CORS["CORS: Permissive"]
        L_DD["DataDog: OFF"]
    end

    subgraph Cloud["dev / uat / prod profiles"]
        P_MONGO["MongoDB Atlas<br/>from Key Vault"]
        P_BLOB["Azure Blob Storage<br/>Real container"]
        P_CRON["Cron: ENABLED<br/>All 5 jobs"]
        P_ASB["ServiceBusMessageSender<br/>Real Azure Service Bus"]
        P_BH["BlockHound: ON"]
        P_DD["DataDog Agent<br/>JVM metrics"]
    end

    BASE["application.yml<br/>Base config"] --> L_MONGO
    BASE --> P_MONGO

    classDef disabledStyle fill:#d0021b,stroke:#c0020b,color:#fff
    classDef enabledStyle fill:#50c878,stroke:#40b868,color:#fff
    classDef warnStyle fill:#f5a623,stroke:#e59613,color:#fff

    class L_CRON disabledStyle
    class P_CRON,P_ASB enabledStyle
    class L_ASB warnStyle`;

export const cronScheduleOverview = `flowchart TB
    subgraph Cron["Cron Scheduled Jobs"]
        direction TB
        EDS["EDS Vehicle Import<br/>every 30 min<br/>0 0,30 * * * *"]
        REGION["Postal Code Region Sync<br/>4x daily<br/>0 45 0,6,12,18 * * *"]
        STALE["Stale Records Cleanup<br/>hourly at :15<br/>0 15 * * * *"]
        TEMP["Temp Collections Cleanup<br/>daily at 08:10<br/>0 10 8 * * *"]
        SPIN["Spin Count Metric<br/>every 5 min<br/>30 */5 * * * *"]
    end

    subgraph Targets["What They Do"]
        direction TB
        T1["Import inventory from<br/>Azure Blob + apply lease expiries"]
        T2["Sync OEM region mappings<br/>from Incentives API"]
        T3["Delete vehicles with<br/>status = DELETED"]
        T4["Drop temp collections<br/>older than 28 days"]
        T5["Update 360 spin<br/>photo count metric"]
    end

    EDS --> T1
    REGION --> T2
    STALE --> T3
    TEMP --> T4
    SPIN --> T5

    classDef cronCrit fill:#d0021b,stroke:#c0020b,color:#fff
    classDef cronWarn fill:#f5a623,stroke:#e59613,color:#fff
    classDef cronInfo fill:#4a90d9,stroke:#3a7bc8,color:#fff
    classDef cronOk fill:#50c878,stroke:#40b868,color:#fff
    classDef cronDim fill:#7b8a8b,stroke:#6b7a7b,color:#fff

    class EDS cronCrit
    class REGION cronWarn
    class STALE cronInfo
    class TEMP cronOk
    class SPIN cronDim`;

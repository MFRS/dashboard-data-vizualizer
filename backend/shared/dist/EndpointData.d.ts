export interface EndpointData {
    region: string;
    status: 'online' | 'offline';
    load: number;
    stats: {
        servers_count: number;
        online: number;
        session: number;
        server: {
            cpus: number;
            active_connections: number;
            wait_time: number;
            workers: any[];
            cpu_load: number;
            timers: number;
        };
    };
    services: {
        redis: boolean;
        database: boolean;
    };
    version: string;
}

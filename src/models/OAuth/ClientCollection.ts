import Client from "./Client";

const ClientCollection: Client[] = [
    {
        id: "aebb974a-3b14-4d58-8a74-72b7436deb71",
        name: "typescript-mern-starter",
        secret: "mern-is-awesome",
        redirectUri: "http://localhost:" + process.env.PORT + "/auth/callback",
    }
    // Register new client here
];

export default ClientCollection;
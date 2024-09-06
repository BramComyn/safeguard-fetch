import { secureServerOptions } from '../util';
import { AttackServerHttpFactory } from './attack-server-factory/AttackServerHttpFactory';
import { AttackServerHttp2SecureFactory } from './attack-server-factory/AttackServerHttp2SecureFactory';
import { AttackServerHttp } from './attack-server/AttackServerHttp';
import { AttackServerHttp2 } from './attack-server/AttackServerHttp2';

const httpserver = new AttackServerHttp(8080, new AttackServerHttpFactory());
httpserver.startServer();

// This server is unusable as there are no browsers or clients that support HTTP/2.0 over TCP
// const http2server = new AttackServerHttp2(8081, new AttackServerHttp2UnsecureFactory());
// http2server.startServer();

const http2secureServer = new AttackServerHttp2(8443, new AttackServerHttp2SecureFactory(), secureServerOptions);
http2secureServer.startServer();

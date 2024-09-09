import { VictimClient } from '../../src/victim-client/VictimClient';

const victimClient = new VictimClient();
victimClient.startSession().catch(console.error);

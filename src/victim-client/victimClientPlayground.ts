import { VictimClient } from './VictimClient';

const victimClient = new VictimClient();
victimClient.startSession().catch(console.error);

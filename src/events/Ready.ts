import Client from '../structures/Client';
import Event from '../structures/Event';
import w from 'wumpfetch';

export default class ReadyEvent extends Event {
    constructor(client: Client) {
        super(client, 'ready');
    }

    async emit() {
        this.client.logger.discord(`Logged in as ${this.client.user.username}#${this.client.user.discriminator} (${this.client.user.id})`);
        this.client.editStatus('online', {
            name: 'Members',
            type: 3
        });
        
        this.client.timeouts.reapplyTimeouts();
    }
}
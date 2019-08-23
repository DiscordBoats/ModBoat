import { Message, TextChannel } from 'eris';
import Client from '../structures/Client';
import Event from '../structures/Event';

export default class MessageReceivedEvent extends Event {
    constructor(client: Client) {
        super(client, 'messageCreate');
    }

    async emit(m: Message) {
        if (m.channel.type == 0) {
            this.client.manager.service.handle(m);
            this.client.autoModService.handle(m);
        }
    }
}
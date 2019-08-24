import { readdir } from 'fs';
import { sep } from 'path';
import Client from '../Client';
import Event from '../Event';

export default class EventManager {
    public client: Client;
    public path: string = `${process.cwd()}${sep}dist${sep}events`;

    /**
     * Creates a new instance of the event manager
     * @param client The client instance
     */
    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Starts the event manager's process
     */
    start() {
        readdir(this.path, (error, files) => {
            if (error) this.client.logger.log('error', error.stack ? error.stack : '');
            this.client.logger.log('info', `Building ${files.length} event${files.length > 1? 's': ''}!`);
            files.forEach((file) => {
                try {
                    const event = require(`${this.path}${sep}${file}`);
                    const ev: Event = new event.default(this.client);
                    this.emit(ev);
                } catch (ignored) {}
                
            });
        });
    }

    /**
     * Emits the event to the `EventEmitter` from the Eris client
     * @param ev The event
     */
    emit(ev: Event) {
        const wrapper = async(...args) => {
            try {
                await ev.emit(...args);
            } catch(ex) {
                this.client.logger.log('error', `Unable to run the "${ev.event}" event:\n${ex}`);
            }
        };
        this.client.on(ev.event, wrapper);
    }
}
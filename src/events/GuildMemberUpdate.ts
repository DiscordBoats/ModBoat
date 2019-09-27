import { Guild, Member } from 'eris';
import Client from '../structures/Client';
import Event from '../structures/Event';
import { Punishment, PunishmentType } from '../structures/managers/PunishmentManager';

export default class GuildMemberUpdate extends Event {
    constructor(client: Client) {
        super(client, 'guildMemberUpdate');
    }


    async emit(guild: Guild, member: Member, old: {roles: String[], nick: String}) {
        if (member.nick != old.nick) {
            this.client.autoModService.handleMemberNameUpdate(member);
        }
    }
}
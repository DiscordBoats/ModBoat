import { Punishment, PunishmentType } from '../../structures/managers/PunishmentManager';
import { Constants } from 'eris';
import NinoClient from '../../structures/Client';
import findUser from '../../util/UserUtil';
import Command from '../../structures/Command';
import Context from '../../structures/Context';
import PermissionUtils from '../../util/PermissionUtils';

export default class UnmuteCommand extends Command {
    constructor(client: NinoClient) {
        super(client, {
            name: 'unmute',
            description: 'Unmutes a user from a guild',
            usage: '<user> [--reason]',
            category: 'Moderation',
            guildOnly: true,
            userpermissions: Constants.Permissions.banMembers,
            botpermissions: Constants.Permissions.banMembers
        });
    }

    async run(ctx: Context) {
        if (!ctx.args.has(0)) return ctx.send('Sorry but you will need to specify a user.');

        const u = findUser(this.client, ctx.args.get(0))!;
        if (!u) {
            return ctx.send('I can\'t find this user!')
        }
        const member = ctx.guild.members.get(u.id);

        if (!member || member === null) return ctx.send(`User \`${u.username}#${u.discriminator}\` is not in this guild?`);

        if (!PermissionUtils.above(ctx.me, member))
            return ctx.send('The user is above me in the heirarchy.')

        let reason = (ctx.flags.get('reason') || ctx.flags.get('r'));
        if (typeof reason === 'boolean') return ctx.send('You will need to specify a reason');

        const punishment = new Punishment(PunishmentType.Unmute, { moderator: ctx.sender });
        await ctx.send('User successfully unmuted.')
        await this.client.punishments.punish(member!, punishment, (reason as string | undefined));
    }
}